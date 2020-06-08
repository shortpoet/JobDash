import { IContactStore, useContactStore } from '../store/contact.store'
import { Contact } from '../interfaces/contact.interface'
import { ITaskStore, useTaskStore } from '../store/task.store'
import { Task } from '../interfaces/task.interface'

// using store interface eliminates vue warn about using inject outside of setup function

export const updateContacts = async (iContactStore: IContactStore): Promise<Contact[]> => {
  console.log('update contacts')

  return iContactStore.contactStore.getState().contacts.ids.reduce<Contact[]>((accumulator, id) => {
    const contact = iContactStore.contactStore.getState().contacts.all[id]
    return accumulator.concat(contact)
  }, [])

}
export const updateTasks = async (iTaskStore: ITaskStore): Promise<Task[]> => {
  console.log('update tasks')

  return iTaskStore.taskStore.getState().tasks.ids.reduce<Task[]>((accumulator, id) => {
    const task = iTaskStore.taskStore.getState().tasks.all[id]
    return accumulator.concat(task)
  }, [])

}

export const loadContacts = async (iContactStore: IContactStore): Promise<Contact[]> => {
  console.log('load contacts')
  const contactStore = iContactStore.contactStore
  if (!contactStore.getState().contacts.loaded) {
    await contactStore.fetchContacts()
  }

  return contactStore.getState().contacts.ids.reduce<Contact[]>((accumulator, id) => {
    const contact = contactStore.getState().contacts.all[id]
    return accumulator.concat(contact)
  }, [])

}

export const loadTasks = async (iTaskStore: ITaskStore): Promise<Task[]> => {
  console.log('load tasks')
  const taskStore = iTaskStore.taskStore
  if (!taskStore.getState().tasks.loaded) {
    await taskStore.fetchTasks()
  }

  return taskStore.getState().tasks.ids.reduce<Task[]>((accumulator, id) => {
    const task = taskStore.getState().tasks.all[id]
    return accumulator.concat(task)
  }, [])

}
