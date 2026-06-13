# World Model

`xin.bbtt.world.World` is MovementSync's local view of the server world: the
blocks in loaded chunks and the entities the client knows about. Packet
listeners keep it up to date; pathfinding and movement read from it. Access it
via `MovementSync.INSTANCE.getWorld()`.

## Blocks

```java
World world = MovementSync.INSTANCE.getWorld();
Vector3d pos = new Vector3d(100, 64, -200);

int rawId            = world.getBlockAt(pos);        // block-state id
BlockState state     = world.getBlockStateAt(pos);   // rich block-state info
boolean canStandThru = world.isPassable(pos);        // air/non-colliding
boolean solid        = world.isSolid(pos);           // full collision
boolean grounded     = world.isOnGround(pos);        // solid block directly below
```

`BlockState` (`xin.bbtt.Block.BlockState`) exposes the properties the
pathfinder and movement strategies rely on, including `isPassable()`,
`isSolid()`, `diggable()`, `material()` and `blockName()`. Block ids are parsed
from the bundled `blocks.json` registry by `BlockStateParser`.

### World bounds

```java
World.getMinWorldY();          // lowest build Y
World.getMaxWorldY();          // highest build Y
World.isWithinWorldBounds(y);  // bounds check
```

### Chunk awareness

Pathfinding only works over loaded chunks. Check before routing:

```java
Vector3i chunk = world.getChunk(pos);              // chunk coords for a position
boolean loaded = world.chunkLoaded(chunkX, chunkZ);
```

Chunk data arrives via `ClientboundLevelChunkWithLightPacket`; individual
edits arrive via block-update and section-blocks-update packets. The `World`
applies these as they come, and forgets chunks on
`ClientboundForgetLevelChunkPacket`.

## Line of sight

```java
boolean visible = world.canSee(start, end);            // point-to-point ray
boolean blockVisible = world.canSeeBlock(start, target); // ray to a block
```

This backs the `cansee` command (rays are cast from the bot's head position,
`position + 1.62` on Y).

## Entities

The `World` also tracks entities streamed by the server:

```java
Entity e = world.getEntity(entityId);   // xin.bbtt.Entity.Entity, or null
Vector3d ep = e.getPosition();
```

Entity add/move/rotate/remove/metadata packets are applied through the
matching `handle...Packet` methods, fed by the `EntityPacketListener`. This is
what `follow`, `ride` and the `entities` command build on.

## Where the data comes from

The `World` is mutated exclusively by MovementSync's packet listeners
(`ChunkDataListener`, `EntityPacketListener`, `InventoryPacketListener`,
`TeleportPacketListener`, …) registered in `MovementSync#onEnable`. Treat the
`World` as **read-only** from your own code — to *change* the world, issue
movements (dig/place) through the [MovementController](./movement-controller)
so the bot performs the action on the server and the resulting packets update
the model.
