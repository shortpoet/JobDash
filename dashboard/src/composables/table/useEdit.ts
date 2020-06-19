// export function useEdit() {
//     //#region edit
//     const nameEdit = ref() 
//     const categoryEdit = ref() 
//     const descriptionEdit = ref() 
    
//     //#region updateValues
//       const taskTouched = ref(false)
//       useUpdateValues(taskTouched, [nameEdit, descriptionEdit, categoryEdit])
//     //#endregion

//     const toggleEditable = async (oldTask: Task) => {
//       if (oldTask.editable == false) {
//         taskStore.toggleEditable(oldTask, true)
//         nameEdit.value = oldTask.name
//         categoryEdit.value = oldTask.category
//         descriptionEdit.value = oldTask.description
//       } else {
//         if (taskTouched.value == true) {
//           const newTask: Task = {
//             _id: oldTask._id,
//             itemId: oldTask._id,
//             name: nameEdit.value,
//             category: categoryEdit.value,
//             description: descriptionEdit.value,
//             contact: oldTask.contact,
//             created: oldTask.created,
//             edited: moment(),
//             editable: false,
//             locked: true
//           }
  
//           await taskStore.editRecord(
//             oldTask, 
//             newTask,
//             '_id'
//           )
//           taskTouched.value = false
//           // this closes the edit window by updating the refs after newTask editable set to false
//           ctx.emit('update-tasks')
//         } else {
//           taskStore.toggleEditable(oldTask, false)
//         }
//       }
//     }

//   //#endregion

// }