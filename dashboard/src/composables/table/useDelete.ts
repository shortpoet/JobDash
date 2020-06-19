// export function useDelete() {
//     //#region delete
//     const confirmDelete = ref(false)
//     const deleteCandidate = ref<Task>(null)
//     const destination: Destination = '#delete-task-modal'
//     const modal = useModal(destination)

//     // const modal = useModal()
//     // this didn't properly return a reactive ref
//     // const modalMap = useModalMap()
//     // const destination = '#delete-task-modal'
//     // modalMap.addModal(destination)
//     // const modal = modalMap.modalMap[destination]


//     const handleConfirmDelete = (task: Task) => {
//       if (task.locked) {
//         deleteCandidate.value = task
//         modal.showModal()
//       } else {
//         deleteCandidate.value = task
//         deleteTask()
//       }
//     }
    
//     const deleteTask = async (e?) => {
//       if (e) {
//         if (e == destination) {
//           modal.hideModal()
//           const deletedId = await taskStore.deleteRecord(deleteCandidate.value)
//           // console.log('delete task')
//           deleteCandidate.value._id == deletedId ? deleteCandidate.value = null : ''
//           // null check
//           // console.log(deleteCandidate.value)
//           ctx.emit('update-tasks')
//         }          
//       } else {
//         const deletedId = await taskStore.deleteRecord(deleteCandidate.value)
//         // console.log('delete task')
//         deleteCandidate.value._id == deletedId ? deleteCandidate.value = null : ''
//         // null check
//         // console.log(deleteCandidate.value)
//         ctx.emit('update-tasks')
//       }
//     }
    
//     const toggleDeletable = async (task: Task) => {
//       // console.log('task table')
//       // console.log(task.locked)
//       if (task.locked == false) {
//         await taskStore.toggleDeletable(task, true)
//         ctx.emit('update-tasks')
//         // console.log(task.locked)
//       } else {
//         await taskStore.toggleDeletable(task, false)
//         ctx.emit('update-tasks')
//         // console.log(task.locked)
//       }
//     }
//   //#endregion

// }