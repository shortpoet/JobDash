<template>
  <div class="form-container base-item-create">
    <h5 class="form-heading">{{ itemType }}</h5>
    <hr class="form-hr"/>
    <form action="submit" @submit.prevent="submit">
      <!-- <BaseInput type="text" name="Id" :readonly="true" v-model="contactEdit._id" /> -->
      <BaseInput
        v-for="(ref, i) in refArray"
        :key="`${itemType}-${i}`"
        type="text"
        :name="editableColumns[i]"
        v-model="refArray[i].value"
      />
      <button class="button is-success">Create</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import moment from 'moment'

import { ContactStore } from './../../store/contact.store'

import BaseInput from './../../components/common/BaseInput.vue'

import { IContact } from '../../interfaces/contact/contact.interface'

import { useStore } from './../../store'
import { useInitEdit } from '../../composables/table/useInitEdit'
import { useUpdateValues } from '../../composables/useUpdateValues'
import { uuid } from '../../utils'


export default defineComponent({
  name: 'BaseItemCreate',

  components: {
    BaseInput
  },

  props: {
    editableColumns: {
      type: Array as () => string[],
      required: true
    },
    itemType: {
      type: String,
      required: true
    },
    idSymbol: {
      type: String,
      required: true
    }
  },

  emits: ['create-item'],

  async setup(props, ctx){
    // when this was a ref instead of computed it wasn't exactly reactive
    // extra fields weren't being deleted or initialized depending on which
    // type had more coming in/out of selection
    let refArray = computed(() => props.editableColumns.map(col => ref(col)))
    const values = props.editableColumns.map(prop => prop)
    const edit = useInitEdit(values)
    const itemTouched = edit.itemTouched
    useUpdateValues(itemTouched, [...refArray.value])

    const submit = async function(e: any) {
      const item = {}
      if (itemTouched.value == true) {
        props.editableColumns.forEach((col, i) => {
          item[col] = refArray.value[i].value
        })
        item[props.idSymbol] = uuid()
        item['created'] = moment(),
        item['edited'] = moment(),
        item['editable'] = true,
        item['locked'] = true,
        ctx.emit('create-item', {item: item, itemType: props.itemType})
      }
    }

    const updateTable = () => {
    }

    return{
      refArray,
      submit
    }

  }

})
</script>

<style lang="scss">
</style>
