<template>
  <div class="field">
    <label :for="name" class="label">{{name}}</label>
    <div class="control"><input
      :type="type"
      :id="readonly ? 'disabled-input' : ''"
      :class="['input', disabled ? 'disabled-input' : '']" 
      @input="handleInput"
      :value="modelValue"
      :disabled="disabled"
      :placeholder="placeholder"
      :readonly="readonly"
    ></div>
    <p class="help is-danger" v-if="error">{{ error }}</p>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue'

  export default defineComponent({

    name: 'BaseInput',

    props: {
      // optional validation
      error: {
        type: String
      },
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
      disabled: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: 'Placeholder'
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