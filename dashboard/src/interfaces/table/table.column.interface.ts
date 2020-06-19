//#region control
  export interface ITableControl {
    displayName: string
    action: string
    
  }
  export abstract class BaseTableControl implements ITableControl {
    constructor (displayName: string, action: string) {}
    displayName: string
    action: string
  }
  class TableControl extends BaseTableControl {
    constructor (displayName: string, action: string) {
      super(displayName, action);
      this.displayName = displayName;
      this.action = action;
    }
    propertyName: string
  }
//#endregion

//#region data

  export interface ITableData {
    propertyName: string
  }

  export abstract class BaseTableData implements ITableData {
    constructor (propertyName: string) {}
    propertyName: string
  }
  class TableData extends BaseTableData {
    constructor (propertyName: string) {
      super(propertyName);
      this.propertyName = propertyName;
    }
    propertyName: string
  }
//#endregion

//#region table
  export interface ITableConfig {
    columns: (ITableControl[]&ITableData[])
  }

  export interface ITableConfigSettings {
    columns: (ControlName[]|string[])
  }


  export abstract class BaseTableConfig implements ITableConfig {
    constructor (config: ITableConfigSettings) {}
    columns: (ITableControl[]&ITableData[])
  }

  export const ID = 'Id'
  export const DELETE = 'Delete'
  export const EDIT = 'Edit'
  export const LOCKED = 'Locked'
  export const MESSAGE = 'Message'

  export type ControlName = 'Id' | 'Delete' | 'Edit' | 'Locked' | 'Message'

  export class TableConfig extends BaseTableConfig {
    columns: (ITableControl[]&ITableData[])
    constructor(config: ITableConfigSettings) {
      const controlNames: ControlName[] = [ID, DELETE, EDIT, LOCKED, MESSAGE]
      super(config);
      const getAction = (column) => {
        let action
        switch (column) {
          case ID:
            action = 'open-link'
            break;
          case DELETE:
            action = 'delete'
            break;
          case EDIT:
            action = 'edit'
            break;
          case LOCKED:
            action = 'toggle-delete'
            break;
          case MESSAGE:
            action = 'send-message'
            break;
          }
        return action
      }
      // must actually initialize the array or is undefined imagine that
      this.columns = []
      config.columns.forEach(column => {
        if (controlNames.includes(column)) {
          this.columns.push(new TableControl(column, getAction(column)))
        } else {
          this.columns.push(new TableData(column))
        }
      })
    }
  }
  //#endregion