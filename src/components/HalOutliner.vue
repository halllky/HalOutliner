<template>
  <div>
    <transition name="transition-leftside">
      <book-list
        v-if="!showBook"
        @selectBook="selectBook"/>
    </transition>
    <transition name="transition-rightside">
      <memo-root
        v-show="showBook"
        ref="memoRootItem"
        :search-condition="searchCondition"
        @close="closeBook"/>
    </transition>
    <footer-menu
      style="z-index: 30;"
      @search="showSearcher = !showSearcher"
      @download="download"
      @upload-start="openUploader"/>
    <a ref="downloadAnchor"></a>
    <uploader
      v-if="showUploader"
      @close="closeUploader"/>
    <transition name="transition-up">
      <searcher v-show="showSearcher" @search="search" style="z-index: 20;"/>
    </transition>
    <transition name="transition-fade">
      <div v-if="showSearcher" class="smoke" style="z-index: 10;" @click="showSearcher = false"></div>
    </transition>
  </div>
</template>
<script>
import BookList from './BookList.vue';
import MemoRoot from './MemoRoot.vue';
import FooterMenu from './FooterMenu.vue';
import Searcher from './Searcher';
import Uploader from './BookUploader';
export default {
  components: { BookList, MemoRoot, FooterMenu, Searcher, Uploader },
  data () {
    return {
      showBook: false,
      showSearcher: false,
      searchCondition: null,
      showUploader: false
    }
  },
  methods: {
    selectBook (selectedItem) {
      this.$refs.memoRootItem.initialize(selectedItem);
      this.showBook = true;
    },
    closeBook () {
      this.showBook = false;
    },
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
    },
    closeUploader (returnValue) {
      if (!returnValue) {
        this.showUploader = false;
        return;
      }
      try {
        const obj1 = JSON.parse(returnValue);
        this.$refs.memoRootItem.value = obj1.value;
        this.$refs.memoRootItem.children = obj1.children;
        this.showUploader = false;
      } catch (error) {
        alert('error');
      }
    }
  }
}
</script>
<style lang="scss">
@import '../assets/util.scss';
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
.transition-leftside{
  &-enter, &-leave-to{
    transform: translateX(-100%);
    opacity: 0;
  }
  &-enter-to, &-leave{
    opacity: 1;
  }
  &-enter-active, &-leave-active{
    transition: all .4s ease;
  }
}
.transition-rightside{
  &-enter, &-leave-to{
    transform: translateX(100%);
    opacity: 0;
  }
  &-enter-to, &-leave{
    opacity: 1;
  }
  &-enter-active, &-leave-active{
    transition: all .4s ease;
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
</style>
