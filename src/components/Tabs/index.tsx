import "./index.less"
import type { ITabs } from "../../App"

interface IProps {
  tabs: ITabs[]
  cur: string
  onChange: (curTab: string) => void
}

export default ({ tabs, cur, onChange }: IProps) => {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <div
          className={`tab ${cur === tab.key ? "cur" : ""}`}
          key={tab.key}
          onClick={() => onChange(tab.key)}
        >
          {tab.title}
        </div>
      ))}
    </div>
  )
}
