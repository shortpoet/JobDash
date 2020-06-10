
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useContactStore, IContactStore } from '../store/contact.store.explore'
import { Contact } from '../interfaces/contact.interface'
import { updateRecords, loadRecords } from '../utils'

// export default async function useContact(allContactsRef) {
//   // console.log('use contact')

//   const contactStore = useContactStore()
  
//   const iContactStore: IContactStore = {
//     contactStore: contactStore
//   }
  
//   allContactsRef.value = await loadContacts(iContactStore)

//   const onUpdateContacts = async () => {
//     allContactsRef.value = await updateContacts(iContactStore)
//   }
  
//   return {
//     allContactsRef,
//     onUpdateContacts
//   }
// }

export default async function useContact(contactStore, allContactsRef) {
  console.log('use contact')
  
  allContactsRef.value = await loadRecords(contactStore, 'contacts')
  
  const onUpdateContacts = async () => {
    console.log('use contact - update')
    const newValue = await updateRecords(contactStore,'contacts')
    allContactsRef.value = newValue
  }
  
  return {
    allContactsRef,
    onUpdateContacts
  }
}
