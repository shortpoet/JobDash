<template>
  <Suspense>
    <template #default>
      <Contact />
    </template>
    <template #fallback>
      <Progress />
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import Progress from './../components/common/Progress.vue'
import Contact from './Contact.vue'
export default defineComponent({
  name: 'Home',

  components: {
    Contact,
    Progress
  }

})
</script>

<style lang="scss">
</style>
