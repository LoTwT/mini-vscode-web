import { useState, useEffect, useContext } from "react"
import { useSelector, useDispatch } from "react-redux"
import { invokePre } from "@/libs/channel"
import type { Nullable } from "@/types/index"
import type { IDirectoryContent } from "@/types/file"
import TreeItem from "./TreeItem"
import { ICON_MAP } from "../config/index"
import type { Store } from "@/types/store"
import { ACTION_MAP, INVOKE_PRELOAD_MESSAGE } from "@/store/const"
import themeContext from "@/theme/theme"

interface ITreeProp {
  root: string
}

const Tree = ({ root }: ITreeProp) => {
  const theme = useContext(themeContext)

  const [list, setList] = useState<Nullable<IDirectoryContent[]>>(null)
  const dispatch = useDispatch()
  const { openDirs, openTabs, currTab } = useSelector((state: Store) => state)

  useEffect(() => {
    invokePre<IDirectoryContent[]>(INVOKE_PRELOAD_MESSAGE.READ_DIR, root).then(res => {
      // 对读取到的文件夹内容进行排序
      // 1. 类型 文件夹 -> 文件
      // 2. 名字
      res.sort((o1, o2) => o1.name.localeCompare(o2.name))
      res.sort((o1, o2) => (+o2.isDir - +o1.isDir))

      setList(res)
    })
  }, [root])

  const RenderItem = ({ name, isDir }: IDirectoryContent) => {
    const filepath = root + "\\" + name
    let icon = ""
    let children = undefined

    // 是文件夹
    if (isDir) {
      // 展开了
      if (openDirs.includes(filepath)) {
        icon = ICON_MAP.DIR_OPEND
        children = <Tree root={filepath} />
      } else {
        // 没展开
        icon = ICON_MAP.DIR_CLOSED
      }
    } else {
      // 是文件
      icon = ICON_MAP.JS
    }

    const onTreeItemClick = () => {
      // 切换打开状态
      if (isDir) {
        // 是文件夹
        const index = openDirs.indexOf(filepath)

        if (index === -1) {
          // 打开文件夹
          dispatch({ type: ACTION_MAP.SET_OPEN_DIRS, value: [...openDirs, filepath] })
        } else {
          // 关闭文件夹
          const newOpenDirs = [...openDirs]
          newOpenDirs.splice(index, 1)
          dispatch({ type: ACTION_MAP.SET_OPEN_DIRS, value: newOpenDirs })
        }
      } else {
        // 是文件
        if (!openTabs.includes(filepath)) {
          // 文件原先没被打开，添加到 openTabs 中
          dispatch({ type: ACTION_MAP.SET_OPEN_TABS, value: [...openTabs, filepath] })
        }

        // 无论如何都会跳转到点击的 tab (设置 currTab 为点击的 tab)
        dispatch({ type: ACTION_MAP.SET_CURR_TAB, value: filepath })
      }
    }

    return (
      <TreeItem
        key={filepath}
        title={name}
        icon={icon}
        isActive={filepath === currTab}
        onClick={onTreeItemClick}
      >
        {children}
      </TreeItem>
    )
  }

  return (<div>
    <ul
      style={{
        paddingLeft: `${theme.aside.tree.indent}px`
      }}
    >
      {list && list.map(RenderItem)}
    </ul >
  </div >)
}

export default Tree