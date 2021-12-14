import { useContext } from "react"
import { useSelector } from "react-redux"

import "./App.less"
import StatusBar from "@/components/StatusBar/index"
import Aside from "@/components/Aside/index"
import Tabs from "@/components/Tabs/index"
import Content from "@/components/Content/index"
import themeContext from "@/theme/theme"
import { Store } from "./types/store"


function App() {
  const themePlugins = useSelector((state: Store) => state.globals)?.themes

  const theme = useContext(themeContext)
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

  return (
    <themeContext.Provider value={theme}>
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
