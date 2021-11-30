
import { useState } from "react"
import { useSelector } from "react-redux"
import type { Store } from "@/store/index"
import { invokePre } from "@/libs/channel"

import "./index.less"

export default () => (
  <div className="aside">
    <Tree />
  </div>
)

const Tree = () => {
  const projectRoot = useSelector<Store>(state => state.projectRoot)
  const [list, setList] = useState<string[]>([])
  invokePre("readDir", projectRoot).then(res => setList(res as string[]))

  console.log(list)

  return (
    <div>
      <ul className="tree">
        <li className="tree-item">
          <div className="head">
            <span className="icon iconfont">&#xe666;</span>
            <span className="title">node_modules</span>
          </div>
          <div className="content"></div>
        </li>

        <li className="tree-item">
          <div className="head">
            <span className="icon iconfont">&#xe665;</span>
            <span className="title">public</span>
          </div>
          <div className="content">
            <ul className="tree">
              <li className="tree-item">
                <div className="head">
                  <span className="icon iconfont">&#xe666;</span>
                  <span className="title">node_modules</span>
                </div>
                <div className="content"></div>
              </li>

              <li className="tree-item">
                <div className="head">
                  <span className="icon iconfont">&#xe665;</span>
                  <span className="title">public</span>
                </div>
                <div className="content"></div>
              </li>

              <li className="tree-item">
                <div className="head">
                  <span className="icon iconfont">&#xe688;</span>
                  <span className="title">index.js</span>
                </div>
              </li>
            </ul>
          </div>
        </li>

        <li className="tree-item">
          <div className="head">
            <span className="icon iconfont">&#xe688;</span>
            <span className="title">index.js</span>
          </div>
        </li>
      </ul>
    </div>
  )
}