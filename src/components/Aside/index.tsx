import { useSelector } from "react-redux"
import Tree from "./components/Tree"
import type { Store } from "@/store/index"

import "./index.less"

export default () => {
  const projectRoot = useSelector<Store, string>(state => state.projectRoot)
  const openkeys = ["src"]

  return (
    <div className="aside">
      <Tree root={projectRoot} openkeys={openkeys} />
    </div>
  )
}