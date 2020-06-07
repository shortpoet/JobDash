import { reactive, readonly, provide, inject } from "vue"
import axios from "axios"
import { Contact } from "../interfaces/contact.interface"
import { ContactDTO } from "../interfaces/contactDTO.interface"

interface ContactsState {
  ids: string[]
  all: Record<string, Contact>
  loaded: boolean
}

interface ContactStoreState {
  contacts: ContactsState
}

const initialContactsState = () : ContactsState => ({
  ids: [
  ],
  all: {
  },
  loaded: false
})

const initialContactStoreState = () : ContactStoreState => ({
  contacts: initialContactsState()
})

class ContactStore {
  protected state: ContactStoreState
  constructor(initialState: ContactStoreState) {
    this.state = reactive(initialState)
  }

  public getState(): ContactStoreState {
    return readonly(this.state)
  }

  public getLastId(): Contact['_id'] {
    const last = this.state.contacts.ids.slice(-1)[0]
    // console.log(last)
    // if database / store are empty return -1
    return last ? this.state.contacts.all[last]._id : '-1'
  }
  
  public geContactById(_id: string): Contact {
    return this.state.contacts.all[_id]
  }

  async createContact(contact: Contact) {
    const response = await axios.post<ContactDTO>('http://localhost:3000/contact/create', contact)
    this.state.contacts.all[response.data.contact._id] = response.data.contact
    this.state.contacts.ids.push(response.data.contact._id.toString())
    this.fetchContacts()
  }

  async deleteContact(contact: Contact) {
    // console.log(contact._id)
    // console.log(this.state.contacts.all[contact._id])
    const response = await axios.delete<ContactDTO>(`http://localhost:3000/contact/delete?contact_id=${contact._id}`)
    // console.log(response)
    delete this.state.contacts.all[response.data.contact._id]
    const index = this.state.contacts.ids.indexOf(response.data.contact._id.toString())
    this.state.contacts.ids.splice(index, 1)
    return response.data.contact._id
    // console.log(this.state.contacts.all)
  }

  toggleEditable(contact: Contact, editable: boolean) {
    console.log('toggle editable')
    // this only affects local state
    // doesn't actually have to be updated in db unless we want the edit state to persist through reload
    // even then could make use of browser storage api
    // should actually persist store there
    // TODO
    // create api service that pushes to browser storage
    // only updates db after timeout or event
    // practice optimization
    // #TODO
    // this works 
    this.state.contacts.all[contact._id].editable = editable
    // this doesn't work because can't set value on readonly property (contact is part of contact Contact[] which is a ref)
    // contact.editable = editable
  }
  
  toggleDeletable(oldContact: Contact, deletable: boolean) {
    // console.log('toggle deletable')
    // console.log(deletable)
    // console.log('old locked', oldContact.locked)
    // console.log('old state locked', this.state.contacts.all[oldContact._id].locked)
    //
    // without this line I was getting the bug where I had to click twice
    //
    this.state.contacts.all[oldContact._id].locked = deletable
    //
    // console.log('new state locked', this.state.contacts.all[oldContact._id].locked)

    const newContact: Contact = {
      _id: oldContact._id,
      name: oldContact.name,
      company: oldContact.name,
      email: oldContact.name,
      created: oldContact.created,
      edited: oldContact.edited,
      editable: oldContact.editable,
      locked: deletable
    }
    // console.log('new locked', newContact.locked)
    this.editContact(oldContact, newContact)
  }
  
  async editContact(oldContact: Contact, newContact: Contact) {
    // console.log('old locked', oldContact.locked)
    // console.log('new locked', newContact.locked)
    console.log('writing to db')

    const response = await axios.put<ContactDTO>(
      `http://localhost:3000/contact/update?contact_id=${oldContact._id}`,
      newContact
    )
    // console.log('response locked', response.data.contact.locked)
    this.state.contacts.all[response.data.contact._id] = response.data.contact
  }

  async fetchContacts() {
    // get is generic so can specify type
    const response = await axios.get<Contact[]>('http://localhost:3000/contact/contacts')
    // to avoid mutating at all costs can do 
    // response.data.reduce(...)

    // this initial code resets state
    // const ids: string[] = []
    // const all: Record<string, Post> = {}

    // console.log(response.data)

    for (const contact of response.data) {
      // console.log(contact)



      // do a check to account for duplicates
      if (!this.state.contacts.ids.includes(contact._id)) {
        this.state.contacts.ids.push(contact._id)
      }
      // using number as key to JS object, it implicitly assumes it is a string and calls .toString() automatically
      this.state.contacts.all[contact._id] = contact
    }

    this.state.contacts.loaded = true

    // old implementation 

    // this.state.posts = {
    //   ids,
    //   all,
    //   loaded: true
    // }

    // console.log(this.state.contacts)

  }

}

const contactStore = new ContactStore(initialContactStoreState())
contactStore.getState()

export const provideContactStore = () =>  {
  provide('contactStore', contactStore)
}


export const createContactStore = () => {
  return new ContactStore(initialContactStoreState())
}

export const useContactStore = (): ContactStore => {
  // instead of returning store directly
  // create new var called store
  // inject this via 'store' string
  // search for closest component that called provideStore with same string 
  // and return that value
  const contactStore = inject<ContactStore>('contactStore')
  return contactStore
}

export interface IContactStore {
  contactStore: ContactStore
}
