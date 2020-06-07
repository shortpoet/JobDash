<template>
  <div class="task-board container">
    <div class="columns is-centered">
      <div class="column has-text-centered" v-for="column in columns" :key="column.id">
        {{ column.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TaskBoard',
  setup() {
    return {
      columns: [
        {id:'1', name: 'Column 1'},
        {id:'2', name: 'Column 2'},
        {id:'3', name: 'Column 3'},
      ]
    }
  }
})
</script>

<style scoped>

</style>