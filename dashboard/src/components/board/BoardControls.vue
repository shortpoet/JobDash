<template>
  <div class="board-controls-container">
    <BaseBox class="board-controls">
      <BaseInput type="text" name="Board #" @input="handleInput" v-model="activeBoard" small/>
      <!-- adding is-grouped modifier does some crazy stuff apparently negating is-pulled-right -->
      <div class="field is-small">          
        <!-- <p class="active-board-number">Active board: {{ activeBoard }}</p> -->
        <p class="control is-small">
          <!-- interestingly these render inverse to what one would expect at first but i guess its about how the node is always there or something same with v-if -->
          <button class="button is-small is-warning is-pulled-right" @click="showClear = !showClear">Show</button>
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
  emits: ['clear-storage', 'active-board'],
  setup(props, ctx) {
    const showClear = ref(false)
    const activeBoard = ref('1')
    return {
      showClear,
      activeBoard,
      clearStorage: () => localStorage.clear,
      handleInput: (event) => ctx.emit('active-board', event.target.value)
    }
  }
})
</script>

