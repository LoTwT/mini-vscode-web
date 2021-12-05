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

  const [containerHeight, setContainerHeight] = useState(0)
  const containerRef = useRef<Nullable<HTMLDivElement>>(null)

  useEffect(() => {
    setContainerHeight(containerRef.current?.offsetHeight || 0)
  }, [containerRef])

  const [textAreaHeight, setTextAreaHeight] = useState(0)
  const textAreaRef = useRef<Nullable<HTMLTextAreaElement>>(null)

  useEffect(() => {
    setTextAreaHeight(textAreaRef.current?.scrollHeight || 0)
  }, [textAreaRef])

  useEffect(() => {
    const handleResize = () => setTextAreaHeight(textAreaRef.current?.scrollHeight || 0)

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  })

  const handleTextAreaChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCodes(ev.target.value)
    // setTextAreaHeight(ev.target.scrollHeight)
    setTextAreaHeight(ev.target.value.split("\n").length * 26)
  }

  return currTab ? (
    <div className="editor-container" ref={containerRef}>
      <div className="editor" style={{ height: `${containerHeight}px` }}>
        <pre><code dangerouslySetInnerHTML={{ __html: html }}></code></pre>
        <textarea
          ref={textAreaRef}
          style={{
            height: `${textAreaHeight}px`,
            paddingBottom: `${containerHeight - 26}px`
          }}
          value={codes}
          onChange={handleTextAreaChange}
        />
        <div className="spacer-holder" style={{ height: `${containerHeight - 26}px` }}></div>
      </div>
    </div>
  ) : null
}

export default Editor