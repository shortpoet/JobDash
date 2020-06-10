
import { updateRecords, loadRecords } from '../utils'

export default async function useTask(taskStore, allTasksRef) {
  console.log('use task')

  allTasksRef.value = await loadRecords(taskStore, 'tasks')

  const onUpdateTasks = async () => {
    console.log('use task - update')
    const newValue = await updateRecords(taskStore,'contacts')
    allTasksRef.value = newValue
  }

  // const onUpdateTasks = async () => {
  //   allTasksRef.value = await updateRecords(taskStore, 'tasks')
  // }

  return {
    allTasksRef,
    onUpdateTasks
  }
}
