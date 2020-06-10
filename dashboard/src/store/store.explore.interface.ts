export class Store {
  protected state: Object
  modules: Record<string, any>
}

export interface StateMap {
  ids: string[]
  all: Record<string, any>
  loaded: boolean
}
