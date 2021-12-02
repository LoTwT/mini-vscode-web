import { createStore, Reducer } from "redux"
import type { Store, StoreAction } from "@/types/store"

const initialState = {
  projectRoot: "E:\\lo\\codes\\mini-vscode\\web",
  openDirs: ["E:\\lo\\codes\\mini-vscode\\web\\src"]
}

export const ACTION_MAP = {
  SET_OPEN_DIRS: "setOpenDirs"
} as const


const reducer: Reducer<Store, StoreAction> = (state = initialState, { type, value }) => {
  switch (type) {
    case ACTION_MAP.SET_OPEN_DIRS:
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
