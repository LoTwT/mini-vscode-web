import { useContext } from "react"

import "./index.less"
import themeContext from "@/theme/theme"

export default () => {
  const theme = useContext(themeContext)

  return (
    <div
      className="status-bar"
      style={{
        height: `${theme.statusBar.height}px`,
        lineHeight: `${theme.statusBar.height}px`,
        color: theme.statusBar.color,
        backgroundColor: theme.statusBar.backgroundColor
      }}
    >
      status bar
    </div>
  )
}
