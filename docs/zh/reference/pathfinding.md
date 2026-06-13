# 寻路系统

MovementSync 使用 **D\* Lite** 进行路径规划——一种增量搜索算法，当世界在机器人脚下发生变化时能够以较低代价重新规划。相关代码位于 `xin.bbtt.pathfinding` 包。

## 流程

```
目标 ──▶ DStarLite.findPath(maxExpansions) ──▶ List<PathStep> ──▶ PathMovement
            │
            └─ 通过向每个 MovementStrategy 请求出边来扩展节点
```

1. 由 `start` 与 `goal` 两个 `Node`（整数块坐标）以及 `World` 构建一个 `DStarLite`。
2. `findPath(int limit)` 在至多 `limit` 次节点扩展内搜索，返回一个 `List<PathStep>`。`MovementSync.triggerAutoRepath()` 使用的上限是 `2000`。
3. 每个 `PathStep` 携带目标节点，以及到达该节点所走边的 `MovementType`。
4. 结果被包装进 `PathMovement` 并交给 `MovementController`。

```java
Node start = new Node(sx, sy, sz);
Node goal  = new Node(gx, gy, gz);

DStarLite pathfinder = new DStarLite(start, goal, MovementSync.INSTANCE.getWorld());
List<PathStep> path  = pathfinder.findPath(2000);
if (path.size() > 1) {
    MovementSync.INSTANCE.getMovementController().cancelAll();
    MovementSync.INSTANCE.getMovementController().addMovement(new PathMovement(path));
}
```

## MovementType——一条边“是什么”

每条图边都带有一个 `MovementType`，描述机器人如何通过它。标准集合是 `BuiltinMovementType`：

| 类型 | 含义 |
|------|------|
| `WALK` | 走到一个已经可站立的相邻方块。 |
| `DIG` | 穿过一个必须先挖掉的障碍（自动选择最佳工具）。 |
| `JUMP` | 向上跳一格。 |
| `FALL` | 下落到更低的可站立方块。 |
| `GAP_JUMP` | 疾跑跳跃越过 1–2 格的空隙。 |
| `BRIDGE` | 在前方脚部高度放置一个方块并走上去。 |
| `PILLAR` | 跳跃的同时在脚下放置方块以抬升高度。 |

`MovementType` 是一个接口，因此其他插件可以定义自己的类型：

```java
public interface MovementType {
    String name();

    /** 通过这条边的 Movement，返回 null 则使用默认的行走逻辑。 */
    default Movement createMovement(Node from, Node to) { return null; }

    /** 派发前机器人是否必须站在地面上？ */
    default boolean requiresGroundToDispatch() { return true; }

    /** 当 createMovement 返回 null 时，跟随器是否可以退化为行走？ */
    default boolean canWalkWhenNoMovement() { return true; }
}
```

非 null 的 `createMovement` 结果会被**插入到路径跟随器之前**，跟随器在它结束后继续。`BRIDGE` 与 `PILLAR` 返回 `canWalkWhenNoMovement() == false`：如果它们无法执行（例如快捷栏没方块了），跟随器会**重新规划**，而不会径直走进本应被填上的空隙。

## MovementStrategy——生成边

图是惰性构建的。对于它访问的每个节点，搜索都会向每个已注册的 `MovementStrategy` 询问从该节点出发的边：

```java
public interface MovementStrategy {
    /** 从节点 u 出发的所有可达出边，每条带有目标节点与代价。 */
    List<Edge> findEdges(Node u, World world);
}
```

`xin.bbtt.pathfinding` 中的内置策略包括 `WalkStrategy`、`JumpStrategy`、`FallStrategy`、`GapJumpStrategy` 和 `BridgePillarStrategy`。添加你自己的策略可以教会寻路器新的移动方式（如梯子、游泳、鞘翅），并为它返回的边附加自定义的 `MovementType`。

## 重新规划

世界是动态的，路径会过时。两个入口可触发重新规划：

- `MovementSync.triggerAutoRepath()`——对活动目标（或跟随目标）运行一次全新的完整搜索，并换入一个新的 `PathMovement`。
- `MovementSync.requestRepath()`——让**当前的** `PathMovement` 原地重新计算。

方块更新与区块事件经过节流处理，使频繁的世界变化不会拖垮寻路器；区块**卸载**不会触发重新规划。
