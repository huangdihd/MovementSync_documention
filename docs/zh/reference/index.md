# 开发者参考

本节面向希望从代码中驱动 MovementSync 或扩展其行为的插件开发者。终端用户命令请见 [命令列表](/zh/guide/commands) 页面。

## 架构速览

MovementSync 实现了 xinbot 的 `Plugin` 接口。入口类 `xin.bbtt.MovementSync` 负责注册数据包监听器并启动定时循环，同时以单例形式暴露主要子系统：

```java
MovementSync ms = MovementSync.INSTANCE;

ms.getWorld();              // 本地世界模型（方块 + 实体）
ms.getMovementController(); // Movement 的队列 / 执行器
ms.getInventoryManager();   // 快捷栏、工具选择、方块查找
```

### 两个定时循环

| 循环 | 周期 | 职责 |
|------|------|------|
| **物理模拟** | 50 ms（20 TPS） | `updateMotionTask` 积分速度、施加重力（每 tick `-0.08`，终端速度 `-3.92`）、处理落地碰撞，并发送移动数据包。 |
| **移动执行** | 50 ms（20 TPS） | `MovementController` 通过 `MovementTask` 驱动当前 `Movement`。 |

机器人状态（`position`、`velocity`、`pitch`、`yaw`、`onGround`）保存在 `AtomicReference` / `AtomicBoolean` 字段中，使数据包监听线程与定时循环能安全共享状态。

### 核心构件

- **[MovementController](./movement-controller)**——一个有序的 `Movement` 队列，同一时刻只执行一个。支持追加、即时插入、暂停 / 恢复与取消。
- **`Movement`**——动作的最小单元（行走、跳跃、挖掘、放置、看向、跟随路径……）。一个带 `init` / `onTick` / `onStop` 生命周期的抽象类。
- **[寻路系统](./pathfinding)**——在由可插拔 `MovementStrategy` 构建的图上进行 D* Lite 搜索，产出由 `PathMovement` 跟随的 `PathStep`。
- **[世界模型](./world)**——基于区块的方块视图与实体注册表，由数据包监听器填充。

## 快速示例：走到某处

```java
import xin.bbtt.MovementSync;
import org.joml.Vector3i;

MovementSync ms = MovementSync.INSTANCE;

// 设置目标，让寻路器规划并执行一条到达该目标的路线。
ms.setActiveGoal(new Vector3i(100, 64, -200));
ms.triggerAutoRepath();
```

`triggerAutoRepath()` 会从当前位置向活动目标（或被跟随的实体）运行 D* Lite，然后用一个全新的 `PathMovement` 替换控制器队列。调用 `requestRepath()` 可让正在执行的 `PathMovement` 在途中重新计算。

## `MovementSync` 上的辅助方法

| 方法 | 作用 |
|------|------|
| `jump()` | 若在地面上，施加向上的冲量（`+0.42`）。 |
| `lookAt(Vector3d)` | 入队一个 `LookAtMovement`，平滑转向某点。 |
| `directLookAt(Vector3d)` | 立即设置 `pitch` / `yaw` 指向某点。 |
| `getHeadPosition()` | 视点位置（`position` 的 Y 加 `1.62`）。 |
| `isRiding()` / `getVehicleId()` | 骑乘时的载具状态。 |
| `triggerAutoRepath([keepDistance])` | 规划并派发一条到活动目标 / 跟随目标的路径。 |
| `requestRepath()` | 让当前 `PathMovement` 重新规划。 |

继续阅读 [MovementController](./movement-controller) 了解执行模型。
