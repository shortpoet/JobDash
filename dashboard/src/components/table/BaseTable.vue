<template>
  <table class="table is-hoverable">
    <thead>
      <TableRowHeader
        :columns="configRef.columns"
        :data-properties="chosenProperties"
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
import { ITableConfig, BaseTableConfig, ID, DELETE, EDIT, LOCKED, MESSAGE, TableConfig } from './../../interfaces/table/table.column.interface'

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

  emits: ['update-values'],

  async setup(props, ctx){
    const include = [
      // "_id",
      // "itemId",
      "name",
      "category",
      "description",
      "contact",
      // "created",
      // "edited",
      // "editable",
      // "locked",
      // "__v"
    ]
    
    const dataProperties = Object.keys(props.items[0]).filter(prop => include.includes(prop))
    const config = new TableConfig({
      columns: [
        ID,
        ...dataProperties,
        DELETE,
        EDIT,
        LOCKED,
        MESSAGE
      ]
    })    
    console.log(config)

    const controlTypes = computed(() => [
      { displayName: 'Id', action: 'open-link' },
      { displayName: 'Delete', action: 'delete' },
      { displayName: 'Edit', action: 'edit' },
      { displayName: 'Locked', action: 'toggle-delete' },
      { displayName: 'Message', action: 'send-message' },

    ])
    const configRef = ref<ITableConfig>()
    configRef.value = config
    console.log(configRef.value)
    const chosenProperties = ref([
      // "_id",
      // "itemId",
      "name",
      "category",
      "description",
      "contact",
      // "created",
      // "edited",
      // "editable",
      // "locked",
      // "__v"
    ])
    const displayProperties = computed(() => chosenProperties.value)
    const handleChosenPropertyChange = (e) => {
      // colorLog("on chosen prop change", "orange", "purple")
      chosenProperties.value = e
    }

    return {
      chosenProperties,
      controlTypes,
      configRef
    }

  }
})
</script>

