interface ITreeItemProp {
  title: string
  icon: string
  children?: JSX.Element
}

const TreeItem = ({ title, icon, children }: ITreeItemProp) => (
  <li className="tree-item">
    <div className="head">
      <span className={`icon iconfont icon-${icon}`}></span>
      <span className="title">{title}</span>
    </div>
    <div className="content">{children}</div>
  </li>
)

export default TreeItem