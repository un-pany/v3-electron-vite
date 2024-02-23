declare namespace NodeJS {
  interface ProcessEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_BASE_API: string
  }
}

/** 声明 vite 环境变量的类型（如果未声明则默认是 any） */
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_BASE_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
