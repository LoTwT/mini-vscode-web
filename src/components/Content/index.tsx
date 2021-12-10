import "./index.less"
import Editor from "./components/Editor/Editor"
import Autocomplete from "./components/Autocomplete/Autocomplete"

export default () => (
  <div className="editor-content">
    <Editor />
    <Autocomplete keyword={"win"} x={0} y={0} />
  </div>
)
