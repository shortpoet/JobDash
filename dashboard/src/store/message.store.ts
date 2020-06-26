import { reactive, readonly, provide, inject } from "vue"
import axios from "axios"
import { IMessage } from "../interfaces/message/message.interface"
import { MessageDTO } from "../interfaces/message/messageDTO.interface"
import { StoreState, StateMap, IStore, StoreAxios } from "./store.interface"

interface MessagesStateMap extends StateMap {
  ids: string[]
  all: Record<string, IMessage>
  loaded: boolean
}

interface MessageStoreState extends StoreState {
  records: MessagesStateMap
}

const initialMessagesStateMap = () : MessagesStateMap => ({
  ids: [
  ],
  all: {
  },
  loaded: false
})

const initialMessageStoreState = () : MessageStoreState => ({
  records: initialMessagesStateMap()
})

export class MessageStore extends StoreAxios<IMessage> implements IStore<IMessage> {
  protected state: MessageStoreState
  constructor(idSymbol: string, initialState: MessageStoreState) {
    super(idSymbol, initialState)
  }

  public getLastId(): IMessage['_id'] {
    const last = this.getLast<IMessage>()
    return last ? last._id : '-1'
  }

  async createRecord(message: IMessage, pushToDb: boolean = true) {
    super.createRecord(message)
    if(pushToDb) {
      const response = await axios.post<MessageDTO>('http://localhost:3000/message/create', message)
      this.fetchRecords()
    }
  }

  // // https://mariusschulz.com/blog/typing-destructured-object-parameters-in-typescript
  // async createRecord(
  //   message: IMessage,
  //   { idSymbol = '_id'}: { idSymbol?: string} = {},
  //   { pushToDb = true}: { pushToDb?: boolean} = {}
  // ) {
  //   super.createRecord(message, '_id')
  //   if(pushToDb) {
  //     const response = await axios.post<MessageDTO>('http://localhost:3000/message/create', message)
  //     this.fetchRecords()
  //   }
  // }
  
  
  async deleteRecord(message: IMessage): Promise<string> {
    super.deleteRecord(message)
    const response = await axios.delete<MessageDTO>(`http://localhost:3000/message/delete?message_id=${message._id}`)
    return response.data.message._id
  }
  
  async editRecord(oldMessage: IMessage, newMessage: IMessage) {
    super.editRecord(oldMessage, newMessage)
    // console.log('writing to db')
    const response = await axios.put<MessageDTO>(
      `http://localhost:3000/message/update?message_id=${oldMessage._id}`,
      newMessage
    )
  }

  async fetchRecords() {
    // get is generic so can specify type
    const response = await axios.get<IMessage[]>('http://localhost:3000/message/messages')
    let messages: IMessage[] = response.data.map((message: IMessage)=> {
      message.contact = message.contact[0]
      return message
    })
    this.addRecords(messages)
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

  toggleEditable(message: IMessage, editable: boolean) {
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
    this.state.records.all[message._id].editable = editable
    // this doesn't work because can't set value on readonly property (message is part of message Message[] which is a ref)
    // message.editable = editable
  }
  
  toggleLocked(oldMessage: IMessage, locked: boolean) {
    // without this line I was getting the bug where I had to click twice
    this.state.records.all[oldMessage._id].locked = locked

    const newMessage: IMessage = {
      _id: oldMessage._id,
      itemId: oldMessage._id,
      subject: oldMessage.subject,
      body: oldMessage.body,
      category: oldMessage.category,
      contact: oldMessage.contact,
      created: oldMessage.created,
      edited: oldMessage.edited,
      editable: oldMessage.editable,
      locked: locked
    }
    this.editRecord(oldMessage, newMessage)
  }  
}

// const messageStore = new MessageStore(initialMessageStoreState())
// messageStore.getState()

const MESSAGE_STORE = 'messageStore'

export const provideMessageStore = (idSymbol) =>  {
  provide(MESSAGE_STORE, new MessageStore(idSymbol, initialMessageStoreState()))
}


export const createMessageStore = (idSymbol) => {
  const messageStore = new MessageStore(idSymbol, initialMessageStoreState())
  messageStore.getState()
  return messageStore
}

export const useMessageStore = (): MessageStore => {
  const messageStore = inject<MessageStore>(MESSAGE_STORE)
  return messageStore
}

export interface IMessageStore {
  messageStore: MessageStore
}
