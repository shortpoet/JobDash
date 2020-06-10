import { ContactStore } from '../store/contact.store'
import { TaskStore } from '../store/task.store'
import { Task } from '../interfaces/task.interface'
import { Store } from '../store/store.interface'

// using store interface eliminates vue warn about using inject outside of setup function

export const loadRecords = async (store: (ContactStore | TaskStore), caller: string): Promise<any[]> => {
  console.log(`load records for ${caller}`)
  if (!store.getState().records.loaded) {
    await store.fetchRecords()
  }
  return store.getState().records.ids.reduce<any[]>((accumulator, id) => {
    const record = store.getState().records.all[id]
    return accumulator.concat(record)
  }, [])
}

export const updateRecords = async (store: Store<any>, caller: string): Promise<any[]> => {
  console.log(`update records for ${caller}`)
  return store.getState().records.ids.reduce<Task[]>((accumulator, id) => {
    const record = store.getState().records.all[id]
    return accumulator.concat(record)
  }, [])
}
