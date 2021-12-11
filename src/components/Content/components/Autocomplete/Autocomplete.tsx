import { useState, useEffect, useMemo, forwardRef } from "react"

import "./Autocomplete.less"
import { Nullable, Undefinedable } from "@/types"

interface IAutocompleteProps {
  keyword: Nullable<string>
  x: Undefinedable<number>
  y: Undefinedable<number>
  onVisibleChange: (isVisible: boolean) => void
  onEnterDown: (value: string) => void
}

const keywords = [
  "window",
  "document",
  "String",
  "Number",
  "Math",
  "Array",
  "onclick",
  "function",
  "const",
  "let",
  "return",
  "keyword",
  "useMemo",
  "within"
]

const Autocomplete = forwardRef(({
  keyword,
  x,
  y,
  onVisibleChange,
  onEnterDown
}: IAutocompleteProps, ref: any) => {
  const [curr, setCurr] = useState(0)
  useEffect(() => setCurr(0), [keyword])

  // 关键字匹配
  const list = useMemo(() => {
    if (!keyword) return []

    // 1. 直接查找
    const ret1 = keywords.filter(str => str.search(new RegExp(keyword, "i")) !== -1)
    ret1.sort((s1, s2) => s1.search(new RegExp(keyword, "i")) - s2.search(new RegExp(keyword, "i")))

    // 2. 可以有其他东西
    const re = new RegExp(keyword.split("").join(".*"), "i")
    const ret2 = keywords.filter(str => re.test(str))

    const matchRet = Array.from(new Set([...ret1, ...ret2]))
    const highlightRet = matchRet.map(str => {
      const arr: { type: string, value: string; }[] = []
      let s = 0

      for (let i = 0; i < keyword.length; i++) {
        let n = str.search(new RegExp(keyword[i], "i"))

        if (n > s) {
          arr.push({ type: "string", value: str.substring(s, n) })
        }

        if (arr.length && (arr[arr.length - 1] as any).type === "highlight") {
          (arr[arr.length - 1] as any).value += str[n]
        } else {
          arr.push({ type: "highlight", value: str[n] })
        }

        s = n + 1
      }

      if (s < str.length) {
        arr.push({ type: "string", value: str.substring(s) })
      }

      return arr
    })

    return highlightRet
  }, [keyword])

  /** ====================================================================================== */

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (list.length > 0 && isVisible === false) {
      setIsVisible(true)
      onVisibleChange && onVisibleChange(true)
    } else if (list.length === 0 && isVisible === true) {
      setIsVisible(false)
      onVisibleChange && onVisibleChange(false)
    }
  }, [list])

  /** ====================================================================================== */

  ref.current = {
    onKeyDown(key: string) {
      switch (key) {
        case "ArrowUp":
          if (curr === 0) {
            setCurr(list.length - 1)
          } else {
            setCurr(curr - 1)
          }
          break
        case "ArrowDown":
          if (curr === list.length - 1) {
            setCurr(0)
          } else {
            setCurr(curr + 1)
          }
          break
        case "Enter":
          onEnterDown && onEnterDown(list[curr].map(item => item.value).join(""))
          break
        default:
          break
      }
    }
  }

  return list.length > 0 ? (
    <div
      className="autocomplete"
      style={{
        left: `${x}px`,
        top: `${y}px`
      }}
    >
      <ul className="list">
        {list.map((arr, arrIndex) => (
          <li
            key={arrIndex}
            className={[
              "item",
              arrIndex === curr ? "active" : ""
            ].join(" ")}
          >
            {arr.map((obj, objIndex) => (
              <span
                key={objIndex}
                className={[
                  obj.type === "highlight" ? "highlight" : ""
                ].join(" ")}
              >
                {obj.value}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  ) : null
})

export default Autocomplete