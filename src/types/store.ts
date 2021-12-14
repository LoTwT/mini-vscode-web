export interface Store {
  projectRoot: string
  openDirs: string[]
  openTabs: string[]
  currTab: string
  tabStates: ITabStates
  globals: IGlobals
}

export interface ITabStates {
  [filename: string]: {
    scrollPos: [number, number]
    cursorPos: number
  }
}

export interface IGlobals {
  themes?: IThemePlugin[]
}

export interface IThemePlugin {
  label: string
  uiTheme: string
  path: string
}

export type StoreAction = CreateAction<Store> | {
  type: "replaceState",
  value: Store
}

type CreateAction<T, P extends keyof T = keyof T> = P extends P ? {
  type: `set${Capitalize<P & string>}`,
  value: T[P & string]
} : never
