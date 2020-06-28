import { ITableItem } from './../interfaces/table/table.item.interface'
import { Store, IStore, StoreState } from './store.interface'
import moment from 'moment'

export const ITEM_ID = 'itemId'

export interface IStoreLocal<ITableItem> extends IStore<ITableItem> {
  collectionName: string
  getRecordsFromStore(): ITableItem[];
  postToStore(item: ITableItem): void;
  addRecords(items: ITableItem[]): void;
}

export abstract class BaseStoreLocal<ITableItem> extends Store<ITableItem> implements IStoreLocal<ITableItem> {
  collectionName: string
  constructor(idSymbol:string, collectionName: string, initialState: StoreState) {
    super(idSymbol, initialState)
    this.collectionName = collectionName
  }
  abstract getRecordsFromStore(): ITableItem[];
  abstract postToStore(item: ITableItem): void;
  abstract deleteFromStore(item: ITableItem): void;
  abstract putToStore(oldItem: ITableItem, newItem: ITableItem): void;
  // if i redeclare a method here that was in parent such as
  // fetchRecords
  // no longer available in super. call
}
export class StoreLocal extends BaseStoreLocal<ITableItem> implements IStoreLocal<ITableItem> {
  constructor(idSymbol:string, collectionName: string, initialState: StoreState) {
    super(idSymbol, collectionName, initialState)
  }

  getRecordsFromStore(): ITableItem[] {
    const records = JSON.parse(window.localStorage.getItem(this.collectionName));
    return records
  }

  fetchRecords(): void {
    const records = this.getRecordsFromStore();
    super.fetchRecords(records);
  }
  
  postToStore(item: ITableItem): void {
    const records = this.getRecordsFromStore()
    records.push(item)
    window.localStorage.setItem(this.collectionName, JSON.stringify(records))
  }
  deleteFromStore(item: ITableItem): void {
    const records: ITableItem[] = this.getRecordsFromStore()
      .filter(_item => _item[ITEM_ID] != item[ITEM_ID])

    window.localStorage.setItem(
      this.collectionName,
      JSON.stringify(records)
    )
  }
  putToStore(oldItem: ITableItem, newItem: ITableItem): void {
    let records: ITableItem[] = this.getRecordsFromStore()
    records.splice(parseInt(oldItem[ITEM_ID]))
    records.push(newItem)
    window.localStorage.setItem(
      this.collectionName,
      JSON.stringify(records)
    )
  }
}

