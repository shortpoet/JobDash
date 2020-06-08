export interface Store {
  stateMap: StateMap
  getState: Function
}

export interface StateMap {
  ids: string[]
  all: Record<string, any>
  loaded: boolean
}
