
export interface ITableColumn {
  displayName: string
  displayOrder: number
}


//#region control

  export const CONTROL_ID: ControlName = 'Id'
  export const CONTROL_DELETE: ControlName = 'Delete'
  export const CONTROL_EDIT: ControlName = 'Edit'
  export const CONTROL_LOCKED: ControlName = 'Locked'
  export const CONTROL_MESSAGE: ControlName = 'Message'

  export const ACTION_ID: ActionName = 'open-link'
  export const ACTION_DELETE: ActionName = 'delete'
  export const ACTION_EDIT: ActionName = 'edit'
  export const ACTION_LOCKED: ActionName = 'toggle-delete'
  export const ACTION_MESSAGE: ActionName = 'send-message'

  export type ControlName = 'Id' | 'Delete' | 'Edit' | 'Locked' | 'Message'
  export type ActionName = 'open-link' | 'delete' | 'edit' | 'toggle-delete' | 'send-message'

  export interface ITableColumnControl extends ITableColumn {
    controlName: ControlName
    displayName: string
    action: string
    displayOrder: number
  }

  export abstract class BaseTableColumnControl implements ITableColumnControl {
    constructor (controlName: ControlName) {
      switch (controlName) {
        case CONTROL_ID:
          this.action = 'open-link'
          this.controlName = controlName;
          this.displayName = controlName;
          this.displayOrder = 0;    
          break;
        case CONTROL_DELETE:
          this.action = 'delete'
          this.controlName = controlName;
          this.displayName = controlName;
          this.displayOrder = 1;    
          break;
        case CONTROL_EDIT:
          this.action = 'edit'
          this.controlName = controlName;
          this.displayName = controlName;
          this.displayOrder = 2;    
          break;
        case CONTROL_LOCKED:
          this.action = 'toggle-delete'
          this.controlName = controlName;
          this.displayName = controlName;
          this.displayOrder = 3;    
          break;
        case CONTROL_MESSAGE:
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
  export class TableColumnControl extends BaseTableColumnControl {
    constructor (controlName: ControlName) {
      super(controlName);
    }
  }
//#endregion

//#region data

  export interface ITableColumnData extends ITableColumn {
    propertyName: string
    editable: boolean
    displayOrder: number
  }

  export abstract class BaseTableColumnData implements ITableColumnData {
    constructor (
      propertyName: string,
      editable: boolean,
      displayOrder: number
      ) {
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
  
  export class TableColumnData extends BaseTableColumnData {
    constructor (propertyName: string, editable: boolean, displayOrder: number) {
      super(propertyName, editable, displayOrder);
    }
  }
//#endregion

//#region config settings

  export interface ITableConfigSettings {
    data: (string[])
    controls?: (ControlName[])
    editable?: (string[])
  }

//#endregion

//#region table
  export interface ITableConfig {
    columns: (ITableColumn[])
    controlNames: (ControlName[])
    columnNames: (string[])
    controlColumns: (ITableColumnControl[])
    dataColumns: (ITableColumnData[])
  }

  export abstract class BaseTableConfig implements ITableConfig {
    constructor (config: ITableConfigSettings) {
      // console.log(config)
      this.columnNames = config.data
      if (config.editable) {
        this.editableColumnNames = config.editable
        this.readOnlyColumnNames = config.data.filter(x => !config.editable.includes(x))
        this.dataColumns = config.editable
          .map((datum, i) => new TableColumnData(datum, true, i))
          .concat(this.readOnlyColumnNames
            .map((datum, i) => new TableColumnData(datum, false, i))
            )
      } else {
        this.editableColumnNames = []
        this.dataColumns = config.data.map((datum, i) => new TableColumnData(datum, false, i))
        this.readOnlyColumnNames = this.dataColumns
          .map(col => col.propertyName)
      }
      if (config.controls) {
        this.controlColumns = config.controls.map(datum => new TableColumnControl(datum))
        this.controlNames = config.controls
        // colorLog('has controls', 'yellow', 'blue')
        if (this.controlNames.includes(CONTROL_ID)) {
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
    readOnlyColumnNames: (string[])
    editableColumnNames: (string[])
    controlColumns: (ITableColumnControl[])
    dataColumns: (ITableColumnData[])

  }

  export class TableConfig extends BaseTableConfig {
    constructor(config: ITableConfigSettings) {
      super(config)
    }
    getAllProperties = () => {
      const columns = this.columns
      const controlNames = this.controlNames
      const columnNames = this.columnNames
      const controlColumns = this.controlColumns
      const dataColumns = this.dataColumns
      return {
        columns,
        controlNames,
        columnNames,
        controlColumns,
        dataColumns
      }
    }
  }
  //#endregion