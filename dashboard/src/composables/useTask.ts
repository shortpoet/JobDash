
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useContactStore, IContactStore } from '../store/contact.store.explore'
import { Contact } from '../interfaces/contact.interface'
import { updateRecords, loadRecords } from '../utils'
import { useTaskStore, ITaskStore } from '../store/task.store'

// export default async function useTask(iTaskStore, allTasksRef) {
//   console.log('use task')


//   allTasksRef.value = await loadTasks(iTaskStore)

//   const onUpdateTasks = async () => {
//     allTasksRef.value = await updateTasks(iTaskStore)
//   }

//   return {
//     allTasksRef,
//     onUpdateTasks
//   }
// }

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
