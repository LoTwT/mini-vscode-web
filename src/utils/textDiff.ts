import { Nullable } from "@/types"

export interface TextDiffResult {
  type: "change" | "add" | "delete"
  line: number
}

export const textDiff = (oldText: string, newText: string): Nullable<TextDiffResult> => {
  const oldLines = oldText.split(/\r\n|\n/)
  const newLines = newText.split(/\r\n|\n/)

  if (oldLines.length === newLines.length) {
    // 行内发生变化
    for (let i = 0; i < oldLines.length; i++) {
      if (oldLines[i] !== newLines[i]) {
        return {
          type: "change",
          line: i
        }
      }
    }
  } else if (oldLines.length < newLines.length) {
    // 新增行
    for (let i = 0; i < newLines.length; i++) {
      if (oldText === [
        ...newLines.slice(0, i),
        ...newLines.slice(i + 1)
      ].join("\n")) {
        return { type: "add", line: i }
      }
    }
  } else {
    // 删除行
    for (let i = 0; i < oldLines.length; i++) {
      if (newText === [
        ...oldLines.slice(0, i),
        ...oldLines.slice(i + 1)
      ].join("\n")) {
        return { type: "delete", line: i }
      }
    }
  }

  return null
}