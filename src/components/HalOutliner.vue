<template>
  <div>
    <memo-root
      ref="memoRootItem"
      :search-condition="searchCondition"/>
    <footer-menu
      style="z-index: 30;"
      @search="showSearcher = !showSearcher"/>
    <transition name="transition-up">
      <searcher v-if="showSearcher" @search="search" style="z-index: 20;"/>
    </transition>
    <transition name="transition-fade">
      <div v-if="showSearcher" class="smoke" style="z-index: 10;"></div>
    </transition>
  </div>
</template>
<script>
import MemoRoot from './MemoRoot.vue';
import FooterMenu from './FooterMenu.vue';
import Searcher from './Searcher';
export default {
  components: { MemoRoot, FooterMenu, Searcher },
  data () {
    return {
      showSearcher: false,
      searchCondition: null
    }
  },
  methods: {
    search (condition) {
      this.$set(this, 'searchCondition', condition);
      window.setTimeout(this.$refs.memoRootItem.delayResize, 10);
    }
  }
}
</script>
<style lang="scss">
$siz_space: 6px;
$siz_radius: 4px;
$siz_footer_height: 3em;
$col_base: rgb(247, 236, 223);
$col_main: rgb(253, 252, 249);
$col_accent: rgb(196, 176, 150);
$col_font: rgb(13, 80, 134);
$col_font_strike: rgb(209, 209, 209);
$col_subfont: gray;
$col_dangerous: rgb(233, 120, 120);
$col_todo: rgb(236, 178, 17);
$col_todo_back: #fff7c6;
.book{
  max-width: 50em;
  background: $col_base;
  border-radius: $siz_radius;
  box-sizing: border-box;
  padding: $siz_space;
  margin-bottom: 50vh;
  margin-left: auto;
  margin-right: auto;
}
.title{
  outline: none;
  border: none;
  font-size: 18px;
  min-height: 1.4em;
  border-bottom: 1px solid $col_accent;
  background: transparent;
}
.memo{
  position: relative;
  background: $col_main;
  border-radius: $siz_radius;
  box-sizing: border-box;
  padding: $siz_space;
  &__header{
    display: flex;
    justify-content: flex-end;
    &_outbody{
      @extend .memo__header;
      position: relative;
    }
    &_inbody{
      @extend .memo__header;
      position: absolute;
      right: $siz_space;
    }
  }
  &__header :not(:first-child){
    margin-left: $siz_space;
  }
  &__body{
    line-height: 0;
  }
  &__children{
    margin: auto;
    padding-left: 1.5em;
  }
  &__child{
    list-style-type: none;
    width: 100%;
    box-sizing: border-box;
    margin-top: $siz_space;
  }
  &__timestamp{
    right: 0;
    color: $col_subfont;
    font-size: 10px;
    cursor: default;
    user-select: none;
  }
  &__txt{
    @extend .txt;
    resize: none;
    padding: 0;
    width: 100%;
    height: 1em;
    min-height: 1em;
    font-size: 14px;
    background: transparent;
    font-weight: 500;
    line-height: 16px;
    &_strike{
      color: $col_font_strike;
      text-decoration-line: line-through;
    }
  }
  &__img{
    max-width: 90%;
  }
}
.btn{
  display: inline-block;
  min-width: 20px;
  min-height: 20px;
  background: $col_accent;
  color: $col_main;
  border-radius: $siz_radius;
  text-align: center;
  user-select: none;
  cursor: default;
  &:active{
    background: darken($col_accent, 10%);
    transform: translateY(1px);
  }
  &__delete_image{
    @extend .btn;
    position: relative;
    vertical-align: top;
    background: $col_dangerous;
    &:active{
      background: darken($col_dangerous, 10%);
    }
  }
}
.icon{
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  user-select: none;
  cursor: default;
  background: $col_accent;
  color: $col_main;
  text-align: center;
  &__todo{
    @extend .icon;
    background: $col_todo;
    position: absolute;
    top: -0.2em;
    left: -1.2em;
  }
}
.todo{
  background: $col_todo_back;
}
.done{
  color: $col_font_strike;
}
.v-enter-active, .v-leave-active{
  transition: all .3s ease;
}
.v-enter, .v-leave-to{
  opacity: 0;
  transform: translateY(-100%);
}
.txt{
  border: none;
  outline: none;
  color: $col_font;
  font-family: "Yu Gothic", "游ゴシック", YuGothic, "游ゴシック体", "ヒラギノ角ゴ Pro W3", "メイリオ", sans-serif;
}
.input{
  &__txt{
    @extend .txt;
    padding: 2px 10px;
    border-radius: 20px;
    box-shadow: 1px 1px 1px 1px rgba(19, 17, 26, 0.2) inset;
  }
}
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
    display: block;
    list-style-type: none;
    width: -webkit-fill-available;
    margin: 0 2px;
  }
}
.search{
  position: fixed;
  bottom: $siz_footer_height;
  left: 0;
  width: 20em;
  padding: $siz_space;
  background: $col_base;
  border-radius: $siz_radius;
  &__condition{
    display: block;
    padding-bottom: $siz_space;
  }
  &__txt{
    @extend .input__txt;
  }
  &__btn{
    @extend .btn;
    display: block;
  }
}
.smoke{
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
}
.transition-up{
  &-enter, &-leave-to{
    transform: translateY(100%);
  }
  &-enter-to, &-leave{
    transform: translateY(0);
  }
  &-enter-active, &-leave-active{
    transition: all .2s ease;
  }
}
.transition-fade{
  &-enter, &-leave-to{
    opacity: 0;
  }
  &-enter-to, &-leave{
    opacity: 1;
  }
  &-enter-active, &-leave-active{
    transition: all .2s ease;
  }
}
/* http://weboook.blog22.fc2.com/blog-entry-401.html */
.plus{
  display: inline-block;
  position: relative;
  margin: auto;
  padding: 0;
  width: 4px;
  height: 16px;
  background: $col_main;
  transform: translateY(3px);
}
.plus:before{
  display: block;
  content: "";
  position: absolute;
  top: 50%;
  left: -6px;
  width: 16px;
  height: 4px;
  margin-top: -2px;
  background: $col_main;
}
.cross{
  @extend .plus;
  transform: rotate(-45deg) translateY(3px);
  -moz-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
}
</style>
