<template>
  <Suspense>
    <template #default>
      <TestTest />
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
import TestTest from './../components/contacts/TestTest.vue'
export default defineComponent({
  name: 'Home',

  components: {
    TestTest,
    Progress
  }
})
</script>

<style lang="scss">
</style>
