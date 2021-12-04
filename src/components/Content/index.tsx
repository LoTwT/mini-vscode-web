import { Store } from "@/types/store"
import { useSelector, useDispatch } from "react-redux"

export default () => {
  const dispatch = useDispatch()
  const currTab = useSelector((state: Store) => state.currTab)

  return currTab ? (
    <div className="content">{currTab}</div>
  ) : null
}
