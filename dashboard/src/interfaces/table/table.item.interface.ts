import { Moment } from "moment";
import moment from "moment";

export interface ITableItem {
  itemId: string
  created: Moment
  edited: Moment
  editable: boolean
  locked: boolean
}

export abstract class BaseTableItem implements ITableItem {
  constructor (
    item: object,
    idSymbol: string,
    created: Moment = moment(),
    edited: Moment = moment(),
    editable: boolean = false,
    locked: boolean = true,
  ) {
    this.itemId = item[idSymbol];
    const keys = Object.keys(item);
    keys.forEach(key => {
      this[key] = item[key]
    })
    this.created = created
    this.edited = edited
    this.editable = editable
    this.locked = locked
  }
  itemId: string;
  created: Moment;
  edited: Moment;
  editable: boolean;
  locked: boolean;
}

export class TableItem extends BaseTableItem {
  constructor (
    item: object,
    idSymbol: string,
    created?: Moment,
    edited?: Moment,
    editable?: boolean,
    locked?: boolean,
  ) {
    super(item, idSymbol, created, edited, editable, locked);
  }
}