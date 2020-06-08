
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useContactStore, IContactStore } from '../store/contact.store'
import { Contact } from '../interfaces/contact.interface'
import { updateTasks, loadTasks } from '../utils'
import { useTaskStore, ITaskStore } from '../store/task.store'

export default async function useTask(allTasksRef) {
  console.log('use task')

  const taskStore = useTaskStore()
  allTasksRef.value = await loadTasks()

  const iTaskStore: ITaskStore = {
    taskStore: taskStore
  }

  const onUpdateTasks = async () => {
    allTasksRef.value = await updateTasks(iTaskStore)
  }

  return {
    allTasksRef,
    onUpdateTasks
  }
}
