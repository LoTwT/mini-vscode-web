import { useContext } from "react"
import { useSelector } from "react-redux"

import Tree from "./components/Tree"
import type { Store } from "@/types/store"

import "./index.less"
import themeContext from "@/theme/theme"

export default () => {
  const theme = useContext(themeContext)

  const projectRoot = useSelector((state: Store) => state.projectRoot)

  return (
    <div
      style={{
        width: `${theme.aside.width}px`,
        backgroundColor: theme.aside.backgroundColor
      }}
    >
      <Tree root={projectRoot} />
    </div>
  )
}