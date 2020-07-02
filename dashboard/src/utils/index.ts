import { IBoardColumn } from '../interfaces/board/board.column.interface'

// using store interface eliminates vue warn about using inject outside of setup function


// https://stackoverflow.com/questions/1069666/sorting-object-property-by-values
export const sortObject = (object: object): object => {
  // console.log('sort object')
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
  order = order.sort((a, b) => a[1] - b[1])
  const sortedObject = {}
  order.forEach(item => sortedObject[item[0]] = item[1])
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
  // Object.entries(out).forEach(entry => {
  //   // console.log(entry[1].category)
  //   // console.log(entry[1].columnOrder)
  // })
  return out
}

export const colorLog = (message, color = 'magenta', background = 'yellow') => {
  color = color || "black";
  if (background) {
    console.log(`%c` + `${message}`, `color:` + `${color};background:${background}`)
  } else {
    console.log(`%c` + `${message}`, `color:` + `${color}`)
  }
}
export function uuid () {
  return Math.random().toString(16).slice(2)
}

// colorLog('message', 'blue', 'pink')
// colorLog('message', 'yellow', 'green')