import { IStore } from '../store'
import { Contact } from '../interfaces/contact.interface'

export const updateContacts = async (iStore: IStore): Promise<Contact[]> => {
  console.log('update contacts')

  return iStore.store.getState().contacts.ids.reduce<Contact[]>((accumulator, id) => {
    const post = iStore.store.getState().contacts.all[id]
    return accumulator.concat(post)
  }, [])

}

