import { useState } from "react"

import "./App.less"
import StatusBar from "@/components/StatusBar/index"
import Aside from "@/components/Aside/index"
import Tabs from "@/components/Tabs/index"
import Content from "@/components/Content/index"
import ThemeContext, { defaultTheme, IThemeContext } from "@/theme/theme"

function App() {
  const [theme, setTheme] = useState<IThemeContext>(defaultTheme)

  return (
    <ThemeContext.Provider value={theme}>
      <div className="app-container">
        <div className="main-container">
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
    </ThemeContext.Provider>
  )
}

export default App
