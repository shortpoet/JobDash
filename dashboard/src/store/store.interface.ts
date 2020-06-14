import { readonly, reactive } from "vue"
import axios from 'axios'
export interface StateMap {
  ids: string[]
  all: Record<string, any>
  loaded: boolean
}

export interface StoreState {
  records: StateMap
}

export interface StoreConstructor<T> {
  new (initialState: StoreState): IStore<T>
}

// https://levelup.gitconnected.com/introduction-to-typescript-interfaces-enforcing-class-implementation-b41f9e290bf9
// https://medium.com/@erickwendel/generic-repository-with-typescript-and-node-js-731c10a1b98e

// export const createStore = (ctor: StoreConstructor<T>, initialState: StoreState): IStore<T> => {
//   return new ctor(initialState);
// }

export interface IStore<T> {
  getState(): StoreState;
  getRecordById<T>(id: string | number): T;
  getRecordById(id: string | number): any; 
  createRecord(record: any, idSymbol:(string | number)): void;
  addRecords(records: any[], idSymbol:(string | number)): void;
}

export abstract class BaseStore<T> implements IStore<T> {
  constructor (initialState: StoreState) {}
  abstract getState(): StoreState;
  abstract getRecordById<T>(id: string | number): T;
  abstract getRecordById(id: string | number): any;
  abstract getLast<T>(): T; 
  abstract getLast(): any; 
  abstract createRecord(record: any, idSymbol:(string | number)): void;
  abstract createRecord(record: any, idSymbol:(string | number), pushToDb: Boolean): void;
  abstract addRecords(records: any[], idSymbol:(string | number)): void;
}

export interface IStoreAxios<T> extends IStore<T> {
  _fetchRecords(url: string): Promise<T[]>
}

export class Store<T> extends BaseStore<T> {

  protected state: StoreState
  modules: Record<string, any>

  constructor(initialState: StoreState) {
    super(initialState)
    this.state = reactive(initialState)
  }

  public getState(): StoreState {
    return readonly<StoreState>(this.state)
  }

  public getRecordById<T>(id: string | number): T;
  public getRecordById(id: string | number): any {
    // console.log('get by id')
    // console.log(id)
    // console.log(this.state.records)
    // console.log(this.state.records.all)
    if (this.state.records.all[id]) {
      return this.state.records.all[id]
    } else {
      console.log('is null')
      return null
    }
  }

  public getLast<T>(): (T | null) {
    // console.log('get last')
    const lastId = this.state.records.ids.slice(-1)[0]
    // if database / store are empty return null
    return lastId ? this.state.records.all[lastId] : null
  }
  
  public createRecord(record: any, idSymbol:(string | number)): void {
    // console.log('create record - interface')
    const id = record[idSymbol]
    this.state.records.all[id] = record
    this.state.records.ids.push(id.toString())
  }

  public deleteRecord(record: any, idSymbol:(string | number)): void {
    const id = record[idSymbol]
    delete this.state.records.all[id]
    const index = this.state.records.ids.indexOf(idSymbol.toString())
    this.state.records.ids.splice(index, 1)
  }
  public editRecord(oldRecord: any, newRecord: any, idSymbol:(string | number)): void {
    const id = oldRecord[idSymbol]
    this.state.records.all[id] = newRecord
  }

  public addRecords(records: any[], idSymbol:(string | number)) {
    // to avoid mutating at all costs can do reduce
    for (const record of records) {
      // do a check to account for duplicates
      if (!this.state.records.ids.includes(record[idSymbol])) {
        this.state.records.ids.push(record[idSymbol])
      }
      // using number as key to JS object, it implicitly assumes it is a string and calls .toString() automatically
      // need to first extract id because concatenating them errors
      // this.state.records.all[record][idSymbol]
      const id = record[idSymbol]
      this.state.records.all[id] = record
    }
    this.state.records.loaded = true
  }
}

export abstract class StoreAxios<T> extends Store<T> implements IStoreAxios<T> {
  async _fetchRecords(url: string): Promise<T[]> {
    // get is generic so can specify type
    const response = await axios.get<T[]>(url)
    return response.data
  }
}

