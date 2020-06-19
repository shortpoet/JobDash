<template>
  <div class="base-switch-container">
    <BaseBox class="base-switch">
      <div class="field is-small">          
        <p :class="['control', 'is-small', orientation]">
          <label
            v-for="(prop, i) in options"
            :key="i"
            :for="`display-property-${i}`"
            class="display-properties checkbox is-small"
            
          >      
            <input :id="`display-property-${i}`" type="checkbox" class="is-small"  @input="handleInputChosenProperties(prop)" v-model="chosenProperties[prop]">
            {{prop}}
          </label>
        </p>
      </div>
    </BaseBox>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, watch } from 'vue'
import BaseBox from './../common/BaseBox.vue'
import { colorLog } from '../../utils'

export type Orientation = 'horizontal' | 'vertical'

export default defineComponent({
  name: 'BaseSwitchArray',
  components: {
    BaseBox,
  },
  props: {
    options: {
      type: Array as () => string[]|number[],
      required: true
    },
    orientation: {
      type: String as () => Orientation,
      default: 'horizontal'
    }
  },
  emits: ['chosen-properties'],
  setup(props, ctx) {
    // colorLog('board controls', 'yellow', 'purple')

    const chosenProperties = ref({})

    props.options.forEach(prop => {
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
      chosenProperties,
      handleInputChosenProperties
    }
  }
})
</script>

