import { useState } from "react"

import "./App.less"
import StatusBar from "./components/StatusBar"
import Aside from "./components/Aside"
import Tabs from "./components/Tabs"
import Content from "./components/Content"

export interface ITabs {
  key: string
  title: string
}

const tabs: ITabs[] = [
  { key: "e:\\tmp\\react-1\\src\\index.js", title: "index.js" },
  { key: "e:\\tmp\\react-1\\src\\App.js", title: "App.js" },
  { key: "e:\\tmp\\react-1\\src\\1.css", title: "1.css" },
]

function App() {
  const [cur, setCur] = useState(tabs[0].key)

  return (
    <div className="app-container">
      <div className="main-container">
        {/* aside */}
        <Aside />

        {/* content */}
        <div className="content-container">
          {/* content tabs */}
          <Tabs tabs={tabs} cur={cur} onChange={setCur} />

          {/* content content */}
          <Content filepath={cur} />
        </div>
      </div>
      <StatusBar />
    </div>
  )
}

export default App
