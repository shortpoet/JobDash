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
        :name="properties[i]"
        v-model="refArray[i].value"
      />
      <button class="button is-success">Save</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
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
      type: Array,
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

    // console.log('init contact card')
    if (cardIsOpen) {
      modal.showModal()
    }

    //#region initValues
      // const store = useStore()
      const router = useRouter()
      // const itemStore: ContactStore = store.modules['contactStore']

      const id = ref()
      const item = ref()

      const itemEdit = ref()
      const loaded = ref(false)

      const handleModalClose = () => {modal.hideModal(); router.push('/')}

      const { properties, refArray, itemTouched } = useInitEdit(props.editableColumns)

      // params not available w/o timeout
      setTimeout(() => {
        const params = router.currentRoute.value.params
        item.value = JSON.parse(params['item'].toString())
        props.editableColumns.forEach(() => {})
        console.log(properties)
        console.log(item)
        refArray.forEach((ref, i) => ref.value = item.value[properties[i]])
        console.log(refArray)
        itemEdit.value = {...item.value}
        loaded.value = true
      }, .1)
    
    //#region updateValues
      // useUpdateValues(itemTouched, [...refArray])

      const submit = async function(e: any) {
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
          ctx.emit('update-values')
        }
        handleModalClose()
      }
    //#endregion

    return {
      refArray,
      properties,
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
