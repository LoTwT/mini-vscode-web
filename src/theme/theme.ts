import { createContext } from "react"
import { Nullable } from "@/types"

export interface IThemeContext {
  color: string
}

export const defaultTheme: IThemeContext = {
  color: "lightblue"
}
const themeContext = createContext<IThemeContext>(defaultTheme)

export default themeContext
