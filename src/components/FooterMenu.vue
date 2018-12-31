<template>
  <ul class="footer-menu">
    <li class="footer-menu__item" @click="switchShowSearcher">
      <span class="magnifier"></span>
    </li>
    <li class="footer-menu__item" @click="download">
      <span class="download"></span>
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
/* https://cssicon.space/#/ */
.magnifier {
  color: $col_main;
  position: absolute;
  margin-top: 1px;
  margin-left: 2px;
  width: 12px;
  height: 12px;
  border: solid 2px currentColor;
  border-radius: 100%;
  -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
}
.magnifier:before {
  content: '';
  position: absolute;
  top: 12px;
  left: 5px;
  height: 8px;
  width: 2px;
  background-color: currentColor;
}
.download {
  color: $col_main;
  position: absolute;
  margin-left: 0px;
  margin-top: 6px;
  width: 13px;
  height: 4px;
  border-radius: 2px;
  border: solid 2px currentColor;
  border-top: none;
}
.download:before {
  content: '';
  position: absolute;
  left: 6px;
  top: -9px;
  width: 2px;
  height: 10px;
  background-color: currentColor;
}
.download:after {
  content: '';
  position: absolute;
  left: 4px;
  top: -4px;
  width: 4px;
  height: 4px;
  border-top: solid 2px currentColor;
  border-right: solid 2px currentColor;
  -webkit-transform: rotate(135deg);
          transform: rotate(135deg);
}
</style>
