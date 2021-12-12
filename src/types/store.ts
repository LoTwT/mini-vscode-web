export interface Store {
  projectRoot: string
  openDirs: string[]
  openTabs: string[]
  currTab: string
  tabStates: ITabStates
}

export interface ITabStates {
  [filename: string]: {
    scrollPos: [number, number]
    cursorPos: [number, number]
  }
}

export type StoreAction = CreateAction<Store> | {
  type: "replaceState",
  value: Store
}

type CreateAction<T, P extends keyof T = keyof T> = P extends P ? {
  type: `set${Capitalize<P & string>}`,
  value: T[P & string]
} : never
