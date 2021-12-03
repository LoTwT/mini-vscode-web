import { Nullable } from "@/types"

export const getLocalStorage = <T>(key: string): Nullable<T> => {
  const cache = localStorage.getItem(key)
  return cache ? JSON.parse(cache) : null
}

export const setLocalStorage = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value))
