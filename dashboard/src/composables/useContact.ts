
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useContactStore, IContactStore } from '../store/contact.store'
import { Contact } from '../interfaces/contact.interface'
import { updateContacts } from '../utils'

const loadContacts = async (): Promise<Contact[]> => {
  console.log('load contacts')
  const contactStore = useContactStore()
  if (!contactStore.getState().contacts.loaded) {
    await contactStore.fetchContacts()
  }

  return contactStore.getState().contacts.ids.reduce<Contact[]>((accumulator, id) => {
    const post = contactStore.getState().contacts.all[id]
    return accumulator.concat(post)
  }, [])

}

export default async function useContact() {
  console.log('use contact')

  const allContacts = ref<Contact[]>([])

  const contactStore = useContactStore()

  allContacts.value = await loadContacts()

  const iContactStore: IContactStore = {
    contactStore: contactStore
  }

  const onUpdateContacts = async () => {
    allContacts.value = await updateContacts(iContactStore)
  }
  
  return {
    allContacts,
    updateContacts,
    onUpdateContacts
  }
}
