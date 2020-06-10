import { reactive, readonly, provide, inject } from "vue"
import axios from "axios"
import { Task } from "../interfaces/task.interface"
import { TaskDTO } from "../interfaces/taskDTO.interface"
import { StoreState, Store, StateMap, IStore, StoreAxios } from "./store.interface"

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
  constructor(initialState: TaskStoreState) {
    super(initialState)
    // this.state = reactive(initialState)
  }

  public getLastId(): Task['_id'] {
    const last = this.getLast<Task>()
    return last ? last._id : '-1'
  }

  async createRecord(task: Task) {
    console.log('createRecord - task store')
    super.createRecord(task, '_id')
    const response = await axios.post<TaskDTO>('http://localhost:3000/task/create', task)
    this.fetchRecords()
  }
  
  async deleteRecord(task: Task): Promise<string> {
    super.deleteRecord(task, '_id')
    const response = await axios.delete<TaskDTO>(`http://localhost:3000/task/delete?task_id=${task._id}`)
    return response.data.task._id
  }
  
  async editRecord(oldTask: Task, newTask: Task, idSymbol: (string | number)) {
    super.editRecord(oldTask, newTask, '_id')
    console.log('writing to db')

    const response = await axios.put<TaskDTO>(
      `http://localhost:3000/task/update?task_id=${oldTask._id}`,
      newTask
    )
  }

  async fetchRecords() {
    // get is generic so can specify type
    const response = await axios.get<Task[]>('http://localhost:3000/task/tasks')
    this.addRecords(response.data, '_id')
  }

  toggleEditable(task: Task, editable: boolean) {
    console.log('toggle editable')
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
  
  toggleDeletable(oldTask: Task, deletable: boolean) {
    // console.log('toggle deletable')
    // console.log(deletable)
    // console.log('old locked', oldTask.locked)
    // console.log('old state locked', this.state.tasks.all[oldTask._id].locked)
    //
    // without this line I was getting the bug where I had to click twice
    //
    this.state.records.all[oldTask._id].locked = deletable
    //
    // console.log('new state locked', this.state.tasks.all[oldTask._id].locked)

    const newTask: Task = {
      _id: oldTask._id,
      name: oldTask.name,
      description: oldTask.description,
      category: oldTask.category,
      contact: oldTask.contact,
      created: oldTask.created,
      edited: oldTask.edited,
      editable: oldTask.editable,
      locked: deletable
    }
    // console.log('new locked', newTask.locked)
    this.editRecord(oldTask, newTask, '_id')
  }  
}

const taskStore = new TaskStore(initialTaskStoreState())
taskStore.getState()

export const provideTaskStore = () =>  {
  provide('taskStore', taskStore)
}


export const createTaskStore = () => {
  const taskStore = new TaskStore(initialTaskStoreState())
  taskStore.getState()
  return taskStore
}

export const useTaskStore = (): TaskStore => {
  // instead of returning store directly
  // create new var called store
  // inject this via 'store' string
  // search for closest component that called provideStore with same string 
  // and return that value
  const taskStore = inject<TaskStore>('taskStore')
  return taskStore
}

export interface ITaskStore {
  taskStore: TaskStore
}
