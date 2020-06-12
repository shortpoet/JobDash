export function useStorage() {
  const set = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value))
  const get = (key:string) => JSON.parse(localStorage.getItem(key))

  return {
    set,
    get
  }
}