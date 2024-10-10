# 简介

🥳 `Electron` + `Vue3` + `Vite` + `Pinia` + `Element Plus` + `TypeScript`

- src 渲染进程的源码主要来自 [v3-admin-vite](https://github.com/un-pany/v3-admin-vite)
- 注意: **Electron23 开始不再支持 win7/8/8.1**

## 运行项目

```bash
# 配置
1. 一键安装 .vscode 目录中推荐的插件
2. node 版本 18.x 或 20+
3. pnpm 版本 8.x 或最新版

# 克隆项目
git clone https://github.com/un-pany/v3-electron-vite.git

# 进入项目目录
cd v3-electron-vite

# 安装依赖
pnpm i

# 启动服务
pnpm dev

# 升级所有依赖
pnpm up --latest
```

## 打包

打包配置，请参考文档 [electron-builder](https://www.electron.build/)

```bash
# 根据当前系统环境构建
pnpm build

# 打包成解压后的目录
pnpm build:dir

# 构建 linux 安装包, 已设置构建 AppImage 与 deb 文件
pnpm build:linux

# 构建 MacOS 安装包 (只有在 MacOS 系统上打包), 已设置构建 dmg 文件
pnpm build:macos

# 构建 x64 位 exe
pnpm build:win-x64

# 构建 x32 位 exe
pnpm build:win-x32
```

## 代码格式检查

```bash
pnpm lint
```

## 目录结构

```tree
├── script              主进程源码
├   ├── core            主窗口、系统菜单与托盘、本地日志等模块
├   ├── tool            一些工具类方法
├   ├── index.ts
├
├── src                 渲染进程源码
├   ├── api
├   ├── assets
├   ├── ......
├
├── static              静态资源
├   ├── icons           系统图标
```

## Git 提交规范

- `feat` 增加新的业务功能
- `fix` 修复业务问题/BUG
- `perf` 优化性能
- `style` 更改代码风格, 不影响运行结果
- `refactor` 重构代码
- `revert` 撤销更改
- `test` 测试相关, 不涉及业务代码的更改
- `docs` 文档和注释相关
- `chore` 更新依赖/修改脚手架配置等琐事
- `workflow` 工作流改进
- `ci` 持续集成相关
- `types` 类型定义文件更改
- `wip` 开发中

## 站在巨人的肩膀上

- [electron-vite-vue](https://github.com/electron-vite/electron-vite-vue)
- [electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin)
- [fast-vue3](https://github.com/study-vue3/fast-vue3)
