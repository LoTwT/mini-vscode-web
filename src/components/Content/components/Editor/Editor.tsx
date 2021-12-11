import { useState, useEffect, useMemo, useRef } from "react"
import { useSelector } from "react-redux"

import "highlight.js/styles/vs2015.css"
import "./Editor.less"

import hljs from "highlight.js"
import { invokePre } from "@/libs/channel"
import { INVOKE_PRELOAD_MESSAGE } from "@/store/const"
import { Store } from "@/types/store"
import { Nullable, Undefinedable } from "@/types"
import Minimap from "../Minimap/Minimap"
import { textDiff } from "@/utils/textDiff"

const lineHeight = 26

interface IEditorProps {
  onWordChange: (word: string) => void
  onCursorPosChange: ([posLeft, posTop]: [Undefinedable<number>, Undefinedable<number>]) => void
}

const Editor = ({
  onWordChange,
  onCursorPosChange
}: IEditorProps) => {
  const currTab = useSelector((state: Store) => state.currTab)

  const [codes, setCodes] = useState("")

  useEffect(() => {
    invokePre<string>(INVOKE_PRELOAD_MESSAGE.READ_FILE, currTab).then(setCodes)
  }, [currTab])

  /** ====================================================================================== */

  const [selectionEnd, setSelectionEnd] = useState(0)
  const handleSelect = (ev: React.SyntheticEvent<HTMLTextAreaElement, Event>) => {
    setSelectionEnd(ev.currentTarget.selectionEnd)
    const preEl = preRef.current
  }

  useEffect(() => {
    const cursor = containerRef.current?.getElementsByClassName("selection")[0] as Undefinedable<HTMLSpanElement>
    onCursorPosChange([cursor?.offsetLeft, cursor?.offsetTop])
  }, [selectionEnd])

  /** ====================================================================================== */

  const html = useMemo(() => {
    const commentSpanStart = `<span class="hljs-comment">`
    const commentSpanEnd = "</span>"

    let html = hljs.highlight(codes, { language: "javascript" }).value
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
  const [scroll, setScroll] = useState<[number, number]>([0, 0])

  const handleScroll = (ev: React.UIEvent<HTMLDivElement, UIEvent>) => {
    setScroll([ev.currentTarget.scrollLeft, ev.currentTarget.scrollTop])
  }

  const lineRange = useMemo(() => {
    const startLine = Math.floor(scroll[1] / lineHeight)
    const lineCount = Math.ceil(containerSize[1] / lineHeight)
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
    setTextAreaHeight(textAreaRef.current?.scrollHeight || 0)
  }, [textAreaRef])

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
    setTextAreaHeight(newCodes.split("\n").length * 26)

    // 找到光标前输入的标识符
    // 往前
    const n = ev.target.selectionEnd - 1
    const retArr = []
    for (let i = n; i >= 0; i--) {
      if (!/[$\w]/.test(newCodes[i])) break
      retArr.push(newCodes[i])
    }

    let ret = retArr.reverse().join("")

    // 往后
    if (/[$\w]/.test(newCodes[n + 1])) ret = ""

    if (!/[$_a-z][$\w]*/.test(ret)) ret = ""

    onWordChange(ret)
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

  return currTab ? (
    <div className="editor-container" ref={containerRef}>
      <Minimap
        ref={minimapRef}
        codes={codes}
        width={containerSize[0]}
      />
      <div
        className="editor"
        style={{
          width: `${containerSize[0]}px`,
          height: `${containerSize[1]}px`
        }}
        onScroll={handleScroll}
      >
        <pre
          ref={preRef}
          style={{
            top: `${lineRange[0] * lineHeight}px`
          }}
        >
          <code dangerouslySetInnerHTML={{ __html: htmlLines.join("\r\n") }}></code>
        </pre>

        <textarea
          ref={textAreaRef}
          style={{
            width: `${preWidth}px`,
            height: `${textAreaHeight}px`,
            paddingBottom: `${containerSize[1] - 26}px`
          }}
          value={codes}
          onChange={handleTextAreaChange}
          onSelect={handleSelect}
        />
        <div className="spacer-holder" style={{ height: `${containerSize[1] - 26}px` }}></div>
      </div>
    </div>
  ) : null
}

export default Editor