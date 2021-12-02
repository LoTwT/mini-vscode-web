import { useSelector } from "react-redux"
import Tree from "./components/Tree"
import type { Store } from "@/types/store"

import "./index.less"

export default () => {
  const projectRoot = useSelector((state: Store) => state.projectRoot)

  return (
    <div className="aside">
      <Tree root={projectRoot} />
    </div>
  )
}