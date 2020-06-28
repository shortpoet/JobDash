import { provide, inject } from "vue"
import axios from "axios"
import { StoreState, StateMap, IStore, Store } from "./store.interface"
import { IStoreLocal, BaseStoreLocal, ITEM_ID, StoreLocal } from "./store.local.interface"
import { colorLog } from "../utils"

import {ITableItem, TableItem} from './../interfaces/table/table.item.interface'
import moment from "moment"

interface TableStateMap extends StateMap {
  ids: string[]
  all: Record<string, ITableItem>
  loaded: boolean
}

interface TableStoreState extends StoreState {
  records: TableStateMap
}

export class TableStoreLocal extends StoreLocal implements IStoreLocal<ITableItem> {
  constructor(
    idSymbol: string,
    collectionName: string,
    initialState?: TableStoreState

  ) {
    super(idSymbol, collectionName, initialState)
  }

  public getLastId(): TableItem['itemId'] {
    const last = this.getLast<TableItem>()
    return last ? last[ITEM_ID] : '-1'
  }

  async createRecord(item: TableItem) {
    // if allowing user to add id
    // if (!records.map(r => r[this.idSymbol]).includes(item[this.idSymbol])) {
    //   records.push(item)
    //   window.localStorage.setItem(this.collectionName, JSON.stringify(records))
    // } else {
    //   throw new Error(`Must use unique id next is ${records.length}`)
    // }
    const records = this.getRecordsFromStore()
    item[this.idSymbol] = records.length.toString()
    item.created = moment()
    item.edited = moment()
    item.editable = false
    item.locked = true
    super.createRecord(item)
    this.postToStore(item)
    this.fetchRecords()
  }
  
  async deleteRecord(item: TableItem) {
    colorLog('delete record from table store', 'orange', 'violet')
    super.deleteRecord(item)
    this.deleteFromStore(item)
  }
  
  async editRecord(oldItem: TableItem, newItem: TableItem) {
    super.editRecord(oldItem, newItem)
    console.log('writing to storage')
    super.putToStore(oldItem, newItem)
  }

  toggleEditable(item: ITableItem, editable: boolean) {
    console.log('toggle editable from table store')
    this.state.records.all[item[this.idSymbol]].editable = editable
  }
  
  toggleLocked(item: ITableItem, locked: boolean) {
    console.log('toggle editable from table store')
    this.state.records.all[item[this.idSymbol]].locked = locked
  }  
}

// const tableStore = new TableStoreLocal(initialTableStoreState())
// tableStore.getState()

const TABLE_STORE_LOCAL = 'tableStoreLocal'

export const provideTableStoreLocal = (idSymbol, collectionName) =>  {
  const store = new TableStoreLocal(idSymbol, collectionName)
  provide(TABLE_STORE_LOCAL, store)
}


export const createTableStoreLocal = (idSymbol, collectionName) => {
  if (!window.localStorage.getItem(collectionName))
  window.localStorage.setItem(collectionName, JSON.stringify([]))
  const store = new TableStoreLocal(idSymbol, collectionName)
  return store
}

export const useTableStore = (): TableStoreLocal => {
  const store = inject<TableStoreLocal>(TABLE_STORE_LOCAL)
  return store
}
