import { useState, useEffect, useMemo, useRef } from "react"
import { useSelector } from "react-redux"

import "highlight.js/styles/github-dark.css"
import "./Editor.less"

import hljs from "highlight.js"
import { invokePre } from "@/libs/channel"
import { INVOKE_PRELOAD_MESSAGE } from "@/store/const"
import { Store } from "@/types/store"
import { Nullable } from "@/types"

const Editor = () => {
  const currTab = useSelector((state: Store) => state.currTab)

  const [codes, setCodes] = useState("")

  useEffect(() => {
    invokePre<string>(INVOKE_PRELOAD_MESSAGE.READ_FILE, currTab).then(setCodes)
  }, [currTab])

  const html = useMemo(() => hljs.highlight(codes, { language: "javascript" }).value, [codes])

  const [containerSize, setContainerSize] = useState<[number, number]>([0, 0])
  const containerRef = useRef<Nullable<HTMLDivElement>>(null)

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
    // setTextAreaHeight(ev.target.scrollHeight)
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
      <div className="editor"
        style={{
          width: `${containerSize[0]}px`,
          height: `${containerSize[1]}px`
        }}
      >
        <pre ref={preRef}><code dangerouslySetInnerHTML={{ __html: html }}></code></pre>
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