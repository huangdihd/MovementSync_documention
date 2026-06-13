# 常见问题

## MovementSync 是什么？

它是 [xinbot](https://github.com/huangdihd/xinbot) 的一个插件，为机器人提供一具“身体”：模拟物理（重力、速度、落地检测），维护一份本地世界模型，并提供寻路与命令，让机器人能够移动并与地形交互。

## 它能独立运行吗？

不能。MovementSync 是 xinbot 插件，需要一个运行中的 xinbot 实例（`2.0.0-RELEASE` 或更新版本）。把 JAR 放进 xinbot 的插件目录并启动 xinbot 即可。

## 用 `goto` 时机器人不动，怎么回事？

几个常见原因：

- **目标区块未加载。** 寻路只能在客户端已接收到的世界范围内进行。请确保机器人靠近、或已经加载了你要经过的区域。
- **在搜索上限内找不到路径。** `goto` 对搜索有上限（见 [寻路系统](/zh/reference/pathfinding)）。过长或被阻断的路线可能超限；可以尝试设置一个中间路径点。
- **机器人被暂停了。** 执行 `movement resume`，或用 `stop` 清空状态后重试。

执行 `debug` 可以查看当前位置、速度和正在执行的移动。

## 为什么机器人会在寻路时挖掘 / 放置方块？

寻路器可以选择超出单纯行走的移动类型——用 `DIG` 清除障碍，用 `BRIDGE` / `PILLAR` 跨越空隙或向上搭建。挖掘会自动从快捷栏选择最佳工具；搭桥和叠柱则需要快捷栏中有可放置的方块。如果没有可用方块，机器人会重新规划，而不会径直走进空隙。

## 我能从自己的插件里控制它吗？

可以。MovementSync 暴露了它的 `MovementController`、世界模型和寻路器。你还可以定义自定义的移动类型与策略。详见 [**开发者参考**](/zh/reference/)。

## 支持哪些 Minecraft / xinbot 版本？

它面向 xinbot `2.0.0-RELEASE` 所支持的协议。请让 xinbot 与 MovementSync 的版本大致保持同步；版本相关的细节请查看 [Releases](https://github.com/huangdihd/MovementSync/releases) 发布说明。

## 如何反馈 Bug 或提出功能请求？

在 [GitHub](https://github.com/huangdihd/MovementSync/issues) 上提交 issue。附上一份 `debug` 输出和相关日志会很有帮助。
