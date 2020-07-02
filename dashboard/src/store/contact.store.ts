import { reactive, readonly, provide, inject } from "vue"
import axios from "axios"
import { IContact } from "../interfaces/contact/contact.interface"
import { ContactDTO } from "../interfaces/contact/contactDTO.interface"
import { StateMap, Store, StoreState, IStore, StoreAxios } from "./store.interface"
import { ITableItem } from "../interfaces/table/table.item.interface"

interface ContactStateMap extends StateMap {
  ids: string[]
  all: Record<string, IContact>
  loaded: boolean
}

interface ContactStoreState extends StoreState{
  records: StateMap,
}

const initialContactsStateMap = () : ContactStateMap => ({
  ids: [
  ],
  itemIds: [
  ],
  all: {
  },
  loaded: false
})

const initialContactStoreState = () : ContactStoreState => ({
  records: initialContactsStateMap(),
})


export class ContactStore extends StoreAxios<IContact> implements IStore<IContact> {
  protected state: ContactStoreState
  constructor(idSymbol: string, initialState: ContactStoreState) {
    super(idSymbol, initialState)
    // this.state['contacts'] = this.state.records
    // this.state = reactive(initialState)
  }

  public getLastId(): IContact['_id'] {
    const last = this.getLast<IContact>()
    return last ? last._id : '-1'
  }

  async createRecord(contact: IContact) {
    super.createRecord(contact)
    const response = await axios.post<ContactDTO>('http://localhost:3000/contact/create', contact)
    this.fetchRecords()
  }

  async deleteRecord(contact: IContact): Promise<string> {
    super.deleteRecord(contact)
    const response = await axios.delete<ContactDTO>(`http://localhost:3000/contact/delete?contact_id=${contact._id}`)
    return response.data.contact._id
  }

  
  async editRecord(oldContact: IContact, newContact: IContact) {
    super.editRecord(oldContact, newContact)
    // console.log('writing to db')

    const response = await axios.put<ContactDTO>(
      `http://localhost:3000/contact/update?contact_id=${oldContact._id}`,
      newContact
    )
  }

  async fetchRecords() {
    // get is generic so can specify type
    const data = await super._fetchRecords('http://localhost:3000/contact/contacts')
    // console.log('fetch records')
    this.addRecords(data)
    this.state.records.loaded = true
  }

  public async loadRecords (caller: string): Promise<any[]> {
    console.log(`load records for ${caller}`)
    if (!this.state.records.loaded) {
      console.log('fetching - not yet loaded')
      await this.fetchRecords()
    }
    console.log('loading')
    return super.updateRecords(caller);
  }

  toggleEditable(contact: IContact, editable: boolean) {
    // console.log('toggle editable')
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
  
  toggleLocked(oldContact: IContact, locked: boolean) {
    // console.log('toggle locked')
    // without this line I was getting the bug where I had to click twice
    this.state.records.all[oldContact._id].locked = locked
    const newContact: IContact = {
      _id: oldContact._id,
      itemId: oldContact.itemId,
      name: oldContact.name,
      company: oldContact.company,
      email: oldContact.email,
      website: oldContact.website,
      location: oldContact.location,
      position: oldContact.position,
      skills: oldContact.skills,
      compensation: oldContact.compensation,
      created: oldContact.created,
      edited: oldContact.edited,
      editable: oldContact.editable,
      locked: locked
    }
    this.editRecord(oldContact, newContact)
  }
}

// const contactStore = new ContactStore(initialContactStoreState())
// contactStore.getState()

const CONTACT_STORE = 'contactStore'


export const provideContactStore = (idSymbol) =>  {
  provide(CONTACT_STORE, new ContactStore(idSymbol, initialContactStoreState()))
}


export const createContactStore = (idSymbol) => {
  const store = new ContactStore(idSymbol, initialContactStoreState())
  store.getState()
  return store
}

export const useContactStore = (): ContactStore => {
  // instead of returning store directly
  // create new var called store
  // inject this via 'store' string
  // search for closest component that called provideStore with same string 
  // and return that value
  const store = inject<ContactStore>(CONTACT_STORE)
  return store
}

export interface IContactStore {
  contactStore: ContactStore
}
