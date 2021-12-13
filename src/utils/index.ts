import { Nullable } from "@/types"

export const useDebounce = (cb: Function, delay = 300) => {
  let timer: Nullable<NodeJS.Timer> = null

  return (...args: unknown[]) => {
    timer && clearTimeout(timer)
    timer = setTimeout(() => cb(...args), delay)
  }
}
