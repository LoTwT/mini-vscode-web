import themeContext from "@/theme/theme"

import { useContext } from "react"

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
}: ITreeItemProp) => {
  const theme = useContext(themeContext)

  return (
    <li className="tree-item">
      <div
        className="head"
        style={{
          height: `${theme.aside.tree.head.height}px`,
          lineHeight: `${theme.aside.tree.head.height}px`
        }}
        onMouseEnter={ev => ev.currentTarget.style.backgroundColor = theme.aside.tree.head.hoverBackgroundColor}
        onMouseLeave={ev => ev.currentTarget.style.backgroundColor = ""}
      >
        <span className={`icon iconfont icon-${icon}`}></span>
        <span
          className="title"
          style={{
            backgroundColor: isActive
              ? theme.aside.tree.head.activeBackgroundColor
              : ""
          }}
          onClick={onClick}
        >
          {title}
        </span>
      </div>
      <div className="content">{children}</div>
    </li>
  )
}

export default TreeItem