import { IContactStore } from '../store/contact.store'
import { Contact } from '../interfaces/contact.interface'

export const updateContacts = async (iContactStore: IContactStore): Promise<Contact[]> => {
  console.log('update contacts')

  return iContactStore.contactStore.getState().contacts.ids.reduce<Contact[]>((accumulator, id) => {
    const post = iContactStore.contactStore.getState().contacts.all[id]
    return accumulator.concat(post)
  }, [])

}

