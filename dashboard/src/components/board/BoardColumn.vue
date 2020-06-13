<template>
  <div class="had-text-centered board-column-category">{{ category }} - Order: {{ column.order }}</div>
  <div class="board-items-container">
    <div class="board-item-container"
      v-for="(item, itemIndex) in items"
      :key="itemIndex"
      draggable
      @dragstart="pickupTask($event, item)"
      @drag.stop="moveTaskOrColumn($event, items)"
    >
      <BoardItem :item="item" :item-name="category + ' - ' + item.itemId" :item-id="item.itemId"/>
    </div>
  </div>
  <div />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

import BoardItem from './BoardItem.vue'

import { IBoardColumn } from '../../interfaces/board/board.column.interface'
import { Task } from '../../interfaces/task/task.interface'

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

    return {
      items,
      category
    }
  }
})
</script>
