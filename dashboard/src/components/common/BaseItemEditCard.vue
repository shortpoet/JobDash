<template>
  <div class="card contact-card form-container" v-if="loaded">
    <div class="contact-card-header">
      <h5 class="form-heading">Contact</h5>
      <button class="delete is-pulled-right" @click="handleModalClose"></button>
    </div>
    <hr class="form-hr"/>
    <form action="submit" @submit.prevent="submit">
      <!-- <BaseInput type="text" name="Id" :readonly="true" v-model="contactEdit._id" /> -->
      <BaseInput
        v-for="(ref, i) in refArray"
        :key="i"
        type="text"
        :name="editableColumns[i]"
        v-model="refArray[i].value"
      />
      <button class="button is-success">Save</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onUpdated } from 'vue'
import moment from 'moment'

import { useRouter } from 'vue-router'
import { useStore } from './../../store'
import { ContactStore } from '../../store/contact.store'

import BaseInput from './../../components/common/BaseInput.vue'
import MessageWriter from './../../components/common/MessageWriter.vue'

import { Contact } from '../../interfaces/contact/contact.interface'

import useContact from '../../composables/useContact'
import { useModal } from '../../composables/useModal'
import { useUpdateValues } from '../../composables/useUpdateValues'
import { useInitEdit } from '../../composables/table/useInitEdit'
import { colorLog } from '../../utils'

export default defineComponent({
  name: 'BaseItemEditCard',

  props: {
    destination: {
      type: String,
      required: true
    },
    itemType: {
      type: String,
      required: true
    },
    editableColumns: {
      type: Array as () => string[],
      required: true
    }
  },

  components: {
    BaseInput,
    MessageWriter
  },

  emits: ['update-values'],

  async setup(props, ctx){
    
    //#region modal
      const modal = useModal(props.destination)

      const cardIsOpen = computed(() => {
        const open = router.currentRoute.value.name === props.destination
        console.log('card is open')
        console.log(open)
        return open
      })

    //#endregion

    if (cardIsOpen) {
      modal.showModal()
    }

    //#region initValues
      const router = useRouter()

      const id = ref()
      const item = ref()

      const itemEdit = ref()
      const loaded = ref(false)

      const handleModalClose = () => {modal.hideModal(); router.push('/');}

      // const { properties, refArray, itemTouched } = useInitEdit(props.editableColumns)

      // unintialize this value and see what happens XD
      // lesson: init your values!!
      // in this case an empty array wasn't enough... 
      // need an array of empty strings of lenght of editable cols
      // then wasn't reactive
      // needed to be wrapped in ref 
      let refArray = ref(props.editableColumns.map(prop => ref('')))
      let itemTouched

      // params not available w/o timeout
      setTimeout(() => {
        const params = router.currentRoute.value.params
        item.value = JSON.parse(params['item'].toString())
        const values = props.editableColumns.map(prop => item.value[prop])
        const edit = useInitEdit(values)
        itemTouched = edit.itemTouched
        refArray.value = edit.refArray
        useUpdateValues(itemTouched, [...refArray.value])
        loaded.value = true
      }, .1)
      // itemEdit.value = {...item.value}
    
    //#region updateValues

      const submit = async function(e: any) {
        console.log('submit')
        console.log(itemTouched.value)
        if (itemTouched.value == true) {

          // contactEdit.value.name = nameEdit.value
          // contactEdit.value.company = companyEdit.value
          // contactEdit.value.email = emailEdit.value
          // await contactStore.editRecord(
          //   contact.value, 
          //   contactEdit.value,
          //   '_id'
          // )
          itemTouched.value = false
          // ctx.emit('update-values')
        }
        handleModalClose()
      }
    //#endregion

    return {
      refArray,
      // properties,
      submit,
      modal,
      loaded,
      cardIsOpen,
      handleModalClose
    }

  }

})
</script>

<style lang="scss">
</style>
