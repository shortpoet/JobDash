import { ContactStore } from '../store/contact.store'
import { TaskStore } from '../store/task.store'
import { Task } from '../interfaces/task/task.interface'
import { Store } from '../store/store.interface'
import { MessageStore } from '../store/message.store'
import { BoardStore } from '../store/board.store'
import { IBoardColumn } from '../interfaces/board/board.column.interface'

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
  let order = []

  const orderMap = {}
  const keys = Object.keys(object)
  keys.map((key) =>{
    const order = {}
    order[key] = object[key]
    return Object.assign(orderMap, order)
  })
  for (let key in orderMap) {
    order.push([key, orderMap[key]])
  }

  // for (let key in object) {
  //   order.push([key, object[key]])
  // }

  console.log(order)
  order = order.sort((a, b) => a[1] - b[1])
  console.log(order)
  const sortedObject = {}
  order.forEach(item => sortedObject[item[0]] = item[1])
  console.log(sortedObject)
  return sortedObject
}

const flattenObject = (obj: object, sortKey: string) => {
  const out = {}
  Object.keys(obj).forEach(key => {
    out[key] = obj[key][sortKey]
  })
  return out
}

export const flattenSort = (objMap: Record<string, any>, sortKey: string): Record<string, any> => {
  const original = objMap
  const flat = flattenObject(objMap, sortKey)
  const sorted = sortObject(flat)
  const out = <Record<string, IBoardColumn>>{}
  Object.keys(sorted).forEach(key => {
    const nested = {}
    nested[key] = original[key]
    Object.assign(out, nested)
  })
  Object.entries(out).forEach(entry => {
    console.log(entry[1].category)
    console.log(entry[1].columnOrder)
  })
  return out
}