# Commands

MovementSync registers the following commands with xinbot. Arguments in
`<angle brackets>` are required; arguments in `[square brackets]` are optional.

## Position & Look

| Command | Usage | Description |
|---------|-------|-------------|
| `whereami` | `whereami` | Show current position and rotation. Alias: `pos`. |
| `lookat` | `lookat <x> <y> <z>` | Look at a coordinate. |
| `lookatentity` | `lookatentity <entityId>` | Look at an entity by its ID. |
| `cansee` | `cansee <x> <y> <z>` | Check whether a point is visible from the bot's head position. |

## Movement

| Command | Usage | Description |
|---------|-------|-------------|
| `jump` | `jump` | Perform a single jump. |
| `walk` | `walk <direction> [ms]` | Walk in a direction for a duration (milliseconds). |
| `goto` | `goto <x> <y> <z>` | Pathfind to a coordinate. |
| `follow` | `follow <entityId> [keepRadius]` | Continuously pathfind to follow an entity, keeping an optional radius. |
| `ride` | `ride <entityId>` / `ride dismount` | Mount an entity or dismount. Alias: `mount`. |
| `movement` | `movement <pause\|resume\|cancel>` | Control the [MovementController](/reference/movement-controller) queue. |
| `stop` | `stop` | Stop all movement and clear the active goal. |

## World & Blocks

| Command | Usage | Description |
|---------|-------|-------------|
| `getblockat` | `getblockat <x> <y> <z>` | Get block info at a coordinate. Alias: `block`. |
| `ispassable` | `ispassable <x> <y> <z>` | Check whether a block is passable. |
| `interactblock` | `interactblock <x> <y> <z> <start_dig\|finish_dig\|cancel_dig>` | Interact with / dig a block. |

## Entities & Inventory

| Command | Usage | Description |
|---------|-------|-------------|
| `entities` | `entities [filter]` | List entities in the world, optionally filtered. |
| `interactentity` | `interactentity <id> <attack\|interact>` | Attack or interact with an entity. |
| `inventory` | `inventory` | Show the bot's inventory. Alias: `inv`. |
| `container` | `container [list]` | Show the current open container's content. Alias: `ct`. |

## Debugging

| Command | Usage | Description |
|---------|-------|-------------|
| `debug` | `debug` | Print debug state: position, velocity and current movement info. Alias: `state`. |

::: tip Pathfinding vs. raw movement
`goto` and `follow` run the full pathfinder ([D* Lite](/reference/pathfinding))
and feed the result into the `MovementController`. `walk` and `jump` are raw,
unplanned actions — handy for testing but they don't avoid obstacles.
:::
