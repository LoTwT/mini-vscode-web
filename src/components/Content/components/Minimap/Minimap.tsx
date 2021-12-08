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

  const [codeMap, setCodeMap] = useState<Nullable<HTMLCanvasElement>>(null)

  useEffect(() => {
    if (!width) return
    if (codeMap) return

    const html = hljs.highlight(codes, { language: "javascript" }).value

    renderHtml(html, width).then(canvas => {
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

    })
  }, [width, codes])

  ref.current = {
    update(newCodes: string, diff: Nullable<TextDiffResult>) {
      if (diff) {
        const { type, line, lines } = diff
        const html = hljs.highlight(newCodes, { language: "javascript" }).value

        switch (type) {
          case "add":
            if (minimapDivRef.current) {
              const newCanvas = document.createElement("canvas")
              const ctx = newCanvas.getContext("2d")
              const canvas = minimapDivRef.current.children[0] as HTMLCanvasElement

              if (canvas.height > 0) {
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
                  0, 0, w, line * lineHeight,
                  0, 0, w, line * lineHeight
                )

                // current
                const htmlLines = html.split(/\r\n|\n/)
                const newHtml = htmlLines.slice(line, line + lines).join("\n")
                if (newHtml) {
                  renderHtml(newHtml, width).then(canvas => {
                    ctx?.drawImage(canvas, 0, line * lineHeight)
                  })
                }

                // after [line, ]
                ctx?.drawImage(
                  canvas,
                  0, line * lineHeight, w, canvas.height - line * lineHeight,
                  0, (line + lines) * lineHeight, w, canvas.height - line * lineHeight
                )

                minimapDivRef.current.innerHTML = ""
                minimapDivRef.current.appendChild(newCanvas)
              }
            }


            break
          case "delete":
            if (minimapDivRef.current) {
              const newCanvas = document.createElement("canvas")
              const ctx = newCanvas.getContext("2d")
              const canvas = minimapDivRef.current.children[0] as HTMLCanvasElement

              if (canvas.height > 0) {
                const w = canvas.width || 0
                const h = canvas.height || 0
                const rate = (minimapDivRef.current.offsetWidth || 1) / w

                newCanvas.width = w
                newCanvas.height = h - lineHeight
                newCanvas.style.width = `${rate * w}px`
                newCanvas.style.height = `${rate * h}px`

                // 切成三部分
                // before => [0, line]
                ctx?.drawImage(
                  canvas,
                  0, 0, w, line * lineHeight,
                  0, 0, w, line * lineHeight
                )

                // current => 不用管 => 直接删除即可

                // after [line, ]
                ctx?.drawImage(
                  canvas,
                  0, (line + lines) * lineHeight, w, canvas.height - line * lineHeight,
                  0, line * lineHeight, w, canvas.height - line * lineHeight
                )

                minimapDivRef.current.innerHTML = ""
                minimapDivRef.current.appendChild(newCanvas)
              }
            }

            break
          case "change":
            if (minimapDivRef.current) {
              const newCanvas = document.createElement("canvas")
              const ctx = newCanvas.getContext("2d")
              const canvas = minimapDivRef.current.children[0] as HTMLCanvasElement

              if (canvas.height > 0) {
                const w = canvas.width || 0
                const h = canvas.height || 0
                const rate = (minimapDivRef.current.offsetWidth || 1) / w

                newCanvas.width = w
                newCanvas.height = h
                newCanvas.style.width = `${rate * w}px`
                newCanvas.style.height = `${rate * h}px`

                // 切成三部分
                // before => [0, line]
                ctx?.drawImage(
                  canvas,
                  0, 0, w, line * lineHeight,
                  0, 0, w, line * lineHeight
                )

                // current
                const htmlLines = html.split(/\r\n|\n/)
                const newHtml = htmlLines[line]

                ctx?.clearRect(0, line * lineHeight, width, lineHeight)
                renderHtml(newHtml, width).then(canvas => {
                  if (canvas.height > 0) {
                    ctx?.drawImage(canvas, 0, line * lineHeight)
                  }
                })

                // after [line, ]
                ctx?.drawImage(
                  canvas,
                  0, line * lineHeight, w, canvas.height - line * lineHeight,
                  0, line * lineHeight, w, canvas.height - line * lineHeight
                )

                minimapDivRef.current.innerHTML = ""
                minimapDivRef.current.appendChild(newCanvas)
              }
            }

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

const renderHtml = async (html: string, width: number) => {
  const div = document.createElement("div")
  div.style.width = `${width}px`
  div.style.background = "#1e1e1e"
  div.innerHTML = `<pre><code style='color: #fff;font: 20px/26px Consolas, "Courier New", monospace;'>${html}</code></pre>`
  document.body.appendChild(div)

  const p = await html2canvas(div)

  document.body.removeChild(div)

  return p
}
