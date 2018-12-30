<template>
  <ul class="footer-menu">
    <li class="footer-menu__item" @click="switchShowSearcher">
      <span class="magnifier"></span>
    </li>
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
