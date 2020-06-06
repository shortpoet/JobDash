<template>
  <Suspense>
    <template #default>
      <MainLayout />
    </template>
    <template #fallback>
      <Progress />
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import Progress from './../components/common/Progress.vue'
import MainLayout from './MainLayout.vue'
export default defineComponent({
  name: 'Home',

  components: {
    MainLayout,
    Progress
  }

})
</script>

<style lang="scss">
</style>
