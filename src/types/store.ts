export interface Store {
  projectRoot: string
  openDirs: string[]
}

export type StoreAction = CreateAction<Store, "openDirs">

type CreateAction<T extends Record<string, any>, P extends keyof T = keyof T> = P extends P ? {
  type: `set${Capitalize<P & string>}`,
  value: T[P]
} : never
