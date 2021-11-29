import { createStore, Reducer, AnyAction } from "redux"

export type Store = typeof initialState

const initialState = {}

const reducer: Reducer<Store> = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state
  }
}

const store = createStore(reducer)

export default store
