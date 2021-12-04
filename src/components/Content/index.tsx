import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import "./index.less"
import { Store } from "@/types/store"
import { invokePre } from "@/libs/channel"
import { INVOKE_PRELOAD_MESSAGE } from "@/store/const"

export default () => {
  const dispatch = useDispatch()
  const currTab = useSelector((state: Store) => state.currTab)
  const [codes, setCodes] = useState("")

  useEffect(() => {
    invokePre<string>(INVOKE_PRELOAD_MESSAGE.READ_FILE, currTab).then(setCodes)
  }, [currTab])

  return currTab ? (
    <div className="content">
      <textarea value={codes}></textarea>
    </div>
  ) : null
}
