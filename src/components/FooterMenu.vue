<template>
  <ul class="footer-menu">
    <li class="footer-menu__item" @click="switchShowSearcher">
      <span class="magnifier"></span>
    </li>
    <li class="footer-menu__item">
      <span class="download"></span>
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
<style lang="scss">
@import '../assets/util.scss';
.footer-menu{
  width: 100%;
  height: $siz_footer_height;
  display: flex;
  justify-content: space-around;
  position: fixed;
  left: 0;
  bottom: 0;
  box-sizing: border-box;
  margin: 0;
  padding: 2px 0;
  background: $col_main;
  &__item{
    @extend .btn;
    width: -webkit-fill-available;
    margin: 0 2px;
  }
}
</style>
