
export interface ITableColumn {
  displayName: string
  displayOrder: number
}

export interface ITableDataInput {
  propertyName: string
  displayOrder: number
  editable: boolean
}

//#region control

  export const ID: ControlName = 'Id'
  export const DELETE: ControlName = 'Delete'
  export const EDIT: ControlName = 'Edit'
  export const LOCKED: ControlName = 'Locked'
  export const MESSAGE: ControlName = 'Message'

  export const ACTION_ID: ActionName = 'open-link'
  export const ACTION_DELETE: ActionName = 'delete'
  export const ACTION_EDIT: ActionName = 'edit'
  export const ACTION_LOCKED: ActionName = 'toggle-delete'
  export const ACTION_MESSAGE: ActionName = 'send-message'

  export type ControlName = 'Id' | 'Delete' | 'Edit' | 'Locked' | 'Message'
  export type ActionName = 'open-link' | 'delete' | 'edit' | 'toggle-delete' | 'send-message'

  export interface ITableControl extends ITableColumn {
    controlName: ControlName
    displayName: string
    action: string
    displayOrder: number
  }

  export abstract class BaseTableControl implements ITableControl {
    constructor (controlName: ControlName) {
      switch (controlName) {
        case ID:
          this.action = 'open-link'
          this.controlName = controlName;
          this.displayName = controlName;
          this.displayOrder = 0;    
          break;
        case DELETE:
          this.action = 'delete'
          this.controlName = controlName;
          this.displayName = controlName;
          this.displayOrder = 1;    
          break;
        case EDIT:
          this.action = 'edit'
          this.controlName = controlName;
          this.displayName = controlName;
          this.displayOrder = 2;    
          break;
        case LOCKED:
          this.action = 'toggle-delete'
          this.controlName = controlName;
          this.displayName = controlName;
          this.displayOrder = 3;    
          break;
        case MESSAGE:
          this.action = 'send-message'
          this.controlName = controlName;
          this.displayName = controlName;
          this.displayOrder = 4;    
          break;
        }
    }
    controlName: ControlName
    displayName: string
    action: string
    displayOrder: number
  }
  export class TableControl extends BaseTableControl {
    constructor (controlName: ControlName) {
      super(controlName);
    }
  }
//#endregion

//#region data

  export interface ITableData extends ITableColumn {
    propertyName: string
    editable: boolean
    displayOrder: number
  }

  export abstract class BaseTableData implements ITableData {
    constructor (propertyName: string, editable: boolean, displayOrder: number) {
      this.propertyName = propertyName;
      this.displayName = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
      this.editable = editable
      this.displayOrder = displayOrder;
    }
    propertyName: string
    displayName: string
    editable: boolean
    displayOrder: number
  }
  
  export class TableData extends BaseTableData {
    constructor (propertyName: string, editable: boolean, displayOrder: number) {
      super(propertyName, editable, displayOrder);
    }
  }
//#endregion

//#region config settings
  // export interface ITableConfigSettings {
  //   columns: (ControlName[]|string[])
  //   editable: (boolean[])
  // }

  export interface ITableConfigSettings {
    data: (ITableDataInput[])
    controls?: (ControlName[])
  }

  // export abstract class BaseTableConfigSettings implements ITableConfigSettings {
  //   constructor (config: ITableConfigSettings) {
  //     this.data = config.data
  //     this.controls = config.controls
  //   }
  //   data: (ITableDataInput[])
  //   controls: (ITableControl[])
  // }
  
  // export class TableConfigSettings extends BaseTableConfigSettings {
  //   constructor (config: ITableConfigSettings) {
  //     super(config)
  //   }
  // }
//#endregion

//#region table
  export interface ITableConfig {
    columns: (ITableColumn[])
    controlNames: (ControlName[])
    columnNames: (string[])
    controlColumns: (ITableColumn[])
    dataColumns: (ITableColumn[])
  }

  export abstract class BaseTableConfig implements ITableConfig {
    constructor (config: ITableConfigSettings) {
      // console.log(config)
      this.dataColumns = config.data.map(datum => new TableData(datum.propertyName, datum.editable, datum.displayOrder)),
      this.columnNames = config.data.map(column => column.propertyName)
      if (config.controls) {
        this.controlColumns = config.controls.map(datum => new TableControl(datum))
        this.controlNames = config.controls
        this.controlNames = config.controls
        // colorLog('has controls', 'yellow', 'blue')
        if (this.controlNames.includes(ID)) {
          this.columns = [
            ...this.controlColumns.slice(0,1),
            ...this.dataColumns,
            ...this.controlColumns.slice(1)
          ]
        } else {
          this.columns = [
            ...this.dataColumns,
            ...this.controlColumns
          ]
        }
      } else {
        this.columns = [
          ...this.dataColumns
        ]
      }
    }
    columns: (ITableColumn[])
    controlNames: (ControlName[])
    columnNames: (string[])
    controlColumns: (ITableColumn[])
    dataColumns: (ITableColumn[])

  }

  export class TableConfig extends BaseTableConfig {
    constructor(config: ITableConfigSettings) {
      super(config)
    }
  }
  //#endregion