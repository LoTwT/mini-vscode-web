export interface Store {
  projectRoot: string
  openDirs: string[]
  openTabs: string[]
  currTab: string
}

export type StoreAction = CreateAction<Store>

type CreateAction<T, P extends keyof T = keyof T> = P extends P ? {
  type: `set${Capitalize<P & string>}`,
  value: T[P & string]
} : never
