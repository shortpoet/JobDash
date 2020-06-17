<template>
  <div class="field">
    <label :for="name" class="label" :class="['label', small ? 'is-small' : '']">{{name}}</label>
    <div class="control"><input
      :type="type"
      :id="readonly ? 'disabled-input' : `${name}-input`"
      :class="['input', disabled ? 'disabled-input' : '', small ? 'is-small' : '']" 
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
      },
      small: {
        type: Boolean,
        default: false
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