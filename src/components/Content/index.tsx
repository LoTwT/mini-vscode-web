import { useState, useRef } from "react"


import "./index.less"
import Editor from "./components/Editor/Editor"
import Autocomplete from "./components/Autocomplete/Autocomplete"
import { Nullable, Undefinedable } from "@/types"
import { useDebounce } from "@/utils"

export default () => {
  const [word, setWord] = useState("")

  const [cursorPos, _setCursorPos] = useState<[Undefinedable<number>, Undefinedable<number>]>([0, 0])
  const setCursorPos = useDebounce(_setCursorPos, 50)

  const [autocompleteVisible, setAutocompleteVisible] = useState(false)

  const autocompleteRef = useRef<Nullable<any>>(null)
  const handleKeyDown = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // ArrowDown
    // ArrowUp
    // Enter
    if (autocompleteVisible) {
      if (ev.key === "ArrowDown" || ev.key === "ArrowUp" || ev.key === "Enter") {
        ev.preventDefault()
        autocompleteRef.current.onKeyDown(ev.key)
      }
    }
  }

  return (
    <div className="editor-content">
      <Editor
        onWordChange={setWord}
        onCursorPosChange={setCursorPos}
        onKeyDown={handleKeyDown}
      />
      <Autocomplete
        ref={autocompleteRef}
        keyword={word}
        x={cursorPos[0]}
        y={cursorPos[1] && (cursorPos[1] + 26)}
        onVisibleChange={setAutocompleteVisible}
        onEnterDown={value => console.log(value)}
      />
    </div>
  )
}
