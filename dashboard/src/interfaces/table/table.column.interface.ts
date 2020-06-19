export interface ITableHeader {
  displayName: string
}

//#region control
  export interface ITableControl extends ITableHeader {
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
    displayName: string
    action: string
  }
//#endregion

//#region data

  export interface ITableData extends ITableHeader {
    propertyName: string
    displayName: string
  }

  export abstract class BaseTableData implements ITableData {
    constructor (propertyName: string) {}
    propertyName: string
    displayName: string
  }
  class TableData extends BaseTableData {
    constructor (propertyName: string) {
      super(propertyName);
      this.propertyName = propertyName;
      this.displayName = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
    }
    propertyName: string
    displayName: string
  }
//#endregion

//#region table
  export interface ITableConfig {
    columns: (ITableHeader[])
  }

  export interface ITableConfigSettings {
    columns: (ControlName[]|string[])
  }


  export abstract class BaseTableConfig implements ITableConfig {
    constructor (config: ITableConfigSettings) {}
    columns: (ITableHeader[])
  }

  export const ID: ControlName = 'Id'
  export const DELETE: ControlName = 'Delete'
  export const EDIT: ControlName = 'Edit'
  export const LOCKED: ControlName = 'Locked'
  export const MESSAGE: ControlName = 'Message'

  export type ControlName = 'Id' | 'Delete' | 'Edit' | 'Locked' | 'Message'

  export class TableConfig extends BaseTableConfig {
    columns: (ITableHeader[])
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
      console.log(config.columns)
      config.columns.forEach(column => {
        // console.log(column)
        if (controlNames.includes(column)) {
          this.columns.push(new TableControl(column, getAction(column)))
        } else {
          this.columns.push(new TableData(column))
        }
      })
    }
  }
  //#endregion