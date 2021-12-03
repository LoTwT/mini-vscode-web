import { createStore, Reducer } from "redux"
import type { Store, StoreAction } from "@/types/store"
import { getLocalStorage, setLocalStorage } from "@/utils/cache"
import { ACTION_MAP, LOCAL_STORAGE_KEY_MAP } from "./const"

const initialState: Store = {
  projectRoot: "E:\\lo\\codes\\mini-vscode\\web",
  openDirs: getLocalStorage<string[]>(LOCAL_STORAGE_KEY_MAP.OEPN_DIRS) || [],
  openTabs: ["E:\\lo\\codes\\mini-vscode\\web\\src\\App.tsx"],
  currTab: "E:\\lo\\codes\\mini-vscode\\web\\src\\App.tsx"
}

const reducer = (state = initialState, { type, value }: StoreAction) => {
  switch (type) {
    case ACTION_MAP.SET_OPEN_DIRS:
      setLocalStorage(LOCAL_STORAGE_KEY_MAP.OEPN_DIRS, value)

      return {
        ...state,
        openDirs: value
      }

    case ACTION_MAP.SET_OPEN_TABS:
      return {
        ...state,
        openTabs: value
      }

    case ACTION_MAP.SET_CURR_TAB:
      return {
        ...state,
        currTab: value
      }

    default:
      return state
  }
}

const store = createStore(reducer as Reducer)

export default store
