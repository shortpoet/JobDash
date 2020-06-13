<template>
  <div class="board-item">
    <span @click="openCard" class="board-item-text">
      {{itemName}}: {{ itemId }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Task } from '../../interfaces/task.interface'
import { Destination } from '../../interfaces/modal.interface'
import { useModal } from '../../composables/useModal'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'BoardItem',
  props: {
    item: {
      type: Object as () => Task,
      required: true
    },
    // making these props makes them reactive to edit
    itemName: {
      type: String,
      required: true
    },
    itemId: {
      type: String,
      required: true
    },
  },
  setup(props, ctx) {
    const task = ref<Task>(props.item)
    // console.log(task.value)

    //#region taskCardModal

      const taskCardDestination: Destination = '#task-card-modal'

      const taskCardModal = useModal(taskCardDestination)

    //#endregion
    
    //#region openCard
      const router = useRouter()
      const openCard = () => {
        console.log('task cell open card')
        taskCardModal.showModal()
        router.push({ name: '#task-card-modal', params: { id: props.itemId } })
      }
    //#endregion

    return {
      task,
      openCard
    }
  }
})
</script>
