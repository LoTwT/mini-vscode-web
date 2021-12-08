import { useState, useEffect, useRef, forwardRef } from "react"

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

  const [timer, setTimer] = useState<Nullable<NodeJS.Timeout>>(null)

  const renderHtml = (...args: Parameters<typeof _renderHtml>) => {
    timer && clearTimeout(timer)

    const newTimer = setTimeout(() => {
      _renderHtml(...args)
    }, 500)

    setTimer(newTimer)
  }

  useEffect(() => {
    if (!width) return

    const html = hljs.highlight(codes, { language: "javascript" }).value

    renderHtml(html, width, canvas => {
      const w = canvas.width
      const h = canvas.height
      const rate = (minimapDivRef.current?.offsetWidth || 1) / w
      canvas.style.width = `${rate * w}px`
      canvas.style.height = `${rate * h}px`

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

        if (minimapDivRef.current) {
          const canvas = minimapDivRef.current.children[0] as HTMLCanvasElement
          const w = canvas.width || 0
          const h = canvas.height || 0
          const newCanvas = createNewCanvas(canvas)
          const ctx = newCanvas.getContext("2d")

          const handleAdd = () => {
            if (canvas.height > 0) {
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
                renderHtml(newHtml, width, canvas => {
                  ctx?.drawImage(canvas, 0, line * lineHeight)
                })
              }

              // after [line, ]
              ctx?.drawImage(
                canvas,
                0, line * lineHeight, w, canvas.height - line * lineHeight,
                0, (line + lines) * lineHeight, w, canvas.height - line * lineHeight
              )
            }
          }

          const handleDelete = () => {
            if (canvas.height > 0) {
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
            }
          }

          const handleChange = () => {
            if (canvas.height > 0) {
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
              renderHtml(newHtml, width, canvas => {
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
            }
          }

          switch (type) {
            case "add":
              handleAdd()
              break

            case "delete":
              handleDelete()
              break

            case "change":
              handleChange()
              break

            default:
              break
          }
        }
      }
    }
  }

  return (
    <div className="minimap" ref={minimapDivRef}></div>
  )
})

export default Minimap

const _renderHtml = async (html: string, width: number, cb: (canvas: HTMLCanvasElement) => void) => {
  const div = document.createElement("div")
  div.style.width = `${width}px`
  div.style.background = "#1e1e1e"
  div.innerHTML = `<pre><code style='color: #fff;font: 20px/26px Consolas, "Courier New", monospace;'>${html}</code></pre>`
  document.body.appendChild(div)

  html2canvas(div).then(canvas => {
    document.body.removeChild(div)
    cb(canvas)
  })

}

const createNewCanvas = (oldCanvas: Nullable<HTMLCanvasElement>) => {
  const newCanvas = document.createElement("canvas")

  if (oldCanvas && oldCanvas.height > 0) {
    const w = oldCanvas.width || 0
    const h = oldCanvas.height || 0
    const rate = (oldCanvas.offsetWidth || 1) / w

    newCanvas.width = w
    newCanvas.height = h
    newCanvas.style.width = `${rate * w}px`
    newCanvas.style.height = `${rate * h}px`

    oldCanvas.innerHTML = ""
    oldCanvas.appendChild(newCanvas)
  }

  return newCanvas
}
