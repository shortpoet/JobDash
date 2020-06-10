import { reactive, readonly, provide, inject } from "vue"
import axios from "axios"
import { Contact } from "../interfaces/contact.interface"
import { ContactDTO } from "../interfaces/contactDTO.interface"
import { StateMap, Store, StoreState, IStore, StoreAxios } from "./store.interface"

interface ContactStateMap extends StateMap {
  ids: string[]
  all: Record<string, Contact>
  loaded: boolean
}

interface ContactStoreState extends StoreState{
  records: StateMap,
  // contacts: StateMap
}

const initialContactsStateMap = () : ContactStateMap => ({
  ids: [
  ],
  all: {
  },
  loaded: false
})

const initialContactStoreState = () : ContactStoreState => ({
  records: initialContactsStateMap(),
  // contacts: initialContactsStateMap()
})


export class ContactStore extends StoreAxios<Contact> implements IStore<Contact> {
  protected state: ContactStoreState
  constructor(initialState: ContactStoreState) {
    super(initialState)
    // this.state['contacts'] = this.state.records
    // this.state = reactive(initialState)
  }

  public getLastId(): Contact['_id'] {
    const last = this.getLast<Contact>()
    return last ? last._id : '-1'
  }

  async createRecord(contact: Contact) {
    console.log('create record - contact store')
    super.createRecord(contact, '_id')
    const response = await axios.post<ContactDTO>('http://localhost:3000/contact/create', contact)
    this.fetchRecords()
  }

  async deleteRecord(contact: Contact): Promise<string> {
    super.deleteRecord(contact, '_id')
    const response = await axios.delete<ContactDTO>(`http://localhost:3000/contact/delete?contact_id=${contact._id}`)
    return response.data.contact._id
  }

  
  async editRecord(oldContact: Contact, newContact: Contact, idSymbol: (string | number)) {
    super.editRecord(oldContact, newContact, '_id')
    console.log('writing to db')

    const response = await axios.put<ContactDTO>(
      `http://localhost:3000/contact/update?contact_id=${oldContact._id}`,
      newContact
    )
  }

  async fetchRecords() {
    // get is generic so can specify type
    const data = await this._fetchRecords('http://localhost:3000/contact/contacts')
    console.log('fetch records')
    this.addRecords(data, '_id')
    this.state.records.loaded = true
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
    this.state.records.all[contact._id].editable = editable
    // this doesn't work because can't set value on readonly property (contact is part of contact Contact[] which is a ref)
    // contact.editable = editable
  }
  
  toggleDeletable(oldContact: Contact, deletable: boolean) {
    console.log('toggle deletable')
    // console.log(deletable)
    // console.log('old locked', oldContact.locked)
    // console.log('old state locked', this.state.contacts.all[oldContact._id].locked)
    //
    // without this line I was getting the bug where I had to click twice
    //
    this.state.records.all[oldContact._id].locked = deletable
    //
    // console.log('new state locked', this.state.contacts.all[oldContact._id].locked)
    const newContact: Contact = {
      _id: oldContact._id,
      name: oldContact.name,
      company: oldContact.company,
      email: oldContact.email,
      created: oldContact.created,
      edited: oldContact.edited,
      editable: oldContact.editable,
      locked: deletable
    }
    // console.log('new locked', newContact.locked)
    this.editRecord(oldContact, newContact, '_id')
  }
}

const contactStore = new ContactStore(initialContactStoreState())
contactStore.getState()

export const provideContactStore = () =>  {
  provide('contactStore', contactStore)
}


export const createContactStore = () => {
  const contactStore = new ContactStore(initialContactStoreState())
  contactStore.getState()
  return contactStore
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
