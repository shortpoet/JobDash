<template>
  <label :for="name" class="label" :class="['label', small ? 'is-small' : '']">{{name}}</label>
  <div class="select">
    <select>
      <option
        v-for="(option, i) in options"
        :key="i"
        :for="`base-switch-${itemType}-${type}-${i}`"
        class="base-switch label checkbox is-small"
      >
        {{ option }}
      </option> 
    </select>
  </div>
</template>

<script lang="ts">
  import {defineComponent, computed} from 'vue'

  export default defineComponent({

    name: 'BaseSelector',

    props: {
      type: {
        type: String,
        default: 'text'
      },
      name: {
        type: String,
        requred: true
      },
      modelValue: {
        type: String,
        required: true
      },
      small: {
        type: Boolean,
        default: false
      },
      options: {
        type: Array,
        required: true
      },
      itemType: {
        type: String,
        required: true
      }
    },

    setup(props, ctx) {
      const handleInput = (event: any) => {
        // emitting special update event with modifier called modelValue updated the prop which is v-model
        ctx.emit('update:modelValue', event.target.value)
      }
      return {
        handleInput
      }

    }

  })

</script>

<style scoped>

</style>