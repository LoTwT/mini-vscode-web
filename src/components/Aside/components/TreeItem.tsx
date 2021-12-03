interface ITreeItemProp {
  title: string
  icon: string
  children?: JSX.Element
  onClick: () => void
}

const TreeItem = ({ title, icon, children, onClick }: ITreeItemProp) => (
  <li className="tree-item">
    <div className="head">
      <span className={`icon iconfont icon-${icon}`}></span>
      <span className="title" onClick={onClick}>{title}</span>
    </div>
    <div className="content">{children}</div>
  </li>
)

export default TreeItem