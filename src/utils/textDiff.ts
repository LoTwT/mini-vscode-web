import { Nullable } from "@/types"

export interface TextDiffResult {
  type: "change" | "add" | "delete"
  line: number
  lines: number
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
          line: i,
          lines: 1
        }
      }
    }
  } else if (oldLines.length < newLines.length) {
    // 新增行
    const deltaLinesCount = newLines.length - oldLines.length

    for (let i = 0; i < newLines.length; i++) {
      if (oldText === [
        ...newLines.slice(0, i),
        ...newLines.slice(i + deltaLinesCount)
      ].join("\n")) {
        return { type: "add", line: i, lines: deltaLinesCount }
      }
    }
  } else {
    // 删除行
    const deltaLinesCount = oldLines.length - newLines.length

    for (let i = 0; i < oldLines.length; i++) {
      if (newText === [
        ...oldLines.slice(0, i),
        ...oldLines.slice(i + deltaLinesCount)
      ].join("\n")) {
        return { type: "delete", line: i, lines: deltaLinesCount }
      }
    }
  }

  return null
}