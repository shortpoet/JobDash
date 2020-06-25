<template>
  <div class="had-text-centered board-column-category">{{ category }} - Order: {{ column.columnOrder }}</div>
  <div class="board-items-container">
    <div class="board-item-container"
      v-for="(item, itemIndex) in items"
      :key="itemIndex"
      draggable
      @dragstart="pickupItem($event, item)"
      @dragover.prevent
      @dragenter.prevent
      @drop="moveItemOrColumn($event, column, item)"
      @update-board="onUpdateBoard"
    >
      <BoardItem
        :item="item"
        :item-name="`${category} - order: ${item.itemOrder}`"
        :item-id="item.itemId"
        :display-properties="displayProperties"
      />
    </div>
  </div>
  <div />
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'

import useBoardMove from './../../composables/board/useBoardMove'

import BoardItem from './BoardItem.vue'

import { IBoardColumn } from '../../interfaces/board/board.column.interface'
import { Task } from '../../interfaces/task/task.interface'
import { BoardStore } from '../../store/board.store'
import { useStore } from '../../store'

export default defineComponent({
  name: 'BoardColumn',
  components: {
    BoardItem
  },
  props: {
    column: {
      type: Object as () => IBoardColumn,
      required: true
    },
    displayProperties: {
      type: Array,
      required: true
    }
  },

  emits: ['dragstart', 'draggable', 'update-board', 'board-move'],

  setup(props, ctx) {
    const category = props.column.category
    const items = props.column.items
    const boardStore: BoardStore = useStore().modules['boardStore']
    const move = useBoardMove(boardStore, ctx)
    const onBoardMove = () => ctx.emit('board-move')

    const pickupItem = move.pickupItem
    const moveItemOrColumn = move.moveItemOrColumn

    return {
      items,
      category,
      pickupItem,
      moveItemOrColumn,
      onBoardMove
    }
  }
})
</script>
