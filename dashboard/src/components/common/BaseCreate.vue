<template>
  <div class="form-container">
    <h5 class="form-heading">{{ cItemType }}</h5>
    <hr class="form-hr"/>
    <form action="submit" @submit.prevent="submit">
      <BaseInput
        v-for="(ref, i) in refArray"
        :key="i"
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

import { useStore } from '../../store'
import { TableStoreLocal } from './../../store/table.store'

import BaseInput from './../../components/common/BaseInput.vue'

import { TableItem } from '../../interfaces/table/table.item.interface'
import { useUpdateValues } from '../../composables/useUpdateValues'

export default defineComponent({
  name: 'BaseCreate',

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
    } 
  },

  emits: ['item-create'],

  setup(props, ctx){

    let refArray = ref(props.editableColumns.map(prop => ref(prop)))
    let itemTouched = ref(false)
    useUpdateValues(itemTouched, [...refArray.value])
    const itemEdit = ref({})
    props.editableColumns.forEach(col => {
      const dict = {}
      dict[col] = col
      Object.assign(itemEdit.value, dict)
    })
    const cItemType = computed(() => props.itemType.charAt(0).toUpperCase() + props.itemType.slice(1))
    const submit = function(e: any) {
      console.log('submit')
      console.log(itemTouched.value)
      if (itemTouched.value == true) {
        props.editableColumns.forEach((col, i) => itemEdit.value[col] = refArray.value[i].value)
        itemTouched.value = false
        ctx.emit('item-create', {item: itemEdit.value, itemType: props.itemType})
      }
    }

    // from main layout in refactor
    //#region create section
      // const editableColumns = ref([
      //   // 'id',
      //   'Name',
      //   'Category'
      // ])
      // const handleItemCreate = (e) => {
      //   // tableStore.createRecord(e.item)
      //   // tables[0].value.items = tableStore.getRecordsFromStore()
      //   // testItems.value = tableStore.getRecordsFromStore()
      // }
    //#endregion

    //#region edit
      // const editItemDestination: Destination = '#edit-item-modal'
      // const itemEditModal = useModal(editItemDestination)
      // const modalConfirmEdit = (e) => {
      //   console.log(e)
      // }
      // const router = useRouter()

      // const handleEditModal = (item) => {
      //   colorLog('handle edit modal at table row body', 'blue', 'green')
      //   console.log(item)
      //   itemEditModal.showModal()
      //   console.log(item[ITEMS_ID_SYMBOL])
      //   router.push({
      //     name: editItemDestination,
      //     path: `/${testItemType.value}/${item[ITEMS_ID_SYMBOL]}`,
      //     params: { id: item[ITEMS_ID_SYMBOL], item: JSON.stringify(item) } 
      //   })
      // }
    //#endregion


    return{
      cItemType,
      refArray,
      submit,
      // // create
      // editableColumns,
      // handleItemCreate,
      // // edit
      // itemEditModal,
      // handleEditModal,
      // editItemDestination,

    }

  }

})
</script>

<style lang="scss">
</style>
