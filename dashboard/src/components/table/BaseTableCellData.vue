<template>
  <td v-if="props.editable" contenteditable>
    <BaseInput type="text" :name="props.propertyName" @input="handleInput" v-model="propertyEdit" />
      {{ propertyEdit }}
  </td>
  <td v-else>{{ props.propertyData[props.propertyName] }}</td>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import BaseInput from './../../components/common/BaseInput.vue'

export default defineComponent({
  name: 'BaseTableCellData',

  components: {
    BaseInput
  },

  props: {
    props: {
      type: Object,
      required: true
    },
    // propertyData: {
    //   type: Object,
    //   required: true
    // },
    // propertyName: {
    //   type: String,
    //   required: true
    // },
    // editable: {
    //   type: Boolean,
    //   default: false
    // }
  },

  setup(props, ctx){
    // console.log(props['propertyData'])
    // const propName = props['propertyName']
    // console.log(props['propertyData'][propName])
    // console.log(props['propertyData'][props['propertyName']])
    const propertyEdit = ref()
    const handleInput = () => {
      ctx.emit('handle-input')
    }
    return {
      propertyEdit,
      handleInput
    }

  }
})
</script>
