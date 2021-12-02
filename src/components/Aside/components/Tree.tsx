import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { invokePre } from "@/libs/channel"
import type { Nullable } from "@/types/index"
import type { IDirectoryContent } from "@/types/file"
import TreeItem from "./TreeItem"
import { ICON_MAP } from "../config/index"
import type { Store } from "@/types/store"

interface ITreeProp {
  root: string
}

const Tree = ({ root }: ITreeProp) => {
  const [list, setList] = useState<Nullable<IDirectoryContent[]>>(null)

  useEffect(() => {
    invokePre<IDirectoryContent[]>("readDir", root).then(res => {
      // 对读取到的文件夹内容进行排序
      // 1. 类型 文件夹 -> 文件
      // 2. 名字
      res.sort((o1, o2) => o1.name.localeCompare(o2.name))
      res.sort((o1, o2) => (+o2.isDir - +o1.isDir))

      setList(res)
    })
  }, [root])

  const openDirs = useSelector((state: Store) => state.openDirs)

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

    return (
      <TreeItem key={filepath} title={name} icon={icon}>
        {children}
      </TreeItem>
    )
  }

  return (<div>
    <ul className="tree">
      {list && list.map(RenderItem)}
    </ul >
  </div >)
}

export default Tree