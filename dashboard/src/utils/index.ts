import { ContactStore } from '../store/contact.store'
import { TaskStore } from '../store/task.store'
import { Task } from '../interfaces/task/task.interface'
import { Store } from '../store/store.interface'
import { MessageStore } from '../store/message.store'
import { BoardStore } from '../store/board.store'

// using store interface eliminates vue warn about using inject outside of setup function

export const loadRecords = async (
    store: (ContactStore | TaskStore | MessageStore | BoardStore),
    caller: string,
    // optional arg for records that are the result of aggregation of data
    // that requires a call to api
    data?: any[]
  ): Promise<any[]> => {
  console.log(`load records for ${caller}`)
  if (!store.getState().records.loaded) {
    await store.fetchRecords(data)
  }
  return store.getState().records.ids.reduce<any[]>((accumulator, id) => {
    const record = store.getState().records.all[id]
    return accumulator.concat(record)
  }, [])
}

export const updateRecords = async (store: Store<any>, caller: string): Promise<any[]> => {
  console.log(`update records for ${caller}`)
  return store.getState().records.ids.reduce<any[]>((accumulator, id) => {
    const record = store.getState().records.all[id]
    return accumulator.concat(record)
  }, [])
}

export const sortObject = (object: object): object => {
  console.log('sort object')
  console.log(object)
  const orderMap = {}
  const keys = Object.keys(object)
  keys.map((key, i) =>{
    const order = {}
    order[key] = i
    return Object.assign(orderMap, order)
  })
  let order = []
  for (let key in orderMap) {
    order.push([key, orderMap[key]])
  }
  order = order.sort((a, b) => a[1] - b[1])
  const sortedObject = {}
  order.forEach(item => sortedObject[item[0]] = item[1])
  console.log(sortedObject)
  return sortedObject
}
