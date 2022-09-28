# 简介

🥳 `Electron` + `Vue3` + `Vite` + `Pinia` + `Element-Plus` + `TypeScript`.

renderer 渲染进程中源码来自 [v3-admin-vite](https://github.com/un-pany/v3-admin-vite).

## 运行项目

```bash
# config
1. 安装 .vscode 中推荐的插件
2. node 版本 16+

# enter the project directory
cd v3-electron-vite

# install dependency
yarn

# initialize husky
yarn prepare

# develop
yarn dev

# build
yarn build

# build dir
yarn build:dir

# update dependencies
yarn upgrade-interactive --latest
```

## 代码格式检查

```bash
yarn lint
```

## 目录结构

一旦启动或打包脚本执行过，会在根目录产生 **`dist` 文件夹，里面的文件夹同 `src` 一模一样**；在使用一些路径计算时，尤其是相对路径计算；`dist` 与 `src` 里面保持相同的目录结构能避开好多问题.

```tree
├── .v3-electron-vite
├   ├── build.mjs                    项目构建脚本，对应 yarn build
├   ├── dev-runner.mjs               项目开发脚本，对应 yarn dev
├   ├── vite-main.config.ts          主进程配置文件，编译 src/main
├   ├── vite-preload.config.ts       预加载脚本配置文件，编译 src/preload
├   ├── vite-renderer.config.ts      渲染进程配置文件，编译 src/renderer
├
├── dist                             构建后，根据 src 目录生成
├   ├── main
├   ├── preload
├   ├── renderer
├
├── src
├   ├── main                         主进程源码
├   ├── preload                      预加载脚本源码
├   ├── renderer                     渲染进程源码
├
├── static                           静态资源
├   ├── icons                        系统图标
```

## 渲染进程使用 Node API

> 🚧 因为安全的原因 Electron 默认不支持在 渲染进程 中使用 NodeJs API

#### 推荐所有的 NodeJs、Electron API 通过 `preload-script` 注入到 渲染进程中，例如：

- **src/preload/index.ts**

  ```typescript
  import { contextBridge, ipcRenderer } from "electron"

  // --------- Expose some API to Renderer process. ---------
  contextBridge.exposeInMainWorld("$ipcRenderer", withPrototype(ipcRenderer))
  ```

- **src/renderer/@types/shims-vue.d.ts**

  ```typescript
  interface Window {
    $ipcRenderer: typeof import("electron")["ipcRenderer"]
  }
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
