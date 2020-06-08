import { createContactStore } from './contact.store'

const contactStore = createContactStore().getState()

export default {
  contactStore
}