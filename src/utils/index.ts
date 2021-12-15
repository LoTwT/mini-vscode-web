import { Nullable } from "@/types"

export const useDebounce = (cb: Function, delay = 300) => {
  let timer: Nullable<NodeJS.Timer> = null

  return (...args: unknown[]) => {
    timer && clearTimeout(timer)
    timer = setTimeout(() => cb(...args), delay)
  }
}

export const extend = <T>(newObj: T, oldObj: T) => {
  for (const key in oldObj) {
    if (!newObj[key]) newObj[key] = oldObj[key]
    else {
      if (typeof oldObj[key] === "object") {
        newObj[key] = extend(newObj[key], oldObj[key])
      }
    }
  }

  return newObj
}
