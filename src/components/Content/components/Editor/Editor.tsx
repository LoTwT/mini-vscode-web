import { useState, useEffect, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"

import hljs from "highlight.js"
import { invokePre } from "@/libs/channel"
import { INVOKE_PRELOAD_MESSAGE } from "@/store/const"
import { Store } from "@/types/store"

import "highlight.js/styles/github-dark.css"
import "./Editor.less"

const Editor = () => {
  const currTab = useSelector((state: Store) => state.currTab)
  const dispatch = useDispatch()

  const [codes, setCodes] = useState("")
  const [scroll, setScroll] = useState<[number, number]>([0, 0])

  useEffect(() => {
    invokePre<string>(INVOKE_PRELOAD_MESSAGE.READ_FILE, currTab).then(setCodes)
  }, [currTab])

  const html = useMemo(() => hljs.highlight(codes, { language: "javascript" }).value, [codes])

  const handleTextAreaScroll = (ev: React.UIEvent<HTMLTextAreaElement, UIEvent>) => {
    setScroll([
      ev.currentTarget.scrollLeft,
      ev.currentTarget.scrollTop
    ])
  }

  return currTab ? (
    <>
      <div className="editor">
        <pre style={{ left: `-${scroll[0]}px`, top: `-${scroll[1]}px` }}><code dangerouslySetInnerHTML={{ __html: html }}></code></pre>
        <textarea
          value={codes}
          onChange={ev => setCodes(ev.target.value)}
          onScroll={handleTextAreaScroll}
        />
      </div>
    </>
  ) : null
}

export default Editor