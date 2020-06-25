import { reactive, readonly, provide, inject } from "vue"
import axios from "axios"
import { Task } from "../interfaces/task/task.interface"
import { TaskDTO } from "../interfaces/task/taskDTO.interface"
import { StoreState, StateMap, IStore, StoreAxios } from "./store.interface"
import { colorLog } from "../utils"

interface TasksStateMap extends StateMap {
  ids: string[]
  all: Record<string, Task>
  loaded: boolean
}

interface TaskStoreState extends StoreState {
  records: TasksStateMap
}

const initialTasksStateMap = () : TasksStateMap => ({
  ids: [
  ],
  all: {
  },
  loaded: false
})

const initialTaskStoreState = () : TaskStoreState => ({
  records: initialTasksStateMap()
})

export class TaskStore extends StoreAxios<Task> implements IStore<Task> {
  protected state: TaskStoreState
  constructor(idSymbol: string, initialState: TaskStoreState) {
    super(idSymbol, initialState)
  }

  public getLastId(): Task['_id'] {
    const last = this.getLast<Task>()
    return last ? last._id : '-1'
  }

  async createRecord(task: Task) {
    super.createRecord(task)
    const response = await axios.post<TaskDTO>('http://localhost:3000/task/create', task)
    this.fetchRecords()
  }
  
  async deleteRecord(task: Task): Promise<string> {
    super.deleteRecord(task)
    const response = await axios.delete<TaskDTO>(`http://localhost:3000/task/delete?task_id=${task._id}`)
    return response.data.task._id
  }
  
  async editRecord(oldTask: Task, newTask: Task) {
    super.editRecord(oldTask, newTask)
    console.log('writing to db')
    const response = await axios.put<TaskDTO>(
      `http://localhost:3000/task/update?task_id=${oldTask._id}`,
      newTask
    )
  }

  async fetchRecords() {
    const data = await this._fetchRecords('http://localhost:3000/task/tasks')
    let tasks: Task[] = data.map((task: Task)=> {
      task.contact = task.contact[0]
      return task
    })
    this.addRecords(tasks)
    this.state.records.loaded = true
  }
  public async loadRecords (caller: string): Promise<any[]> {
    console.log(`load records for ${caller}`)
    if (!this.state.records.loaded) {
      console.log('fetching - not yet loaded')
      await this.fetchRecords()
    }
    console.log('loading')
    return super.updateRecords(caller);
  }

  toggleEditable(task: Task, editable: boolean) {
    console.log('toggle editable from task store')
    // this only affects local state
    // doesn't actually have to be updated in db unless we want the edit state to persist through reload
    // even then could make use of browser storage api
    // should actually persist store there
    // TODO
    // create api service that pushes to browser storage
    // only updates db after timeout or event
    // practice optimization
    // #TODO
    // this works 
    this.state.records.all[task._id].editable = editable
    // this doesn't work because can't set value on readonly property (task is part of task Task[] which is a ref)
    // task.editable = editable
  }
  
  toggleLocked(oldTask: Task, locked: boolean) {
    // without this line I was getting the bug where I had to click twice
    // now not anymore
    // TBD
    // console.log(oldTask)
    // this.state.records.all[oldTask._id].locked = locked

    const newTask: Task = {
      _id: oldTask._id,
      itemId: oldTask._id,
      name: oldTask.name,
      description: oldTask.description,
      category: oldTask.category,
      contact: oldTask.contact,
      created: oldTask.created,
      edited: oldTask.edited,
      editable: oldTask.editable,
      locked: locked
    }
    this.editRecord(oldTask, newTask)
  }  
}

// const taskStore = new TaskStore(initialTaskStoreState())
// taskStore.getState()

const TASK_STORE = 'taskStore'

export const provideMessageStore = (idSymbol) =>  {
  provide(TASK_STORE, new TaskStore(idSymbol, initialTaskStoreState()))
}


export const createTaskStore = (idSymbol) => {
  const taskStore = new TaskStore(idSymbol, initialTaskStoreState())
  taskStore.getState()
  return taskStore
}

export const useTaskStore = (): TaskStore => {
  const taskStore = inject<TaskStore>(TASK_STORE)
  return taskStore
}

export interface ITaskStore {
  taskStore: TaskStore
}
