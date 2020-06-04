<template>
  <!--
    * watch for nested section.section
    * will start nesting relative padding (I think)
  -->
  <section class="section contact-section">
    <div class="columns">
      <div class="column is-one-half">
        <ContactTabs :tabs="tabs" @tab-activated="tabActivated" v-model="selectedTab"/>
        <component :is="selectedComponent" />

      </div>
      <div class="column is-one-half">
        <ContactTable/>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import ContactTabs from './../components/contacts/ContactTabs.vue'
import ContactCreate from './../components/contacts/ContactCreate.vue'
import ContactEdit from './../components/contacts/ContactEdit.vue'
import ContactTable from './../components/contacts/ContactTable.vue'
import { Tab } from './../interfaces/tab.interface'
export default defineComponent({
  name: 'Home',

  components: {
    ContactTabs,
    ContactCreate,
    ContactEdit,
    ContactTable
  },

  setup() {
    const tabs = ref<Tab[]>()

    tabs.value = [
      {id: 1, name: 'Create', component: 'ContactCreate'},
      {id: 2, name: 'Edit', component: 'ContactEdit'}
    ]

    const selectedTab = ref('selectedTab')
    selectedTab.value = 'ContactCreate'

    const selectedComponent = computed(() => {
      switch(selectedTab.value) {
        case 'ContactEdit':
          return ContactEdit
          break
        case 'ContactCreate':
          return ContactCreate
      }
      // return () => import(`./../components/contacts/${selectedTab.value}.vue`)
    })

    const tabActivated = (e: any) => {
      console.log('tab activated')
      console.log(e)

    }

    return {
      tabs,
      selectedTab,
      selectedComponent,
      tabActivated
    }
  }

})
</script>

<style lang="scss">
</style>
