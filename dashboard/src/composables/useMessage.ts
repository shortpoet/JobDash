
import { updateRecords, loadRecords } from '../utils'

export default async function useMessage(messageStore, allMessagesRef) {
  // console.log('use message')

  allMessagesRef.value = await loadRecords(messageStore, 'messages')

  const onUpdateMessages = async () => {
    // console.log('use message - update')
    const newValue = await updateRecords(messageStore, 'message')
    allMessagesRef.value = newValue
  }

  // const onUpdateMessages = async () => {
  //   allMessagesRef.value = await updateRecords(messageStore, 'messages')
  // }

  return {
    allMessagesRef,
    onUpdateMessages
  }
}
