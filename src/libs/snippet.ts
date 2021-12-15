const snippets: Record<string, any> = {}

export const getSnippetList = (ext: string, keyword: string) => {
  if (!keyword) return []

  const type = ext.substring(1)
  const snippet = snippets[type]
  if (!snippet) return []

  const res = []
  for (const name in snippet) {
    const { prefix, body, description } = snippet[name]

    if (prefix.startsWith(keyword)) {
      res.push({ name, prefix, body, description })
    }
  }

  return res
}