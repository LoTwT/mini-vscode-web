import "./App.css"
import StatusBar from "./components/StatusBar"
import Aside from "./components/Aside"
import Tabs from "./components/Tabs"
import Content from "./components/Content"

function App() {
  return (
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
  )
}

export default App
