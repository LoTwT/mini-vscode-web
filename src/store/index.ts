import { createStore, Reducer } from "redux"
import type { Store, StoreAction } from "@/types/store"
import { ACTION_MAP } from "./const"
import { loadState, saveState } from "./init"
import { Nullable } from "@/types"

const initialState: Store = loadState()

const reducer = (state = initialState, { type, value }: StoreAction) => {
  let newState: Nullable<Store> = null

  switch (type) {
    case ACTION_MAP.SET_OPEN_DIRS:
      newState = {
        ...state,
        openDirs: value as string[]
      }
      break

    case ACTION_MAP.SET_OPEN_TABS:
      newState = {
        ...state,
        openTabs: value as string[]
      }
      break

    case ACTION_MAP.SET_CURR_TAB:
      newState = {
        ...state,
        currTab: value as string
      }
      break

    default:
      return state
  }

  newState && saveState(newState)
  return newState
}

const store = createStore(reducer as Reducer)

export default store
