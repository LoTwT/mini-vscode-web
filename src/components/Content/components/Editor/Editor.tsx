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

  useEffect(() => {
    invokePre<string>(INVOKE_PRELOAD_MESSAGE.READ_FILE, currTab).then(setCodes)
  }, [currTab])

  const html = useMemo(() => hljs.highlight(codes, { language: "javascript" }).value, [codes])

  return currTab ? (
    <>
      <div className="editor">
        <pre><code dangerouslySetInnerHTML={{ __html: html }}></code></pre>
        <textarea value={codes} onChange={ev => setCodes(ev.target.value)}></textarea>
      </div>
    </>
  ) : null
}

export default Editor