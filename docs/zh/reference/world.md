# 世界模型

`xin.bbtt.world.World` 是 MovementSync 的本地世界视图：已加载区块中的方块，以及客户端已知的实体。数据包监听器负责保持它的最新状态；寻路与移动从中读取数据。通过 `MovementSync.INSTANCE.getWorld()` 访问。

## 方块

```java
World world = MovementSync.INSTANCE.getWorld();
Vector3d pos = new Vector3d(100, 64, -200);

int rawId            = world.getBlockAt(pos);        // 方块状态 id
BlockState state     = world.getBlockStateAt(pos);   // 丰富的方块状态信息
boolean canStandThru = world.isPassable(pos);        // 空气 / 无碰撞
boolean solid        = world.isSolid(pos);           // 完整碰撞
boolean grounded     = world.isOnGround(pos);        // 正下方为实心方块
```

`BlockState`（`xin.bbtt.Block.BlockState`）暴露了寻路器与移动策略所依赖的属性，包括 `isPassable()`、`isSolid()`、`diggable()`、`material()` 和 `blockName()`。方块 id 由 `BlockStateParser` 从内置的 `blocks.json` 注册表解析。

### 世界边界

```java
World.getMinWorldY();          // 最低建筑 Y
World.getMaxWorldY();          // 最高建筑 Y
World.isWithinWorldBounds(y);  // 边界检查
```

### 区块感知

寻路只能在已加载的区块上进行。在规划前先检查：

```java
Vector3i chunk = world.getChunk(pos);              // 某位置的区块坐标
boolean loaded = world.chunkLoaded(chunkX, chunkZ);
```

区块数据通过 `ClientboundLevelChunkWithLightPacket` 到达；单个编辑通过 block-update 与 section-blocks-update 数据包到达。`World` 会随到随用地应用它们，并在收到 `ClientboundForgetLevelChunkPacket` 时遗忘区块。

## 视线

```java
boolean visible = world.canSee(start, end);             // 点到点射线
boolean blockVisible = world.canSeeBlock(start, target); // 到某方块的射线
```

这正是 `cansee` 命令的底层（射线从机器人头部位置 `position + 1.62`（Y 轴）投出）。

## 实体

`World` 同时跟踪服务器流式下发的实体：

```java
Entity e = world.getEntity(entityId);   // xin.bbtt.Entity.Entity，或 null
Vector3d ep = e.getPosition();
```

实体的 add / move / rotate / remove / metadata 数据包通过对应的 `handle...Packet` 方法应用，由 `EntityPacketListener` 提供数据。`follow`、`ride` 和 `entities` 命令都构建在此之上。

## 数据从何而来

`World` 仅由 MovementSync 在 `MovementSync#onEnable` 中注册的数据包监听器（`ChunkDataListener`、`EntityPacketListener`、`InventoryPacketListener`、`TeleportPacketListener`……）进行修改。请在你自己的代码中把 `World` 视为**只读**——若要*改变*世界，请通过 [MovementController](./movement-controller) 发出移动（挖掘 / 放置），让机器人在服务器上执行动作，由此产生的数据包再来更新模型。
