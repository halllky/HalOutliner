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
    },
    download () {
      if (!confirm('download?')) return;
      const obj = {
        value: this.$refs.memoRootItem.value,
        children: this.$refs.memoRootItem.children
      };
      const blob = new Blob([JSON.stringify(obj)], {type: 'application/json'});
      const fileName = obj.value ? obj.value : 'HalOutliner';
      if (this.isAndroid()) {
        this.downloadForAndroid(blob, fileName + '.json');
      } else {
        const btn = this.$refs.downloadAnchor;
        btn.href = URL.createObjectURL(blob);
        btn.download = fileName;
        btn.click();
      }
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
