import { ACTION_MAP } from "@/store/const"
import { Store } from "@/types/store"
import { getFileName } from "@/utils/path"
import { useSelector, useDispatch } from "react-redux"

import "./index.less"

export default () => {
  const dispatch = useDispatch()
  const openTabs = useSelector((state: Store) => state.openTabs)
  const currTab = useSelector((state: Store) => state.currTab)

  const onChangeTab = (newTab: string) => dispatch({ type: ACTION_MAP.SET_CURR_TAB, value: newTab })

  return (
    <div className="tabs">
      {openTabs.map((tab) => (
        <div
          className={`tab ${currTab === tab ? "cur" : ""}`}
          key={tab}
          onClick={() => onChangeTab(tab)}
        >
          {getFileName(tab)}
        </div>
      ))}
    </div>
  )
}
