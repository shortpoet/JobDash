<template>
  <div class="had-text-centered board-column-category">{{ category }} - Order: {{ column.order }}</div>
  <div class="board-items-container">
    <div class="board-item-container"
      v-for="(item, itemIndex) in items"
      :key="itemIndex"
      draggable
      @dragstart="pickupItem($event, item)"
      @dragover.prevent
      @dragenter.prevent
      @drag.stop="moveItemOrColumn($event, items)"

    >
      <BoardItem :item="item" :item-name="category + ' - <name> id'" :item-id="item.itemId"/>
    </div>
  </div>
  <div />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

import useBoardMove from './../../composables/useBoardMove'

import BoardItem from './BoardItem.vue'

import { IBoardColumn } from '../../interfaces/board/board.column.interface'
import { Task } from '../../interfaces/task/task.interface'
import { BoardStore } from '../../store/board.store'
import { useStore } from '../../store'

export default defineComponent({
  name: 'TaskColumn',
  components: {
    BoardItem
  },
  props: {
    column: {
      type: Object as () => IBoardColumn,
      required: true
    }
  },

  emits: ['dragstart', 'draggable'],

  setup(props, ctx) {
    const category = props.column.category
    const items = props.column.items
    const boardStore: BoardStore = useStore().modules['boardStore']
    const move = useBoardMove(boardStore)

    const pickupItem = move.pickupItem
    const moveItemOrColumn = move.moveItemOrColumn

    return {
      items,
      category,
      pickupItem,
      moveItemOrColumn
    }
  }
})
</script>