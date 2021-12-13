import { useState, useRef, useContext } from "react"

import "./index.less"
import Editor from "./components/Editor/Editor"
import Autocomplete from "./components/Autocomplete/Autocomplete"
import { Nullable, Undefinedable } from "@/types"
import { useDebounce } from "@/utils"
import themeContext from "@/theme/theme"
import { calcLineHeight } from "@/utils/theme"

export default () => {
  const theme = useContext(themeContext)
  const themeLineHeight = calcLineHeight(theme.editor.fontSize, theme.editor.lineHeigtRate)

  const [word, setWord] = useState("")

  const editorRef = useRef<Nullable<any>>(null)

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

  const [ext, setExt] = useState<Nullable<string>>(null)

  const handleAutocompleteEnterDown = (value: string) => {
    editorRef.current.onEnterDown(value)
    setWord("")
  }

  const [scrollPos, setScrollPos] = useState([0, 0])

  return (
    <div className="editor-content">
      <Editor
        ref={editorRef}
        onExtChange={setExt}
        onWordChange={setWord}
        onCursorPosChange={setCursorPos}
        onKeyDown={handleKeyDown}
        onScroll={setScrollPos}
      />
      <Autocomplete
        ref={autocompleteRef}
        ext={ext}
        keyword={word}
        x={cursorPos[0] && (cursorPos[0] - scrollPos[0])}
        y={cursorPos[1] && (cursorPos[1] + themeLineHeight - scrollPos[1])}
        onVisibleChange={setAutocompleteVisible}
        onEnterDown={handleAutocompleteEnterDown}
      />
    </div>
  )
}
