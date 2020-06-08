export class Store {
  protected state: Object
  modules: Record<string, Store>
}

export interface StateMap {
  ids: string[]
  all: Record<string, any>
  loaded: boolean
}
