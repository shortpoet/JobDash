import { IContactStore } from '../store/contact.store'
import { Contact } from '../interfaces/contact.interface'
import { ITaskStore } from '../store/task.store'
import { Task } from '../interfaces/task.interface'

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

