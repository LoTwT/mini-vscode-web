import "./index.less"

export default () => (
  <div className="aside">
    <Tree />
  </div>
)

const Tree = () => (
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
