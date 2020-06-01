import { reactive, readonly, provide, inject } from "vue"
import axios from "axios"
import { Contact } from "./../interfaces/contact.interface"

interface ContactsState {
  ids: string[]
  all: Record<string, Contact>
  loaded: boolean
}

interface State {
  contacts: ContactsState
}

const initialContactsState = () : ContactsState => ({
  ids: [
  ],
  all: {
  },
  loaded: false
})

const initialState = () : State => ({
  contacts: initialContactsState()
})

class Store {
  protected state: State
  constructor(initialState: State) {
    this.state = reactive(initialState)
  }

  public getState(): State {
    return readonly(this.state)
  }

  async createContact(contact: Contact) {
    const response = await axios.post<Contact>('/contact/create', contact)
    this.state.contacts.all[response.data._id] = response.data
    this.state.contacts.ids.push(response.data._id.toString())
  }


  async fetchContacts() {
    // get is generic so can specify type
    const response = await axios.get<Contact[]>('http://localhost:3000/contact/contacts')
    // to avoid mutating at all costs can do 
    // response.data.reduce(...)

    // this initial code resets state
    // const ids: string[] = []
    // const all: Record<string, Post> = {}

    console.log(response.data)

    for (const contact of response.data) {



      // do a check to account for duplicates
      if (!this.state.contacts.ids.includes(contact._id.toString())) {
        this.state.contacts.ids.push(contact._id.toString())
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

  }

}

const store = new Store(initialState())
store.getState()

export const provideStore = () =>  {
  provide('store', store)
}


export const createStore = () => {
  return new Store(initialState())
}

export const useStore = (): Store => {
  // instead of returning store directly
  // create new var called store
  // inject this via 'store' string
  // search for closest component that called provideStore with same string 
  // and return that value
  const store = inject<Store>('store')
  return store


}