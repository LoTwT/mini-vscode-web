export const getFileName = (filepath: string) => {
  const ret = filepath.split(/\\|\//g)

  return ret[ret.length - 1]
}