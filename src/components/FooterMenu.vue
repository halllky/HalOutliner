<template>
  <ul class="footer-menu">
    <li class="footer-menu__item" @click="switchShowSearcher"></li>
  </ul>
</template>
<script>
export default {
  methods: {
    switchShowSearcher () {
      this.$emit('search');
    }
  }
}
</script>
