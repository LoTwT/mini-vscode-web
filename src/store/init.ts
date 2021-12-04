import { Store } from "@/types/store"
import { getLocalStorage, setLocalStorage } from "@/utils/cache"
import { LOCAL_STORAGE_KEY_MAP } from "./const"

export const saveState = (state: Store) => {
  setLocalStorage("state", state)
}

export const loadState: () => Store = () => getLocalStorage<Store>(LOCAL_STORAGE_KEY_MAP.STATE) || {
  projectRoot: "E:\\lo\\codes\\mini-vscode\\web",
  openDirs: [],
  openTabs: [],
  currTab: ""
}
