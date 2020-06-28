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

// export interface StoreConstructor<T> {
//   new (initialState: StoreState): IStore<T>
// }

// https://levelup.gitconnected.com/introduction-to-typescript-interfaces-enforcing-class-implementation-b41f9e290bf9
// https://medium.com/@erickwendel/generic-repository-with-typescript-and-node-js-731c10a1b98e

// export const createStore = (ctor: StoreConstructor<T>, initialState: StoreState): IStore<T> => {
//   return new ctor(initialState);
// }

const initialStateMap = () : StateMap => ({
  ids: [
  ],
  all: {
  },
  loaded: false
})

const initialStoreState = () : StoreState => ({
  records: initialStateMap()
})

export interface IStore<T> {
  idSymbol: string;
  modules?: Record<string, any>
  getState(): StoreState;
  getRecordById<T>(id: string | number): T;
  getRecordById(id: string | number): any; 
  createRecord(record: any, pushToDb: Boolean): void;
  createRecord(record: any): void;
  addRecords(records: any[]): void;
  fetchRecords(records: any[]): void;
  // loadRecords(caller: string): void;
  updateRecords(caller: string): Promise<any[]>;

}

export abstract class BaseStore<T> implements IStore<T> {
  constructor (
    idSymbol: string,
    initialState: StoreState = initialStoreState()
  ) {
    this.state = reactive(initialState)
    this.idSymbol = idSymbol
    this.getState()
  }
  protected state: StoreState
  idSymbol: string
  modules: Record<string, any>
  abstract getState(): StoreState;
  abstract getRecordById<T>(id: string | number): T;
  abstract getRecordById(id: string | number): any;
  abstract getLast<T>(): T; 
  abstract getLast(): any; 
  abstract createRecord(record: any, pushToDb: Boolean): void;
  abstract createRecord(record: any): void;
  abstract addRecords(records: any[]): void;
  abstract fetchRecords(records: any[]): void;
  // abstract loadRecords(caller: string): void;
  abstract async updateRecords(caller: string): Promise<any[]>;
}

export class Store<T> extends BaseStore<T> {
  constructor(idSymbol:string, initialState: StoreState) {
    super(idSymbol, initialState)
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
  
  // createRecord(record: any, pushToDb: Boolean): Promise<void>
  public createRecord(record: any): void {
    // console.log('create record - interface')
    // console.log(record)
    // console.log(this.idSymbol)
    const id = record[this.idSymbol]
    this.state.records.all[id] = record
    this.state.records.ids.push(id.toString())
  }

  public deleteRecord(record: any): void {
    const id = record[this.idSymbol]
    delete this.state.records.all[id]
    const index = this.state.records.ids.indexOf(this.idSymbol.toString())
    this.state.records.ids.splice(index, 1)
  }
  public editRecord(oldRecord: any, newRecord: any): void {
    const id = oldRecord[this.idSymbol]
    this.state.records.all[id] = newRecord
  }

  public addRecords(records: any[]) {
    // to avoid mutating at all costs can do reduce
    for (const record of records) {
      // do a check to account for duplicates
      if (!this.state.records.ids.includes(record[this.idSymbol])) {
        this.state.records.ids.push(record[this.idSymbol])
      }
      // using number as key to JS object, it implicitly assumes it is a string and calls .toString() automatically
      // need to first extract id because concatenating them errors
      // this.state.records.all[record][idSymbol]
      const id = record[this.idSymbol]
      this.state.records.all[id] = record
    }
    this.state.records.loaded = true
  }

  public async updateRecords (caller: string): Promise<any[]> {
    console.log(`update records for ${caller}`)
    return this.state.records.ids.reduce<any[]>((accumulator, id) => {
      const record = this.state.records.all[id]
      return accumulator.concat(record)
    }, [])
  }

  public fetchRecords(records: any[]): void {
    this.addRecords(records)
    this.state.records.loaded = true
  }

  // public loadRecords(caller: string): void {
  //   throw new Error("Method not implemented.")
  // }


//   public loadRecords = async (caller: string): Promise<any[]> => {
//   console.log(`load records for ${caller}`)
//   if (!this.state.records.loaded) {
//     console.log('fetching - not yet loaded')
//     await this.fetchRecords()
//   }
//   console.log('loading')
//   return store.getState().records.ids.reduce<any[]>((accumulator, id) => {
//     const record = store.getState().records.all[id]
//     return accumulator.concat(record)
//   }, [])
// }


}

export interface IStoreAxios<ITableItem> extends IStore<ITableItem> {
  _fetchRecords(url: string): Promise<ITableItem[]>
}

export abstract class StoreAxios<ITableItem> extends Store<ITableItem> implements IStoreAxios<ITableItem>, IStore<ITableItem> {
  async _fetchRecords(url: string): Promise<ITableItem[]> {
    // get is generic so can specify type
    const response = await axios.get<ITableItem[]>(url, {headers: {cache: 'no-store'}})
    return response.data
  }
}

