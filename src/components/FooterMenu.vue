<template>
  <ul class="footer-menu">
    <li class="footer-menu__item" @click="switchShowSearcher">
      <span class="magnifier"></span>
    </li>
    <li class="footer-menu__item" @click="download">
      <span class="download"></span>
    </li>
    <li class="footer-menu__item" @click="openUploader">
      <span class="upload"></span>
    </li>
  </ul>
</template>
<script>
export default {
  methods: {
    switchShowSearcher () {
      this.$emit('search');
    },
    download () {
      this.$emit('download');
    },
    openUploader () {
      this.$emit('upload-start');
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
}.upload {
  color: $col_main;
  position: absolute;
  margin-left: 0px;
  margin-top: 6px;
  width: 13px;
  height: 4px;
  border: solid 2px currentColor;
  border-top: none;
  border-radius: 2px;
}
.upload:before {
  content: '';
  position: absolute;
  top: -8px;
  left: 6px;
  width: 2px;
  height: 9px;
  background-color: currentColor;
}
.upload:after {
  content: '';
  position: absolute;
  top: -8px;
  left: 4px;
  width: 4px;
  height: 4px;
  border-top: solid 2px currentColor;
  border-right: solid 2px currentColor;
  -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
}
</style>
