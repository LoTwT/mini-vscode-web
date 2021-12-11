import { useState } from "react"


import "./index.less"
import Editor from "./components/Editor/Editor"
import Autocomplete from "./components/Autocomplete/Autocomplete"
import { Undefinedable } from "@/types"
import { useDebounce } from "@/utils"

export default () => {
  const [word, setWord] = useState("")
  const [cursorPos, _setCursorPos] = useState<[Undefinedable<number>, Undefinedable<number>]>([0, 0])
  const setCursorPos = useDebounce(_setCursorPos, 50)

  return (
    <div className="editor-content">
      <Editor
        onWordChange={setWord}
        onCursorPosChange={setCursorPos}
      />
      <Autocomplete
        keyword={word}
        x={cursorPos[0]}
        y={cursorPos[1] && (cursorPos[1] + 26)}
      />
    </div>
  )
}
