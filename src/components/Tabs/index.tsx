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
  const doClose = (
    ev: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    tab: string
  ) => {
    // 阻止冒泡
    ev.stopPropagation()

    const index = openTabs.indexOf(tab)
    if (index === -1) return

    // 移除 openTabs 中要关闭的 tab
    const newTabs = [...openTabs]
    newTabs.splice(index, 1)
    dispatch({ type: ACTION_MAP.SET_OPEN_TABS, value: newTabs })

    // 如果要关闭的 tab 是 currTab，重新设置 currTab
    // todo 重设 currTab 规则
    currTab === tab && dispatch({ type: ACTION_MAP.SET_CURR_TAB, value: newTabs[newTabs.length - 1] })
  }

  return openTabs.length !== 0 ? (
    <div className="tabs">
      {openTabs.map((tab) => (
        <div
          className={`tab ${currTab === tab ? "cur" : ""}`}
          key={tab}
          onClick={() => onChangeTab(tab)}
        >
          <span className="label">{getFileName(tab)}</span>
          <span className="close-btn" onClick={(ev) => doClose(ev, tab)}>x</span>
        </div>
      ))}
    </div>
  ) : null
}
