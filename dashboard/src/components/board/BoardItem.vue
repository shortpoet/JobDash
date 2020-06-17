<template>
  <div class="board-item">
    <span @click="openCard" class="board-item-text">
      {{itemName}}: {{ itemId }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import { useModal } from '../../composables/useModal'
import { useRouter } from 'vue-router'

import { Destination } from '../../interfaces/common/modal.interface'
import { IBoardItem } from '../../interfaces/board/board.item.interface'

export default defineComponent({
  name: 'BoardItem',
  props: {
    item: {
      type: Object as () => IBoardItem,
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
    displayProperties: {
      type: Array,
      required: true
    }
  },
  setup(props, ctx) {
    // const item = ref<IBoardItem>(props.item)
    // console.log(task.value)

    //#region taskCardModal

      const taskCardDestination: Destination = '#task-card-modal'

      const taskCardModal = useModal(taskCardDestination)

    //#endregion
    
    //#region openCard
      const router = useRouter()
      const openCard = () => {
        // console.log('task cell open card')
        taskCardModal.showModal()
        router.push({ name: '#task-card-modal', params: { id: props.itemId } })
      }
    //#endregion

    return {
      openCard
    }
  }
})
</script>
