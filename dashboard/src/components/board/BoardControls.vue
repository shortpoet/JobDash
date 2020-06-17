<template>
  <div class="board-controls-container">
    <BaseBox class="board-controls">
      <BaseInput type="text" name="Board Type" @input="handleInputBoardType" v-model="boardType" small/>
      <BaseInput type="text" name="Board #" @input="handleInputActiveBoard" v-model="activeBoard" small/>
      <!-- adding is-grouped modifier does some crazy stuff apparently negating is-pulled-right -->
      <div class="field is-small">          
        <!-- <p class="active-board-number">Active board: {{ activeBoard }}</p> -->
        <p class="control is-small">
          <!-- interestingly these render inverse to what one would expect at first but i guess its about how the node is always there or something same with v-if -->
          <label for="reset-board" class="label is-small">Reset</label>
          <button id="reset-board" class="button is-small is-warning is-pulled-right" @click="showClear = !showClear">Show</button>
          <button v-show="showClear" class="button is-small is-warning is-pulled-right" @click="clearStorage">Clear</button>      
        </p>
      </div>
    </BaseBox>
  </div>
  <div/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BaseBox from './../common/BaseBox.vue'
import BaseInput from './../common/BaseInput.vue'

export default defineComponent({
  name: 'BoardControls',
  components: {
    BaseBox,
    BaseInput
  },
  props: {
    displayProperties: {
      type: Array,
      default: () => []
    }
  },
  emits: ['clear-storage', 'active-board', 'board-type'],
  setup(props, ctx) {
    const showClear = ref(false)
    const activeBoard = ref('1')
    const boardType = ref('Task')
    return {
      showClear,
      activeBoard,
      boardType,
      clearStorage: () => {window.localStorage.clear(); window.location.reload(true)},
      handleInputActiveBoard: (event) => ctx.emit('active-board', event.target.value),
      handleInputBoardType: (event) => ctx.emit('board-type', event.target.value)
    }
  }
})
</script>

