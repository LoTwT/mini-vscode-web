import { useState, useEffect, useMemo, useRef, forwardRef } from "react"

import "highlight.js/styles/vs2015.css"
import "./Minimap.less"

import hljs from "highlight.js"
import html2canvas from "html2canvas"
import { Nullable } from "@/types"
import { TextDiffResult } from "@/utils/textDiff"

interface IMinimapProps {
  codes: string
  width: number
}

const lineHeight = 26

const Minimap = forwardRef(({
  codes,
  width
}: IMinimapProps, ref: any) => {
  const minimapDivRef = useRef<Nullable<HTMLDivElement>>(null)

  const html = useMemo(() => {
    return hljs.highlight(codes, { language: "javascript" }).value
  }, [codes])

  const [codeMap, setCodeMap] = useState<Nullable<HTMLCanvasElement>>(null)

  useEffect(() => {
    if (!width) return
    if (codeMap) return

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

  ref.current = {
    update(diff: Nullable<TextDiffResult>) {
      if (diff) {
        const { type, line } = diff

        switch (type) {
          case "add":
            if (minimapDivRef.current) {
              const newCanvas = document.createElement("canvas")
              const ctx = newCanvas.getContext("2d")
              const canvas = minimapDivRef.current.children[0] as HTMLCanvasElement

              const w = canvas.width || 0
              const h = canvas.height || 0
              const rate = (minimapDivRef.current.offsetWidth || 1) / w

              newCanvas.width = w
              newCanvas.height = h + lineHeight
              newCanvas.style.width = `${rate * w}px`
              newCanvas.style.height = `${rate * h}px`

              // 切成三部分
              // before => [0, line]
              ctx?.drawImage(
                canvas,
                0, 0, w, (line - 1) * lineHeight,
                0, 0, w, (line - 1) * lineHeight)

              // add => line

              // after [line, ]
              ctx?.drawImage(
                canvas,
                0, line * lineHeight, w, canvas.height - line * lineHeight,
                0, (line + 1) * lineHeight, w, line * lineHeight)

              minimapDivRef.current.innerHTML = ""
              minimapDivRef.current.appendChild(newCanvas)
            }

            break
          case "delete":
            break
          case "change":
            break
          default:
            break
        }
      }
    }
  }

  return (
    <div className="minimap" ref={minimapDivRef}></div>
  )
})

export default Minimap