import { reactive, readonly, provide, inject } from "vue"
import axios from "axios"
import { Message } from "../interfaces/message/message.interface"
import { MessageDTO } from "../interfaces/message/messageDTO.interface"
import { StoreState, StateMap, IStore, StoreAxios } from "./store.interface"

interface MessagesStateMap extends StateMap {
  ids: string[]
  all: Record<string, Message>
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

export class MessageStore extends StoreAxios<Message> implements IStore<Message> {
  protected state: MessageStoreState
  constructor(initialState: MessageStoreState) {
    super(initialState)
  }

  public getLastId(): Message['_id'] {
    const last = this.getLast<Message>()
    return last ? last._id : '-1'
  }

  async createRecord(message: Message, idSymbol:(string | number) = '_id', pushToDb: boolean = true) {
    // console.log('create record - message')
    // console.log(message)
    // console.log(idSymbol)
    // console.log(pushToDb)
    super.createRecord(message, '_id')
    if(pushToDb) {
      // console.log('writing to db')
      const response = await axios.post<MessageDTO>('http://localhost:3000/message/create', message)
      // console.log(response)
      this.fetchRecords()
    }
  }

  // // https://mariusschulz.com/blog/typing-destructured-object-parameters-in-typescript
  // async createRecord(
  //   message: Message,
  //   { idSymbol = '_id'}: { idSymbol?: string} = {},
  //   { pushToDb = true}: { pushToDb?: boolean} = {}
  // ) {
  //   super.createRecord(message, '_id')
  //   if(pushToDb) {
  //     const response = await axios.post<MessageDTO>('http://localhost:3000/message/create', message)
  //     this.fetchRecords()
  //   }
  // }
  
  
  async deleteRecord(message: Message): Promise<string> {
    super.deleteRecord(message, '_id')
    const response = await axios.delete<MessageDTO>(`http://localhost:3000/message/delete?message_id=${message._id}`)
    return response.data.message._id
  }
  
  async editRecord(oldMessage: Message, newMessage: Message, idSymbol: (string | number)) {
    super.editRecord(oldMessage, newMessage, '_id')
    // console.log('writing to db')
    const response = await axios.put<MessageDTO>(
      `http://localhost:3000/message/update?message_id=${oldMessage._id}`,
      newMessage
    )
  }

  async fetchRecords() {
    // get is generic so can specify type
    const response = await axios.get<Message[]>('http://localhost:3000/message/messages')
    let messages: Message[] = response.data.map((message: Message)=> {
      message.contact = message.contact[0]
      return message
    })
    this.addRecords(messages, '_id')
  }

  toggleEditable(message: Message, editable: boolean) {
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
  
  toggleDeletable(oldMessage: Message, deletable: boolean) {
    // without this line I was getting the bug where I had to click twice
    this.state.records.all[oldMessage._id].locked = deletable

    const newMessage: Message = {
      _id: oldMessage._id,
      subject: oldMessage.subject,
      body: oldMessage.body,
      category: oldMessage.category,
      contact: oldMessage.contact,
      created: oldMessage.created,
      edited: oldMessage.edited,
      editable: oldMessage.editable,
      locked: deletable
    }
    this.editRecord(oldMessage, newMessage, '_id')
  }  
}

const messageStore = new MessageStore(initialMessageStoreState())
messageStore.getState()

export const provideMessageStore = () =>  {
  provide('messageStore', messageStore)
}


export const createMessageStore = () => {
  const messageStore = new MessageStore(initialMessageStoreState())
  messageStore.getState()
  return messageStore
}

export const useMessageStore = (): MessageStore => {
  const messageStore = inject<MessageStore>('messageStore')
  return messageStore
}

export interface IMessageStore {
  messageStore: MessageStore
}
