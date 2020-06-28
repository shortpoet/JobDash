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
          <label
            v-for="(prop, i) in displayProperties"
            :key="i"
            :for="`display-property-${i}`"
            class="display-properties label checkbox is-small"
            
          >      
            <input :id="`display-property-${i}`" type="checkbox" class="is-small"  @input="handleInputChosenProperties(prop)" v-model="chosenProperties[prop]">
            {{prop}}
          </label>
          <!-- <button id="reset-board" class="button is-small is-warning is-pulled-right" @click="showClear = !showClear">Show</button> -->
        </p>
      </div>
    </BaseBox>
  </div>
  <div/>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, watch } from 'vue'
import BaseBox from './../common/BaseBox.vue'
import BaseInput from './../common/BaseInput.vue'
import { colorLog } from '../../utils'

export default defineComponent({
  name: 'BoardControls',
  components: {
    BaseBox,
    BaseInput
  },
  props: {
    displayProperties: {
      type: Array as () => string[],
      required: true
    }
  },
  emits: ['clear-storage', 'active-board', 'board-type', 'chosen-properties'],
  setup(props, ctx) {
    // colorLog('board controls', 'yellow', 'purple')

    const showClear = ref(false)
    const activeBoard = ref('1')
    const boardType = ref('Task')
    const chosenProperties = ref({})

    props.displayProperties.forEach(prop => {
      const dict = {}
      dict[prop] = false
      Object.assign(chosenProperties.value, dict)
    })
    const handleInputChosenProperties = (prop) => {
      // colorLog('handle input chosen', 'yellow', 'blue')
      // toggle value
      chosenProperties.value[prop] = !chosenProperties.value[prop]
      const chosenPropertyArray = []
      Object.entries(chosenProperties.value).forEach((entry, i) => {
        if (entry[1] == true)
        chosenPropertyArray.push(entry[0])
        if (entry[1] == false)
        chosenPropertyArray.splice(i)
      })
      ctx.emit('chosen-properties', chosenPropertyArray)
    }
    // a weird watch is obvious sign of probably needing to look things differently
    // maybe even WALK AWAY XD
    // Object.keys(chosenProperties.value).forEach((property) => {
    //   watch(
    //     () => chosenProperties[property].value,
    //     (value, previous) => {
    //       console.log('watch')
    //       console.log(value)
    //       console.log(previous)
    //     },
    //     {immediate: true}
    //   )
    // })

    return {
      showClear,
      activeBoard,
      boardType,
      chosenProperties,
      clearStorage: () => {window.localStorage.clear(); window.location.reload(true)},
      handleInputActiveBoard: (event) => ctx.emit('active-board', event.target.value),
      handleInputBoardType: (event) => ctx.emit('board-type', event.target.value),
      handleInputChosenProperties
    }
  }
})
</script>

