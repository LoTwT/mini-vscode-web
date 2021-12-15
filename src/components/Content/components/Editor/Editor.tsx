import { useState, useEffect, useMemo, useRef, forwardRef, useContext } from "react"
import { useSelector, useDispatch } from "react-redux"

import "highlight.js/styles/vs2015.css"
import "./Editor.less"

import hljs from "highlight.js"
import { invokePre } from "@/libs/channel"
import { ACTION_MAP, INVOKE_PRELOAD_MESSAGE } from "@/store/const"
import { Store } from "@/types/store"
import { Nullable, Undefinedable } from "@/types"
import Minimap from "../Minimap/Minimap"
import { textDiff } from "@/utils/textDiff"
import { getExtName } from "@/utils/path"
import themeContext from "@/theme/theme"
import { calcLineHeight } from "@/utils/theme"

const extMap: Record<string, string> = {
  ".js": "javascript",
  ".ts": "typescript",
  ".jsx": "javascript",
  ".tsx": "typescript",
  ".css": "css",
  ".less": "less",
  ".vue": "vue",
  ".html": "html",
  ".xml": "xml",
  ".json": "json"
}

interface IEditorProps {
  onExtChange: (ext: Nullable<string>) => void
  onWordChange: (word: string) => void
  onCursorPosChange: ([posLeft, posTop]: [Undefinedable<number>, Undefinedable<number>]) => void
  onKeyDown: (ev: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onScroll: (scrollPos: [number, number]) => void
}

const Editor = forwardRef(({
  onExtChange,
  onWordChange,
  onCursorPosChange,
  onKeyDown,
  onScroll
}: IEditorProps, ref: any) => {
  const theme = useContext(themeContext)
  const themeLineHeight = calcLineHeight(theme.editor.fontSize, theme.editor.lineHeigtRate)

  const currTab = useSelector((state: Store) => state.currTab)
  const tabState = useSelector((state: Store) => (state.tabStates || {})[currTab])

  /** ====================================================================================== */

  const dispatch = useDispatch()

  /** ====================================================================================== */

  const [ext, setExt] = useState<Nullable<string>>(null)

  const [codes, setCodes] = useState("")

  useEffect(() => {
    invokePre<string>(INVOKE_PRELOAD_MESSAGE.READ_FILE, currTab).then(setCodes)
    setExt(getExtName(currTab))
  }, [currTab])

  useEffect(() => {
    onExtChange(ext)
  }, [ext])

  /** ====================================================================================== */

  const editorRef = useRef<Nullable<HTMLDivElement>>(null)

  /** ====================================================================================== */

  const [selectionEnd, setSelectionEnd] = useState(tabState?.cursorPos || 0)
  const handleSelect = (ev: React.SyntheticEvent<HTMLTextAreaElement, Event>) => {
    setSelectionEnd(ev.currentTarget.selectionEnd)
  }

  useEffect(() => {
    const cursor = containerRef.current?.getElementsByClassName("selection")[0] as Undefinedable<HTMLSpanElement>
    onCursorPosChange([cursor?.offsetLeft, cursor?.offsetTop])
  }, [selectionEnd])

  /** ====================================================================================== */

  const html = useMemo(() => {
    const commentSpanStart = `<span class="hljs-comment">`
    const commentSpanEnd = "</span>"

    let html = ""

    if (ext && extMap[ext]) {
      html = hljs.highlight(codes, { language: extMap[ext] }).value
    } else {
      html = hljs.highlightAuto(codes).value
    }

    let ret: (string | { value: string, type: "comment" })[] = []

    // 处理换行注释
    while (html) {
      const start = html.indexOf(commentSpanStart)
      if (start === -1) break

      let end = -1
      let waitEnd = 1
      for (let i = start + commentSpanStart.length; i < html.length; i++) {
        if (html[i] === "<") {
          if (html[i + 1] === "/") {
            waitEnd -= 1

            if (waitEnd === 0) {
              end = i
              break
            }
          } else {
            waitEnd += 1
          }
        }
      }
      if (end === -1) break

      const comment = html.substring(start, end + commentSpanEnd.length)

      ret.push(html.substring(0, start))
      ret.push({ value: comment, type: "comment" })
      html = html.substring(end + commentSpanEnd.length)
    }

    if (html) {
      ret.push(html)
    }

    ret = ret.filter(item => item).map(item => {
      if (typeof item === "string") {
        return item
      } else {
        const comment = item.value.substring(
          commentSpanStart.length,
          item.value.length - commentSpanEnd.length
        )

        return comment
          .split(/\r\n|\n/g)
          .map(line => `<span class="hljs-comment">${line}</span>`)
          .join("\n")
      }
    })

    html = ret.join("")

    /** ====================================================================================== */

    let n = 0
    let spanPos = 0
    for (let i = 0; i < html.length; i++) {
      if (html[i] === '<') {
        const end = html.indexOf(">", i + 1)
        i = end
      } else if (html[i] === "&") {
        const end = html.indexOf(";", i + 1)
        i = end
        n += 1

        if (n === selectionEnd) {
          spanPos = i + 1
          break
        }
      } else if (html[i] === "\r") {
        i += 1
        n += 1

        if (n === selectionEnd) {
          spanPos = i + 1
          break
        }
      } else {
        n += 1

        if (n === selectionEnd) {
          spanPos = i + 1
          break
        }
      }
    }

    return `${html.substring(0, spanPos)}<span class="selection"></span>${html.substring(spanPos)}`
  }, [codes, selectionEnd])

  /** ====================================================================================== */

  const containerRef = useRef<Nullable<HTMLDivElement>>(null)
  const [containerSize, setContainerSize] = useState<[number, number]>([0, 0])
  const [scroll, setScroll] = useState<[number, number]>(tabState?.scrollPos || [0, 0])

  const handleScroll = (ev: React.UIEvent<HTMLDivElement, UIEvent>) => {
    setScroll([ev.currentTarget.scrollLeft, ev.currentTarget.scrollTop])
    onScroll([ev.currentTarget.scrollLeft, ev.currentTarget.scrollTop])
  }

  const lineRange = useMemo(() => {
    const startLine = Math.floor(scroll[1] / themeLineHeight)
    const lineCount = Math.ceil(containerSize[1] / themeLineHeight)
    const endLine = startLine + lineCount

    return [startLine, endLine]
  }, [scroll, containerSize])

  const htmlLines = useMemo(() => {
    const lines = html.split(/\r\n|\n/)
    const htmlLines = []

    for (let i = lineRange[0]; i < lineRange[1]; i++) {
      htmlLines.push(lines[i])
    }

    return htmlLines
  }, [html, lineRange])

  useEffect(() => {
    setContainerSize([
      containerRef.current?.offsetWidth || 0,
      containerRef.current?.offsetHeight || 0
    ])
  }, [containerRef])

  /** ====================================================================================== */

  const [textAreaHeight, setTextAreaHeight] = useState(0)
  const textAreaRef = useRef<Nullable<HTMLTextAreaElement>>(null)

  useEffect(() => {
    if (textAreaRef.current) {
      setTextAreaHeight(textAreaRef.current.scrollHeight)

    }
  }, [textAreaRef, html])

  useEffect(() => {
    const handleResize = () => setContainerSize([textAreaRef.current?.offsetWidth || 0, textAreaRef.current?.offsetHeight || 0])

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  })

  /** ====================================================================================== */

  const minimapRef = useRef<Nullable<any>>(null)
  const handleTextAreaChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    const oldCodes = codes
    const newCodes = ev.target.value

    const diffRes = textDiff(oldCodes, newCodes)

    if (minimapRef.current) {
      minimapRef.current.update(newCodes, diffRes)
    }

    setCodes(newCodes)
    setTextAreaHeight(newCodes.split("\n").length * themeLineHeight)

    onWordChange && onWordChange(findWord()[2])

    setLastTab(currTab)
  }

  const findWord = (): [number, number, string] => {
    // 找到光标前输入的标识符
    // 往前
    if (textAreaRef.current) {
      const newCodes = textAreaRef.current.value
      const n = textAreaRef.current.selectionEnd - 1
      const retArr = []
      for (let i = n; i >= 0; i--) {
        if (!/[$\w]/.test(newCodes[i])) break
        retArr.push(newCodes[i])
      }

      let ret = retArr.reverse().join("")

      // 往后
      if (newCodes.length + 1 > n) {
        if (/[$\w]/.test(newCodes[n + 1])) ret = ""

        if (!/[$_a-z][$\w]*/.test(ret)) ret = ""
      }

      return [n - ret.length, n, ret]
    } else {
      return [0, 0, ""]
    }
  }

  /** ====================================================================================== */

  const [preWidth, setPreWidth] = useState(0)
  const preRef = useRef<Nullable<HTMLPreElement>>(null)
  useEffect(() => {
    setPreWidth(preRef.current?.scrollWidth || 0)
  }, [preRef])

  useEffect(() => {
    setPreWidth(preRef.current?.scrollWidth || 0)
  }, [html])

  /** ====================================================================================== */

  const [cursorPos, setCursorPos] = useState(0)

  ref.current = {
    onEnterDown(value: string) {
      const [start, end] = findWord()
      setCodes(`${codes.substring(0, start + 1)}${value}${codes.substring(end + 1)}`)
      setCursorPos(start + 1 + value.length)
    }
  }

  useEffect(() => {
    if (cursorPos > 0) {
      textAreaRef.current?.setSelectionRange(cursorPos, cursorPos)
      setCursorPos(0)
    }
  }, [codes])

  /** ====================================================================================== */

  useEffect(() => {
    dispatch({
      type: ACTION_MAP.SET_TAB_STATES, value: {
        tab: currTab,
        scrollPos: scroll,
        cursorPos: selectionEnd
      }
    })
  }, [scroll, selectionEnd])

  /** ====================================================================================== */

  const [lastTab, setLastTab] = useState("")

  useEffect(() => {
    if (lastTab !== currTab) {
      if (editorRef.current) {
        editorRef.current.scrollLeft = scroll[0]
        editorRef.current.scrollTop = scroll[1]
      }

      if (textAreaRef.current) {
        textAreaRef.current.focus()
        textAreaRef.current.setSelectionRange(selectionEnd, selectionEnd)
      }
    }
  }, [editorRef, html])

  /** ====================================================================================== */

  const lineCount = useMemo(() => html.split(/\r\n|\n/).length, [html])
  const lineNumsWidth = (lineCount.toString().length + 1) * 16

  return currTab ? (
    <div
      ref={containerRef}
      key={currTab}
      className="editor-container"
    >
      <Minimap
        ref={minimapRef}
        codes={codes}
        width={containerSize[0]}
      />
      <div
        className="line-nums"
        style={{
          top: `-${scroll[1]}px`,
          width: `${lineNumsWidth}px`
        }}
      >
        {new Array(lineCount).fill(1).map((item, index) => (
          <div
            key={index}
            style={{
              height: `${themeLineHeight}px`,
              lineHeight: `${themeLineHeight}px`
            }}
          >
            {index + 1}
          </div>
        ))}
      </div>
      <div
        ref={editorRef}
        className="editor"
        style={{
          left: `${lineNumsWidth + 20}px`,
          width: `${containerSize[0] - lineNumsWidth - 20}px`,
          height: `${containerSize[1]}px`
        }}
        onScroll={handleScroll}
      >
        <pre
          ref={preRef}
          style={{
            top: `${lineRange[0] * themeLineHeight}px`
          }}
        >
          <code
            dangerouslySetInnerHTML={{ __html: htmlLines.join("\r\n") }}
            style={{
              fontSize: `${theme.editor.fontSize}px`,
              lineHeight: `${themeLineHeight}px`,
              fontFamily: theme.editor.fontFamily
            }}
          />
        </pre>

        <textarea
          ref={textAreaRef}
          style={{
            width: `${preWidth}px`,
            height: `${textAreaHeight}px`,
            paddingBottom: `${containerSize[1] - themeLineHeight}px`,
            fontSize: `${theme.editor.fontSize}px`,
            lineHeight: `${themeLineHeight}px`,
            fontFamily: theme.editor.fontFamily,
            caretColor: theme.main.color
          }}
          value={codes}
          onChange={handleTextAreaChange}
          onSelect={handleSelect}
          onKeyDown={onKeyDown}
        />
        <div
          className="spacer-holder"
          style={{ height: `${containerSize[1] - themeLineHeight}px` }}
        />
      </div>
    </div>
  ) : null
})

export default Editor