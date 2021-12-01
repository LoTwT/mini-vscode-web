
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { Store } from "@/store/index"
import { invokePre } from "@/libs/channel"
import type { Nullable } from "@/types/index"
import type { IDirectoryContent } from "@/types/file"

import "./index.less"

export default () => (
  <div className="aside">
    <Tree />
  </div>
)

const Tree = () => {
  const projectRoot = useSelector<Store>(state => state.projectRoot)
  const [list, setList] = useState<Nullable<IDirectoryContent[]>>(null)

  useEffect(() => {
    invokePre<IDirectoryContent[]>("readDir", projectRoot).then(res => {
      // 对读取到的文件夹内容进行排序
      // 1. 类型 文件夹 -> 文件
      // 2. 名字
      res.sort((o1, o2) => o1.name.localeCompare(o2.name))
      res.sort((o1, o2) => (+o2.isDir - +o1.isDir))

      setList(res)
    })
  }, [projectRoot])

  return (<div>
    <ul className="tree">
      {list && list.map(dirContent => dirContent.isDir
        ? <TreeItem title={dirContent.name} icon="arrow-right" />
        : <TreeItem title={dirContent.name} icon="js" />
      )}
    </ul >
  </div >)
}

interface ITreeItemProp {
  title: string
  icon: string
  content?: IDirectoryContent[]
}

const TreeItem = ({ title, icon, content }: ITreeItemProp) => (
  <li className="tree-item">
    <div className="head">
      <span className={`icon iconfont icon-${icon}`}></span>
      <span className="title">{title}</span>
    </div>
    <div className="content">{content}</div>
  </li>
)