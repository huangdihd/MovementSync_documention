# Pathfinding

MovementSync plans routes with **D\* Lite**, an incremental search that can
cheaply re-plan when the world changes underneath the bot. The code lives in
`xin.bbtt.pathfinding`.

## Pipeline

```
goal ──▶ DStarLite.findPath(maxExpansions) ──▶ List<PathStep> ──▶ PathMovement
            │
            └─ expands nodes by asking each MovementStrategy for outgoing Edges
```

1. A `DStarLite` is built from a `start` and `goal` `Node` (integer block
   coordinates) plus the `World`.
2. `findPath(int limit)` searches up to `limit` node expansions and returns a
   `List<PathStep>`. `MovementSync.triggerAutoRepath()` uses a limit of `2000`.
3. Each `PathStep` carries the target node and the `MovementType` of the edge
   taken to reach it.
4. The result is wrapped in a `PathMovement` and handed to the
   `MovementController`.

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

## MovementType — what an edge *is*

Each graph edge has a `MovementType` describing how the bot traverses it. The
standard set is `BuiltinMovementType`:

| Type | Meaning |
|------|---------|
| `WALK` | Step onto an already-standable neighbour. |
| `DIG` | Walk through an obstacle that must be dug out first (auto-selects the best tool). |
| `JUMP` | Jump up one block. |
| `FALL` | Drop down to a lower standable block. |
| `GAP_JUMP` | Sprint-jump across a 1–2 block gap. |
| `BRIDGE` | Place a block ahead at foot level and walk onto it. |
| `PILLAR` | Place a block underfoot while jumping to gain height. |

`MovementType` is an interface, so other plugins can define their own:

```java
public interface MovementType {
    String name();

    /** Movement that traverses this edge, or null to use default walking. */
    default Movement createMovement(Node from, Node to) { return null; }

    /** Must the bot be on the ground before this is dispatched? */
    default boolean requiresGroundToDispatch() { return true; }

    /** May the follower fall back to walking when createMovement returns null? */
    default boolean canWalkWhenNoMovement() { return true; }
}
```

A non-null `createMovement` result is **inserted ahead** of the path follower,
which resumes once it finishes. `BRIDGE` and `PILLAR` return
`canWalkWhenNoMovement() == false`: if they can't run (e.g. the hotbar is out
of blocks) the follower **replans** rather than walking into the gap they were
meant to fill.

## MovementStrategy — generating edges

The graph is built lazily. For each node it visits, the search asks every
registered `MovementStrategy` for the edges leaving that node:

```java
public interface MovementStrategy {
    /** All reachable outgoing edges from node u, each with a target + cost. */
    List<Edge> findEdges(Node u, World world);
}
```

Built-in strategies in `xin.bbtt.pathfinding` include `WalkStrategy`,
`JumpStrategy`, `FallStrategy`, `GapJumpStrategy` and `BridgePillarStrategy`.
Add your own strategy to teach the pathfinder new ways to move (e.g. ladders,
swimming, elytra) and attach a custom `MovementType` to the edges it returns.

## Re-planning

The world is dynamic, so paths go stale. Two entry points trigger a re-plan:

- `MovementSync.triggerAutoRepath()` — runs a fresh full search to the active
  goal (or follow target) and swaps in a new `PathMovement`.
- `MovementSync.requestRepath()` — asks the **current** `PathMovement` to
  recompute in place.

Block-update and chunk events are throttled so frequent world changes don't
thrash the pathfinder; chunk **unloads** do not trigger re-paths.
