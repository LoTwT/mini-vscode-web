export const ACTION_MAP = {
  SET_OPEN_DIRS: "setOpenDirs",
  SET_OPEN_TABS: "setOpenTabs",
  SET_CURR_TAB: "setCurrTab",
  REPLACE_STATE: "replaceState"
} as const

export const LOCAL_STORAGE_KEY_MAP = {
  LAST_PROJECT_ROOT: "last_project_root"
} as const

// invodePre 监听的事件
export const INVOKE_PRELOAD_MESSAGE = {
  READ_DIR: "readDir",
  READ_FILE: "readFile"
} as const