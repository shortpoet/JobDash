<template>
  <Suspense>
    <template #default>
      <div class="columns">
        <div class="column is-one-half">
          <ContactEntry />
        </div>
        <div class="column is-one-half">
          <ContactDisplay/>
        </div>
      </div>
    </template>
    <template #fallback>
      <div class="columns">
        <div class="column is-one-third"/>
        <div class="column is-one-third">
          <Progress />
        </div>
        <div class="column is-one-third"/>
      </div>
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import Progress from './../components/common/Progress.vue'
import ContactEntry from './../components/contacts/ContactEntry.vue'
import ContactDisplay from './../components/contacts/ContactDisplay.vue'

export default defineComponent({
  name: 'Home',

  components: {
    ContactEntry,
    ContactDisplay,
    Progress
  }

})
</script>

<style lang="scss">
</style>
