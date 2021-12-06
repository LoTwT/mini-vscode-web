import { useState, useEffect, useMemo, useRef } from "react"

import "highlight.js/styles/vs2015.css"
import "./Minimap.less"

import hljs from "highlight.js"
import html2canvas from "html2canvas"
import { Nullable } from "@/types"

interface IMinimapProps {
  codes: string
  width: number
}

const Minimap = ({
  codes,
  width
}: IMinimapProps) => {
  const minimapDivRef = useRef<Nullable<HTMLDivElement>>(null)

  const html = useMemo(() => {
    return hljs.highlight(codes, { language: "javascript" }).value
  }, [codes])

  const [codeMap, setCodeMap] = useState<Nullable<HTMLCanvasElement>>(null)

  useEffect(() => {
    const div = document.createElement("div")
    div.style.width = `${width}px`
    div.style.background = "#1e1e1e"
    div.innerHTML = `<pre><code style='font: 20px/26px Consolas, "Courier New", monospace;'>${html}</code></pre>`
    document.body.appendChild(div)

    html2canvas(div).then(canvas => {
      const w = canvas.width
      const h = canvas.height
      const rate = (minimapDivRef.current?.offsetWidth || 1) / w
      canvas.style.width = `${rate * w}px`
      canvas.style.height = `${rate * h}px`

      setCodeMap(canvas)

      if (minimapDivRef.current) {
        minimapDivRef.current.innerHTML = ""
        minimapDivRef.current.appendChild(canvas)
      }

      document.body.removeChild(div)
    })
  }, [html, width])

  return (
    <div className="minimap" ref={minimapDivRef}></div>
  )
}

export default Minimap