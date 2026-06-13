# 命令列表

MovementSync 向 xinbot 注册了以下命令。`<尖括号>` 中的参数为必填，`[方括号]` 中的参数为可选。

## 位置与朝向

| 命令 | 用法 | 描述 |
|------|------|------|
| `whereami` | `whereami` | 显示当前位置和朝向。别名：`pos`。 |
| `lookat` | `lookat <x> <y> <z>` | 看向指定坐标。 |
| `lookatentity` | `lookatentity <entityId>` | 通过 ID 看向某个实体。 |
| `cansee` | `cansee <x> <y> <z>` | 检查从机器人头部位置能否看见某点。 |

## 移动

| 命令 | 用法 | 描述 |
|------|------|------|
| `jump` | `jump` | 执行一次跳跃。 |
| `walk` | `walk <direction> [ms]` | 向指定方向行走一段时间（毫秒）。 |
| `goto` | `goto <x> <y> <z>` | 寻路至指定坐标。 |
| `follow` | `follow <entityId> [keepRadius]` | 持续寻路跟随某个实体，可指定保持半径。 |
| `ride` | `ride <entityId>` / `ride dismount` | 骑乘实体或下车。别名：`mount`。 |
| `movement` | `movement <pause\|resume\|cancel>` | 控制 [MovementController](/zh/reference/movement-controller) 队列。 |
| `stop` | `stop` | 停止所有移动并清除当前目标。 |

## 世界与方块

| 命令 | 用法 | 描述 |
|------|------|------|
| `getblockat` | `getblockat <x> <y> <z>` | 获取指定坐标的方块信息。别名：`block`。 |
| `ispassable` | `ispassable <x> <y> <z>` | 检查方块是否可通行。 |
| `interactblock` | `interactblock <x> <y> <z> <start_dig\|finish_dig\|cancel_dig>` | 与方块交互 / 挖掘方块。 |

## 实体与背包

| 命令 | 用法 | 描述 |
|------|------|------|
| `entities` | `entities [filter]` | 列出世界中的实体，可按条件过滤。 |
| `interactentity` | `interactentity <id> <attack\|interact>` | 攻击或交互某个实体。 |
| `inventory` | `inventory` | 显示机器人的背包。别名：`inv`。 |
| `container` | `container [list]` | 显示当前打开容器的内容。别名：`ct`。 |

## 调试

| 命令 | 用法 | 描述 |
|------|------|------|
| `debug` | `debug` | 打印调试状态：位置、速度和当前移动信息。别名：`state`。 |

::: tip 寻路 vs. 原始移动
`goto` 和 `follow` 会运行完整的寻路器（[D* Lite](/zh/reference/pathfinding)）并把结果交给 `MovementController`。而 `walk` 和 `jump` 是原始、无规划的动作——便于测试，但不会绕过障碍。
:::
