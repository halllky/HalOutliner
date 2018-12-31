<template>
  <div>
    <memo-root
      ref="memoRootItem"
      :search-condition="searchCondition"/>
    <footer-menu
      style="z-index: 30;"
      @search="showSearcher = !showSearcher"
      @download="download"
      @upload-start="openUploader"/>
    <a ref="downloadAnchor"></a>
    <uploader v-if="showUploader"/>
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
import Uploader from './BookUploader';
export default {
  components: { MemoRoot, FooterMenu, Searcher, Uploader },
  data () {
    return {
      showSearcher: false,
      searchCondition: null,
      showUploader: false
    }
  },
  methods: {
    search (condition) {
      this.showSearcher = false;
      this.$set(this, 'searchCondition', condition);
      window.setTimeout(this.$refs.memoRootItem.delayResize, 10);
    },
    download () {
      const obj = {
        value: this.$refs.memoRootItem.value,
        children: this.$refs.memoRootItem.children
      };
      const blob = new Blob([JSON.stringify(obj)], {type: 'application/json'});
      const btn = this.$refs.downloadAnchor;
      btn.href = URL.createObjectURL(blob);
      btn.download = this.value ? this.value : 'HalOutliner';
      btn.click();
    },
    openUploader () {
      this.showUploader = true;
    }
  }
}
</script>
<style lang="scss">
@import '../assets/util.scss';
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
