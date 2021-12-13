import { createContext } from "react"

export interface IThemeContext {
  main: {
    color: string
    backgroundColor: string
  }

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
  }

  statusBar: {
    height: number
    color: string
    backgroundColor: string
  }

  contextMenu: {
    color: string
    itemHeight: number
    backgroundColor: string
    activeBackgroundColor: string
    activeColor: string
    highlightColor: string
    border: {
      width: number
      style: string
      color: string
    }
    padding: {
      top: number
      right: number
      bottom: number
      left: number
    }
  }

  autocomplete: {
    width: number
    maxHeight: number
  }

  aside: {
    width: number
    backgroundColor: string

    tree: {
      indent: number

      head: {
        height: number
        hoverBackgroundColor: string
        activeBackgroundColor: string
      }
    }
  }
}

const mainBgColor = "#1e1e1e"
const subBgColor = "#252525"
const foreground = "#fff"

export const defaultTheme: IThemeContext = {
  main: {
    color: foreground,
    backgroundColor: mainBgColor
  },

  tabs: {
    height: 35,
    backgroundColor: subBgColor,
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
  },

  contextMenu: {
    color: "#d4d4d4",
    itemHeight: 27,
    backgroundColor: subBgColor,
    activeBackgroundColor: "#094771",
    activeColor: "#fff",
    highlightColor: "#18a3ff",
    border: {
      width: 1,
      style: "solid",
      color: "#454545"
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 4
    }
  },

  autocomplete: {
    width: 430,
    maxHeight: 326
  },

  aside: {
    width: 260,
    backgroundColor: subBgColor,

    tree: {
      indent: 10,

      head: {
        height: 30,
        hoverBackgroundColor: "#37373d",
        activeBackgroundColor: "rgba(255, 255, 255, 0.2)"
      }
    }
  }
}
const themeContext = createContext<IThemeContext>(defaultTheme)

export default themeContext
