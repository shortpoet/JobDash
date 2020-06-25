<template>
  <div :class="['base-switch-container', orientation]">
    <BaseBox v-if="boxed" class="base-switch-box">
      <div class="field is-small">          
        <label class="is-small switch-array-label"><b>{{ label }}</b></label>
        <p :class="['control', 'is-small', orientation]">
          <label
            v-for="(prop, i) in options"
            :key="i"
            :for="`base-switch-${itemType}-${type}-${i}`"
            class="base-switch label checkbox is-small"
            
          >      
            <input :id="`base-switch-${itemType}-${type}-${i}`" type="checkbox" class="is-small"  @input="handleInputChosenProperty(prop)" v-model="chosenProperties[prop]">
            {{prop}}
          </label>
          <button type="reset" class="button is-warning is-small" @click="setDefaults">Set Defaults</button>
          <button type="reset" class="button is-warning is-small" @click="handleReset">Reset</button>
        </p>
      </div>
    </BaseBox>
    <div v-else class="base-switch-box">
      <div class="field is-small">          
        <label class="is-small switch-array-label"><b>{{ label }}</b></label>
        <p :class="['control', 'is-small', orientation]">
          <label
            v-for="(prop, i) in options"
            :key="i"
            :for="`base-switch-${itemType}-${type}-${i}`"
            class="base-switch checkbox label is-small"
            
          >      
            <input :id="`base-switch-${itemType}-${type}-${i}`" type="checkbox" class="is-small"  @input="handleInputChosenProperty(prop)" v-model="chosenProperties[prop]">
            {{prop}}
          </label>
          <button type="reset" class="button is-warning is-small" @click="setDefaults">Set Defaults</button>
          <button type="reset" class="button is-warning is-small" @click="handleReset">Reset</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, watch } from 'vue'
import BaseBox from './../common/BaseBox.vue'
import { colorLog } from '../../utils'
import { useStorage } from '../../composables/useStorage'

export type Orientation = 'horizontal' | 'vertical'

export default defineComponent({
  name: 'BaseSwitchArray',
  components: {
    BaseBox,
  },
  props: {
    // options: {
    //   type: Array as () => string[]|number[],
    //   required: true
    // },
    options: {
      type: Array as () => Record<string|number, boolean>[],
      required: true
    },
    orientation: {
      type: String as () => Orientation,
      default: 'horizontal'
    },
    boxed: {
      type: Boolean,
      default: true
    },
    // so each id/for label pair is unique
    type: {
      type: String,
      default: () => Math.random().toString(16).slice(2)
    },
    // add to id so controls are more unique, might hve been causing that suspense bug
    itemType: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: false
    },

  },
  emits: ['chosen-properties'],
  setup(props, ctx) {
    // colorLog('board controls', 'yellow', 'purple')
    const chosenProperties = ref({})
    const defaults = ref()
    const storage = useStorage()

    const handleInputChosenProperty = (prop) => {
      // colorLog('handle input chosen', 'yellow', 'blue')
      // toggle value
      chosenProperties.value[prop] = !chosenProperties.value[prop]
      updateChosenProperties()
    }
    const updateChosenProperties = () => {
      // colorLog('handle input chosen', 'yellow', 'blue')
      // toggle value
      const chosenPropertyArray = []
      Object.entries(chosenProperties.value).forEach((entry, i) => {
        if (entry[1] == true)
        chosenPropertyArray.push(entry[0])
        if (entry[1] == false)
        chosenPropertyArray.splice(i)
      })
      ctx.emit('chosen-properties', {chosenProperties: chosenPropertyArray, type: props.type})
    }

    if (storage.get(`${props.itemType}-${props.type}-defaults`)) {
      // console.log(`${props.itemType}-${props.type}-defaults`);
      // console.log(storage.get(`${props.itemType}-${props.type}-defaults`))
      defaults.value = storage.get(`${props.itemType}-${props.type}-defaults`)
    }
    if (defaults.value) {
      chosenProperties.value = defaults.value
      updateChosenProperties()
    }
    // storage.get(`${props.itemType}-${props.type}-defaults`) ? defaults.value = storage.get(`${props.itemType}-${props.type}-defaults`) : defaults.value = {}


    const handleReset = () => {
      // colorLog('handle reset', 'yellow', 'blue')
      // toggle value
      const chosenPropertyArray = []
      // this line below is all that was needed to reset the checkboxes to false
      chosenProperties.value = {}
      defaults.value = {}
      storage.remove(`${props.itemType}-${props.type}-defaults`)
      Object.entries(props.options).forEach((entry, i) => {
        chosenPropertyArray.push(entry[1])
      })
      ctx.emit('chosen-properties', {chosenProperties: chosenPropertyArray, type: props.type})
    }
    const setDefaults = () => {
      // colorLog('set defaults', 'yellow', 'blue')
      // console.log(chosenProperties.value)
      defaults.value = chosenProperties.value
      storage.set(`${props.itemType}-${props.type}-defaults`, defaults.value)
    }
    return {
      chosenProperties,
      handleInputChosenProperty,
      handleReset,
      setDefaults
    }
  }
})
</script>

