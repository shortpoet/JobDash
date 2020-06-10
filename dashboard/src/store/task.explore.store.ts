import { reactive, readonly, provide, inject } from "vue"
import axios from "axios"
import { Task } from "../interfaces/task.interface"
import { TaskDTO } from "../interfaces/taskDTO.interface"
import { Store } from "./store.explore.interface"

interface TasksState {
  ids: string[]
  all: Record<string, Task>
  loaded: boolean
}

interface TaskStoreState {
  tasks: TasksState
}

const initialTasksState = () : TasksState => ({
  ids: [
  ],
  all: {
  },
  loaded: false
})

const initialTaskStoreState = () : TaskStoreState => ({
  tasks: initialTasksState()
})

export class TaskStore extends Store {
  protected state: TaskStoreState
  constructor(initialState: TaskStoreState) {
    super()
    this.state = reactive(initialState)
  }

  public getState(): TaskStoreState {
    return readonly(this.state)
  }

  public getLastId(): Task['_id'] {
    const last = this.state.tasks.ids.slice(-1)[0]
    // console.log(last)
    // if database / store are empty return -1
    return last ? this.state.tasks.all[last]._id : '-1'
  }

  async createTask(task: Task) {
    const response = await axios.post<TaskDTO>('http://localhost:3000/task/create', task)
    this.state.tasks.all[response.data.task._id] = response.data.task
    this.state.tasks.ids.push(response.data.task._id.toString())
    this.fetchTasks()
  }

  async deleteTask(task: Task) {
    // console.log(task._id)
    // console.log(this.state.tasks.all[task._id])
    const response = await axios.delete<TaskDTO>(`http://localhost:3000/task/delete?task_id=${task._id}`)
    // console.log(response)
    delete this.state.tasks.all[response.data.task._id]
    const index = this.state.tasks.ids.indexOf(response.data.task._id.toString())
    this.state.tasks.ids.splice(index, 1)
    return response.data.task._id
    // console.log(this.state.tasks.all)
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
    this.state.tasks.all[task._id].editable = editable
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
    this.state.tasks.all[oldTask._id].locked = deletable
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
    this.editTask(oldTask, newTask)
  }
  
  async editTask(oldTask: Task, newTask: Task) {
    // console.log('old locked', oldTask.locked)
    // console.log('new locked', newTask.locked)
    console.log('writing to db')

    const response = await axios.put<TaskDTO>(
      `http://localhost:3000/task/update?task_id=${oldTask._id}`,
      newTask
    )
    // console.log('response locked', response.data.task.locked)
    this.state.tasks.all[response.data.task._id] = response.data.task
  }

  async fetchTasks() {
    // get is generic so can specify type
    const response = await axios.get<Task[]>('http://localhost:3000/task/tasks')
    // to avoid mutating at all costs can do 
    // response.data.reduce(...)

    // this initial code resets state
    // const ids: string[] = []
    // const all: Record<string, Post> = {}

    // console.log(response.data)

    for (const task of response.data) {
      // console.log(task)



      // do a check to account for duplicates
      if (!this.state.tasks.ids.includes(task._id)) {
        this.state.tasks.ids.push(task._id)
      }
      // using number as key to JS object, it implicitly assumes it is a string and calls .toString() automatically
      this.state.tasks.all[task._id] = task
    }

    this.state.tasks.loaded = true

    // old implementation 

    // this.state.posts = {
    //   ids,
    //   all,
    //   loaded: true
    // }

    // console.log(this.state.tasks)

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
