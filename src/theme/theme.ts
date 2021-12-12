import { createContext } from "react"
import { Nullable } from "@/types"

export interface IThemeContext {
  main: {
    color: string
    backgroundColor: string
  },

  tabs: {
    height: number
    backgroundColor: string
    tabBackgroundColor: string
    tabPadding: {
      top: number
      right: number
      bottom: number
      left: number
    }
  },

  statusBar: {
    height: number
    color: string
    backgroundColor: string
  }
}

export const defaultTheme: IThemeContext = {
  main: {
    color: "#fff",
    backgroundColor: "#1e1e1e"
  },

  tabs: {
    height: 35,
    backgroundColor: "#252525",
    tabBackgroundColor: "#2d2d2d",
    tabPadding: {
      top: 0,
      right: 50,
      bottom: 0,
      left: 32
    }
  },

  statusBar: {
    height: 22,
    color: "#fff",
    backgroundColor: "#007acc"
  }
}
const themeContext = createContext<IThemeContext>(defaultTheme)

export default themeContext
