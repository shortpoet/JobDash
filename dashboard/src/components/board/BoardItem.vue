<template>
  <div class="board-item">
    <BaseIcon class="task-link-icon" @click="openCard" name="external-link" color="purple">{{}}</BaseIcon>

    <!-- <div class="board-item-text-column">
      <div class="board-item-category-key">
        itemName
      </div>
      <div class="board-item-text">
      {{itemName}}
      </div>
    </div>

    <div class="board-item-text-column">
      <div class="board-item-category-key">
        itemId
      </div>
      <div class="board-item-text">
      {{itemId}}
      </div>
    </div> -->

    <div
      class="board-item-text-column"
      v-for="(prop, i) in displayComputed"
      :key="i"
    >
      <div class="board-item-category-key">
        {{prop}}
      </div>
      <div class="board-item-text">
      {{item.item[prop]}}
      </div>
    </div>


  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'

import { useModal } from '../../composables/useModal'
import { useRouter } from 'vue-router'

import { Destination } from '../../interfaces/common/modal.interface'
import { IBoardItem } from '../../interfaces/board/board.item.interface'

import BaseIcon from './../../components/common/BaseIcon.vue'

export default defineComponent({
  name: 'BoardItem',
  components: {
    BaseIcon
  },
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
    console.log('board item')
    const properties = ref([])
    properties.value = Object.keys(props.item.item)
    // const displayComputed = computed(() => properties.value.filter((_, i) => props.displayProperties.includes(i.toString())))
    const displayComputed = computed(() => properties.value.filter((prop, i) => props.displayProperties.includes(prop.toString())))

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
      openCard,
      displayComputed
    }
  }
})
</script>
