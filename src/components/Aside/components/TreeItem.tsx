interface ITreeItemProp {
  title: string
  icon: string
  isActive: boolean
  onClick: () => void
  children?: JSX.Element
}

const TreeItem = ({
  title,
  icon,
  isActive,
  children,
  onClick
}: ITreeItemProp) => (
  <li className="tree-item">
    <div className="head">
      <span className={`icon iconfont icon-${icon}`}></span>
      <span
        className={`title ${isActive ? "active" : ""}`}
        onClick={onClick}
      >
        {title}
      </span>
    </div>
    <div className="content">{children}</div>
  </li>
)

export default TreeItem