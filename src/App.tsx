import { useContext, useState } from "react"
import { useSelector } from "react-redux"

import "./App.less"
import StatusBar from "@/components/StatusBar/index"
import Aside from "@/components/Aside/index"
import Tabs from "@/components/Tabs/index"
import Content from "@/components/Content/index"
import themeContext, { IThemeContext } from "@/theme/theme"
import { Store } from "./types/store"
import { invokePre } from "./libs/channel"
import { extend } from "./utils"


function App() {
  const themePlugins = useSelector((state: Store) => state.globals)?.themes
  const defaultTheme = useContext(themeContext)
  const [theme, setTheme] = useState<IThemeContext>(defaultTheme)

  const scrollStyle = `
    *::-webkit-scrollbar {
      width: ${theme.scrollBar.width}px;
    }

    *::-webkit-scrollbar-track {
      background: ${theme.scrollBar.backgroundColor};
    }

    *::-webkit-scrollbar-thumb {
      background: ${theme.scrollBar.foregroundColor};
    }
  `

  const changeTheme = async (index: number) => {
    const newTheme = themePlugins?.[index]

    if (newTheme?.path) {
      const themeJson = extend(JSON.parse(await invokePre("readFile", newTheme.path)), defaultTheme)
      setTheme(themeJson)
    } else {
      setTheme(defaultTheme)
    }
  }

  return (
    <themeContext.Provider value={theme}>
      {themePlugins && themePlugins.map((theme, index) => (
        <button
          type="button"
          key={index}
          onClick={() => changeTheme(index)}
        >
          主题-{theme.label}
        </button>
      ))}
      <div className="app-container">
        <div
          className="main-container"
          style={{
            color: theme.main.color,
            backgroundColor: theme.main.backgroundColor
          }}
        >
          {/* aside */}
          <Aside />

          {/* content */}
          <div className="content-container">
            {/* content tabs */}
            <Tabs />

            {/* content content */}
            <Content />
          </div>
        </div>
        <StatusBar />
      </div>
      {/* scroll style */}
      <style dangerouslySetInnerHTML={{ __html: scrollStyle }} />
    </themeContext.Provider>
  )
}

export default App
