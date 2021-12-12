import { createStore, Reducer } from "redux"
import type { Store, StoreAction } from "@/types/store"
import { ACTION_MAP, LOCAL_STORAGE_KEY_MAP } from "./const"
import { loadState, saveState } from "./init"
import { Nullable } from "@/types"
import { getLocalStorage } from "@/utils/cache"

const initialState: Store = loadState(getLocalStorage<string>(LOCAL_STORAGE_KEY_MAP.LAST_PROJECT_ROOT) || "")

const reducer: Reducer<Store, StoreAction> = (state = initialState, action) => {
  let newState: Nullable<Store> = null

  switch (action.type) {
    case ACTION_MAP.SET_OPEN_DIRS:
      newState = {
        ...state,
        openDirs: action.value
      }
      break

    case ACTION_MAP.SET_OPEN_TABS:
      newState = {
        ...state,
        openTabs: action.value
      }
      break

    case ACTION_MAP.SET_CURR_TAB:
      newState = {
        ...state,
        currTab: action.value
      }
      break

    case ACTION_MAP.REPLACE_STATE:
      newState = action.value
      break

    case ACTION_MAP.SET_TAB_STATES:
      // const {scrollPos,  cursorPos} = action.value[state.currTab]
      const { tab, scrollPos, cursorPos } = action.value as unknown as { tab: string, scrollPos: [number, number], cursorPos: number }

      newState = {
        ...state,
        tabStates: {
          ...state.tabStates || {},
          [tab]: {
            scrollPos,
            cursorPos
          }
        }
      }
      break

    default:
      return state
  }

  newState && saveState(newState)
  return newState
}

const store = createStore(reducer)

export default store
