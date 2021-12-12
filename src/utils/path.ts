import { Nullable } from "@/types"

export const getFileName = (filepath: string) => {
  const ret = filepath.split(/\\|\//g)

  return ret[ret.length - 1]
}

export const getExtName = (filepath: Nullable<string>) => {
  if (filepath != null) {
    const base = getFileName(filepath)
    if (!base) return null

    const n = base.lastIndexOf(".")
    if (n === -1) return null

    return base.substring(n)
  }
  return null
}