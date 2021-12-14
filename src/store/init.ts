import { IGlobals, Store } from "@/types/store"
import { getLocalStorage, setLocalStorage } from "@/utils/cache"
import { ACTION_MAP, LOCAL_STORAGE_KEY_MAP } from "./const"
import store from "@/store/index"
import { invokeMain } from "@/libs/channel"

export const saveState = (state: Store) => {
  setLocalStorage(state.projectRoot, state)
  setLocalStorage(LOCAL_STORAGE_KEY_MAP.LAST_PROJECT_ROOT, state.projectRoot)
}

export const loadState: (projectRoot: string) => Store = (projectRoot) => {
  const cacheState = projectRoot && getLocalStorage<Store>(projectRoot)

  return cacheState || {
    projectRoot: projectRoot,
    openDirs: [],
    openTabs: [],
    currTab: "",
    tabStates: {},
    globals: {}
  }
}


window.addEventListener("message", ev => {
  const { channel, value } = ev.data
  if (channel === "main.changeRoot") {
    store.dispatch({ type: ACTION_MAP.REPLACE_STATE, value: loadState(value) })
  } else if (channel === "main.changeGlobals") {
    store.dispatch({
      type: "setGlobals",
      value
    })
  }
})

invokeMain<IGlobals>("getGlobals").then(res => {
  store.dispatch({
    type: "setGlobals",
    value: res
  })
})
