<template>
  <!--
    * watch for nested section.section
    * will start nesting relative padding (I think)
  -->
  <section class="section tabs-section">
    <BaseBox>
      <BaseTabs :tabs="tabs" @tab-activated="tabActivated" :active-tab="activeTab.name"/>
      <!-- <component :is="selectedComponent" @update-contacts="onUpdateContacts"/> -->
      <ContactCreate v-if="activeTab.name == 'Contact'" @update-contacts="onUpdateContacts"/>
      <TaskCreate v-if="activeTab.name == 'Task'" @update-tasks="onUpdateTasks"/>
    </BaseBox>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import BaseTabs from './../components/common/BaseTabs.vue'

import BaseBox from './../components/common/BaseBox.vue'

import ContactCreate from './../components/contacts/ContactCreate.vue'
import TaskCreate from './../components/task/TaskCreate.vue'

import { Tab } from './../interfaces/tab.interface'

export default defineComponent({
  name: 'CreateLayout',

  components: {
    BaseTabs,
    BaseBox,
    ContactCreate,
    TaskCreate,
  },

  emits: ['update-contacts', 'update-tasks'],

  async setup(props, ctx) {


    //#region tabs
      const tabs = ref<Tab[]>()
      const activeTab = ref<Tab>()

      tabs.value = [
        {id: 1, name: 'Contact', component: 'ContactCreate'},
        {id: 2, name: 'Task', component: 'TaskCreate'}
      ]

      activeTab.value = tabs.value[0];

      const selectedComponent = computed(() => {
        // console.log('selected component')
        // console.log(activeTab.value.component)
        switch(activeTab.value.component) {
          case 'TaskCreate':
            return TaskCreate
            break
          case 'ContactCreate':
            return ContactCreate
        }
      })

      const tabActivated = (tab: Tab) => {
        console.log('tab activated')
        console.log(tab.id)
        // this does the same as using the update:modelValue event
        // not this same in this case because it ends up only changing once or you update the name of the tab
        activeTab.value = tab
        // ctx.emit('tab-change', tab.name)
      }
    //#endregion

      const onUpdateContacts = () => {
        console.log('update contacts from create layout')
        ctx.emit('update-contacts')
      }
      const onUpdateTasks = () => {
        ctx.emit('update-tasks')
      }


    return {
      tabs,
      activeTab,
      selectedComponent,
      tabActivated,
      onUpdateContacts,
      onUpdateTasks
    }
  }


})
</script>

<style lang="scss">
</style>
