/** 延时器 */
export const delayer = (timeout?: number) =>
  new Promise<any>((resolve) => {
    let cd = 500
    if (typeof timeout === "number" && timeout > 0) {
      cd = timeout
    }
    setTimeout(resolve, cd)
  })
