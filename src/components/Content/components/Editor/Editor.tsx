import { useState, useEffect, useMemo, useRef } from "react"
import { useSelector } from "react-redux"

import "highlight.js/styles/github-dark.css"
import "./Editor.less"

import hljs from "highlight.js"
import { invokePre } from "@/libs/channel"
import { INVOKE_PRELOAD_MESSAGE } from "@/store/const"
import { Store } from "@/types/store"
import { Nullable } from "@/types"

const lineHeight = 26

const Editor = () => {
  const currTab = useSelector((state: Store) => state.currTab)

  const [codes, setCodes] = useState("")

  useEffect(() => {
    invokePre<string>(INVOKE_PRELOAD_MESSAGE.READ_FILE, currTab).then(setCodes)
  }, [currTab])

  const html = useMemo(() => hljs.highlight(codes, { language: "javascript" }).value, [codes])

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

  const handleTextAreaChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCodes(ev.target.value)
    setTextAreaHeight(ev.target.value.split("\n").length * 26)
  }

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
        />
        <div className="spacer-holder" style={{ height: `${containerSize[1] - 26}px` }}></div>
      </div>
    </div>
  ) : null
}

export default Editor