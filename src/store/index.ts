import { createStore, Reducer } from "redux"
import type { Store, StoreAction } from "@/types/store"
import { getLocalStorage, setLocalStorage } from "@/utils/cache"
import { ACTION_MAP, LOCAL_STORAGE_KEY_MAP } from "./const"

const initialState = {
  projectRoot: "E:\\lo\\codes\\mini-vscode\\web",
  openDirs: getLocalStorage<string[]>(LOCAL_STORAGE_KEY_MAP.OEPN_DIRS) || []
}

const reducer: Reducer<Store, StoreAction> = (state = initialState, { type, value }) => {
  switch (type) {
    case ACTION_MAP.SET_OPEN_DIRS:
      setLocalStorage(LOCAL_STORAGE_KEY_MAP.OEPN_DIRS, value)

      return {
        ...state,
        openDirs: value
      }
    default:
      return state
  }
}

const store = createStore(reducer)

export default store
