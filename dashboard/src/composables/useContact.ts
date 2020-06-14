
import { ref, watch } from 'vue'
import { Contact } from '../interfaces/contact/contact.interface'
import { updateRecords, loadRecords } from '../utils'
import moment from 'moment'

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
  // console.log('use contact')
  //#region load
    allContactsRef.value = await loadRecords(contactStore, 'contacts')
  //#endregion

  //#region update
    const onUpdateContacts = async () => {
      // console.log('use contact - update')
      const newValue = await updateRecords(contactStore,'contacts')
      allContactsRef.value = newValue
    }
  //#endregion

  //#region edit

    const nameEdit = ref() 
    const companyEdit = ref() 
    const emailEdit = ref()
    const contactTouched = ref(false)

    const edits = { nameEdit, companyEdit, emailEdit, contactTouched } 
    const editContact = async (oldContact: Contact, newContact: Contact, edits) => {
      if (oldContact.editable == false) {
        contactStore.toggleEditable(oldContact, true)
        nameEdit.value = oldContact.name
        companyEdit.value = oldContact.company
        emailEdit.value = oldContact.email
      } else {
        if (contactTouched.value == true) {
          const newContact: Contact = {
            _id: oldContact._id,
            itemId: oldContact._id,
            name: nameEdit.value,
            company: companyEdit.value,
            email: emailEdit.value,
            created: oldContact.created,
            edited: moment(),
            editable: false,
            locked: true
          }
          await contactStore.editRecord(
            oldContact, 
            newContact,
            '_id'
          )
          contactTouched.value = false
          // this closes the edit window by updating the refs after newContact editable set to false
          // ctx.emit('update-contacts')
          onUpdateContacts()
        } else {
          contactStore.toggleEditable(oldContact, false)
        }
      }

      const updateField = (value: string, previous: string) => {
        if (previous) {
          contactTouched.value = true
        }
      }
    
      watch(
        () => nameEdit.value,
        (value: string, previous: string) => updateField(value, previous)
      )
      watch(
        () => companyEdit.value,
        (value: string, previous: string) => updateField(value, previous)
      )
      watch(
        () => emailEdit.value,
        (value: string, previous: string) => updateField(value, previous)
      )

    }
  //#endregion

  return {
    allContactsRef,
    onUpdateContacts,
    editContact
  }
}
