
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useContactStore, IContactStore } from '../store/contact.store'
import { Contact } from '../interfaces/contact.interface'
import { updateContacts, loadContacts } from '../utils'

export default async function useContact(iContactStore, allContactsRef) {
  // console.log('use contact')

  
  allContactsRef.value = await loadContacts(iContactStore)

  const onUpdateContacts = async () => {
    allContactsRef.value = await updateContacts(iContactStore)
  }
  
  return {
    allContactsRef,
    onUpdateContacts
  }
}
