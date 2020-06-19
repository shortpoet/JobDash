<template>
  <BaseBox class="base-table-controls-box">
    <BaseSwitchArray
      :options="columnNames"
      :boxed="false"
      :orientation="'horizontal'"
    />
    <BaseSwitchArray
      :options="controlNames"
      :boxed="false"
      :orientation="'horizontal'"
    />
  </BaseBox>
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
import BaseSwitchArray from './../common/BaseSwitchArray.vue'
import TableRowHeader from './TableRowHeader.vue'
import BaseBox from './../common/BaseBox.vue'

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
    BaseBox,
    BaseSwitchArray,
    TableRowHeader
  },

  emits: ['update-values'],

  async setup(props, ctx){
    const controlTypes =  [
      { displayName: ID, action: 'open-link' },
      { displayName: DELETE, action: 'delete' },
      { displayName: EDIT, action: 'edit' },
      { displayName: LOCKED, action: 'toggle-delete' },
      { displayName: MESSAGE, action: 'send-message' },
    ]

    const controlNames = controlTypes.map(column => column.displayName)

    const columnNames = [
      ...Object.keys(props.items[0]).concat(),
      // ...controlTypes.map(column => column.displayName)
    ]

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
    
    const dataProperties = computed((() => Object.keys(props.items[0]).filter(prop => include.includes(prop))))

    const config = new TableConfig({
      columns: [
        ID,
        ...dataProperties.value,
        DELETE,
        EDIT,
        LOCKED,
        MESSAGE
      ]
    })    

    const configRef = ref<ITableConfig>()
    configRef.value = config
    
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
      columnNames,
      controlNames,
      controlTypes,
      configRef
    }

  }
})
</script>

