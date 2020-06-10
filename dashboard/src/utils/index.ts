import { IContactStore, useContactStore, ContactStore } from '../store/contact.store'
import { Contact } from '../interfaces/contact.interface'
import { ITaskStore, useTaskStore, TaskStore } from '../store/task.store'
import { Task } from '../interfaces/task.interface'
import { Store, StoreAxios } from '../store/store.interface'

// using store interface eliminates vue warn about using inject outside of setup function

// export const updateContacts = async (iContactStore: IContactStore): Promise<Contact[]> => {
//   console.log('update contacts')

//   return iContactStore.contactStore.getState().contacts.ids.reduce<Contact[]>((accumulator, id) => {
//     const contact = iContactStore.contactStore.getState().contacts.all[id]
//     return accumulator.concat(contact)
//   }, [])

// }
// export const updateContacts = async (contactStore: ContactStore): Promise<Contact[]> => {
//   console.log('update contacts')

//   return contactStore.getState().contacts.ids.reduce<Contact[]>((accumulator, id) => {
//     const contact = contactStore.getState().contacts.all[id]
//     return accumulator.concat(contact)
//   }, [])

// }

export const loadRecords = async (store: (ContactStore | TaskStore), caller: string): Promise<any[]> => {
  console.log(`load records for ${caller}`)
  if (!store.getState().records.loaded) {
    await store.fetchRecords()
  }

  return store.getState().records.ids.reduce<any[]>((accumulator, id) => {
    const record = store.getState().records.all[id]
    // console.log(record)
    return accumulator.concat(record)
  }, [])

}

export const updateRecords = async (store: Store<any>, caller: string): Promise<any[]> => {
  console.log(`update records for ${caller}`)

  return store.getState().records.ids.reduce<Task[]>((accumulator, id) => {
    // console.log('update reducer')
    // console.log(id)
    const record = store.getState().records.all[id]
    // console.log(record)
    return accumulator.concat(record)
  }, [])

}

// export const updateTasks = async (iTaskStore: ITaskStore): Promise<Task[]> => {
//   console.log('update tasks')

//   return iTaskStore.taskStore.getState().tasks.ids.reduce<Task[]>((accumulator, id) => {
//     const task = iTaskStore.taskStore.getState().tasks.all[id]
//     return accumulator.concat(task)
//   }, [])

// }
// export const updateTasks = async (taskStore: TaskStore): Promise<Task[]> => {
//   console.log('update tasks')
//   // console.log(taskStore)

//   return taskStore.getState().tasks.ids.reduce<Task[]>((accumulator, id) => {
//     const task = taskStore.getState().tasks.all[id]
//     return accumulator.concat(task)
//   }, [])

// }

// export const loadContacts = async (iContactStore: IContactStore): Promise<Contact[]> => {
//   console.log('load contacts')
//   const contactStore = iContactStore.contactStore
//   if (!contactStore.getState().contacts.loaded) {
//     await contactStore.fetchContacts()
//   }

//   return contactStore.getState().contacts.ids.reduce<Contact[]>((accumulator, id) => {
//     const contact = contactStore.getState().contacts.all[id]
//     return accumulator.concat(contact)
//   }, [])

// }
// export const loadContacts = async (contactStore: ContactStore): Promise<Contact[]> => {
//   console.log('load contacts')
//   // console.log(contactStore)
//   // console.log(contactStore.getState())
//   if (!contactStore.getState().contacts.loaded) {
//     await contactStore.fetchContacts()
//   }
//   return contactStore.getState().contacts.ids.reduce<Contact[]>((accumulator, id) => {
//     const contact = contactStore.getState().contacts.all[id]
//     return accumulator.concat(contact)
//   }, [])

// }

// export const loadTasks = async (iTaskStore: ITaskStore): Promise<Task[]> => {
//   console.log('load tasks')
//   const taskStore = iTaskStore.taskStore
//   if (!taskStore.getState().tasks.loaded) {
//     await taskStore.fetchTasks()
//   }

//   return taskStore.getState().tasks.ids.reduce<Task[]>((accumulator, id) => {
//     const task = taskStore.getState().tasks.all[id]
//     return accumulator.concat(task)
//   }, [])

// }
// export const loadTasks = async (taskStore: TaskStore): Promise<Task[]> => {
//   console.log('load tasks')
//   // console.log(taskStore)
//   // console.log(taskStore.getState())
//   // const taskStore = iTaskStore.taskStore
//   if (!taskStore.getState().tasks.loaded) {
//     await taskStore.fetchTasks()
//   }

//   return taskStore.getState().tasks.ids.reduce<Task[]>((accumulator, id) => {
//     const task = taskStore.getState().tasks.all[id]
//     return accumulator.concat(task)
//   }, [])

// }
