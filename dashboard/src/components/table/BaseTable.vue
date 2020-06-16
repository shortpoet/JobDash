<template>
  <table class="table is-hoverable">
    <thead>
      <TableRowHeader
        :data-properties="dataProperties"
        :control-types="controlTypes"
      />
    </thead>

  <tbody>
    <tr
      v-for="item in items"
      :key="item[idSymbol]" 
      :class="`${itemType}-row has-text-centered`"
    >
    </tr>
  </tbody>
  </table>

  <!-- <teleport :to="`#delete-${itemType}-modal`" v-if="deleteContactModal.visible">
    <ModalWarning @delete-item="deleteContact" :destination="'#delete-contact-modal'"/>
  </teleport>

  <teleport :to="`#edit-${itemType}-modal`" v-if="contactCardModal.visible">
    <router-view/>
    <ContactCard @update-contacts="updateContacts" :destination="'#contact-card-modal'"/>
  </teleport> -->

  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'

import TableRowHeader from './TableRowHeader.vue'

export default defineComponent({
  name: 'BaseTable',

  props: {
    items: {
      type: Array,
      required: true
    },
    idSymbol: {
      type: String,
      required: true
    },
    itemType: {
      type: String,
      required: true
    }
  },

  components: {
    TableRowHeader
  },

  emits: ['update-contacts'],

  async setup(props, ctx){
    
    const dataProperties = computed(() => [{
      propertyName: 'testPropertyName'
    }])
    const controlTypes = computed(() => [{
      controlName: 'testControlName'
    }])



    return {
      dataProperties,
      controlTypes
    }

  }
})
</script>

