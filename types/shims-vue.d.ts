declare module "*.scss" {
  const scss: Record<string, string>
  export default scss
}

declare module "virtual:*" {
  const result: any
  export default result
}
