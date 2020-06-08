<template>
  <!--
    * watch for nested section.section
    * will start nesting relative padding (I think)
  -->
  <section class="section contact-section">
    <div class="columns">
      <div class="column is-one-half">
        <!-- <ContactTabs :tabs="tabs" @tab-activated="tabActivated" v-model="activeTab.component" :active-tab="activeTab.name"/> -->
        <!-- <ContactTabs :tabs="tabs" @tab-activated="tabActivated" v-model="activeTab" :active-tab="activeTab.name"/> -->
        <!-- <component :is="selectedComponent" /> -->
        <ContactCreate v-if="activeTab.name === 'create'" @update-contacts="onUpdateContacts"/>
        <!-- <ContactEdit v-if="activeTab.name === 'edit'" /> -->
      </div>
      <div class="column is-one-half">
        <ContactTable :contacts="allContacts" @update-contacts="onUpdateContacts"/>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import ContactTabs from './../components/contacts/ContactTabs.vue'
import ContactCreate from './../components/contacts/ContactCreate.vue'
import ContactEdit from './../components/contacts/ContactEdit.vue'
import ContactTable from './../components/contacts/ContactTable.vue'
import { Tab } from './../interfaces/tab.interface'
import  contact from '../store'
import { useContactStore, IContactStore } from '../store/contact.store'
import { Contact } from '../interfaces/contact.interface'
import { updateContacts } from '../utils'
import useContact from './../composables/useContact'

export default defineComponent({
  name: 'ContactBoard',

  components: {
    ContactTabs,
    ContactCreate,
    ContactEdit,
    ContactTable
  },

  async setup() {
    console.log('setup')


    //#region tabs
      const tabs = ref<Tab[]>()
      const activeTab = ref<Tab>()

      tabs.value = [
        {id: 1, name: 'create', component: 'ContactCreate'},
        {id: 2, name: 'edit', component: 'ContactEdit'}
      ]

      activeTab.value = tabs.value[0];

      const selectedComponent = computed(() => {
        switch(activeTab.value.component) {
          case 'ContactEdit':
            return ContactEdit
            break
          case 'ContactCreate':
            return ContactCreate
        }
        // return () => import(`./../components/contacts/${selectedTab.value}.vue`)
      })

      const tabActivated = (tab: Tab) => {
        console.log('tab activated')
        console.log(tab.id)
        // this does the same as using the update:modelValue event
        // selectedTab.value = tab.component

      }
    //#endregion
    const allContacts = ref<Contact[]>([])

    // const { onUpdateContacts, allContactsRef } = useContact(allContacts)

    const contactUse = await useContact(allContacts)

    const onUpdateContacts = contactUse.onUpdateContacts
    
    return {
      tabs,
      activeTab,
      selectedComponent,
      tabActivated,
      allContacts,
      onUpdateContacts
    }
  }


})
</script>

<style lang="scss">
</style>
