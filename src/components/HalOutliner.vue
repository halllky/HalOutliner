<template>
  <div>
    <memo-root
      ref="memoRootItem"
      :search-condition="searchCondition"/>
    <footer-menu
      style="z-index: 30;"
      @search="showSearcher = !showSearcher"/>
    <transition name="transition-up">
      <searcher v-show="showSearcher" @search="search" style="z-index: 20;"/>
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
      this.showSearcher = false;
      this.$set(this, 'searchCondition', condition);
      window.setTimeout(this.$refs.memoRootItem.delayResize, 10);
    }
  }
}
</script>
<style lang="scss">
@import '../assets/util.scss';
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
.icon{
  display: inline-flex;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  user-select: none;
  cursor: default;
  background: $col_accent;
  color: $col_main;
  justify-content: center;
  align-items: center;
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
.search{
  position: fixed;
  bottom: $siz_footer_height;
  left: 0;
  width: 20em;
  padding: $siz_space;
  background: $col_base;
  border-radius: $siz_radius;
  &__condition{
    display: flex;
    padding-bottom: $siz_space;
  }
  &__txt{
    @extend .input__txt;
    width: -webkit-fill-available;
  }
  &__btn{
    @extend .btn;
    width: -webkit-fill-available;
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
</style>
