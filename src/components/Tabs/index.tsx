import { useContext } from "react"
import { useSelector, useDispatch } from "react-redux"

import { ACTION_MAP } from "@/store/const"
import { Store } from "@/types/store"
import { getFileName } from "@/utils/path"
import themeContext from "@/theme/theme"

import "./index.less"

export default () => {
  const theme = useContext(themeContext)

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
    <div
      className="tabs"
      style={{
        height: `${theme.tabs.height}px`,
        backgroundColor: theme.tabs.backgroundColor
      }}
    >
      {openTabs.map((tab) => (
        <div
          className="tab"
          style={{
            lineHeight: `${theme.tabs.height}px`,
            backgroundColor: currTab === tab
              ? theme.main.backgroundColor
              : theme.tabs.tabBackgroundColor,
            padding: [
              `${theme.tabs.tabPadding.top}px`,
              `${theme.tabs.tabPadding.right}px`,
              `${theme.tabs.tabPadding.bottom}px`,
              `${theme.tabs.tabPadding.left}px`
            ].join(" ")
          }}
          key={tab}
          onClick={() => onChangeTab(tab)}
        >
          <span className="label">{getFileName(tab)}</span>
          <span
            className="close-btn"
            style={{
              color: theme.main.color
            }}
            onClick={(ev) => doClose(ev, tab)}
          >
            x
          </span>
        </div>
      ))}
    </div>
  ) : null
}
