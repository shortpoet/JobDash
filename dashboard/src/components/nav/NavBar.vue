<template>
  <nav class="navbar">
    <div class="navbar-end">
      <router-link class="button" to="/contacts/new">New Contact</router-link>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NavBar',
  components: {
    
  },
  setup() {
    return {
    }
  }
})
</script>