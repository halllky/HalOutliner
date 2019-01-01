<template>
  <div ref="divBook" class="book">
    <a class="book__btn-delete" @click="clear"></a>
    <input
      class="book__title"
      type="text"
      placeholder="title"
      spellcheck="false"
      v-model="value"
      @input="save">
    <ul class="book__items">
      <memo-tree
        v-for="(c, index) in filteredChildren"
        :key="index"
        :item="c"
        ref="childItem"
        @remove="removeChild($event); save();"
        @save="save">
      </memo-tree>
    </ul>
    <a class="book__btn-add" @click="addRootMemo"></a>
  </div>
</template>
<script>
import MemoTree from './MemoTree';

export default {
  name: 'MemoRoot',
  components: { MemoTree },
  props: {
    searchCondition: Object
  },
  data () {
    return {
      addDt: this.formatDate(new Date(), 'YYYY-MM-DD hh:mm'),
      expanded: true,
      type: 0,
      value: '',
      children: []
    }
  },
  computed: {
    filteredChildren () {
      // if specify no condition
      if (this.searchCondition === undefined || this.searchCondition === null) {
        return this.children;
      }
      // find items that match search conditions
      const term = this.searchCondition.searchTerm;
      const onlyTodo = this.searchCondition.onlyTodo;
      // eslint-disable-next-line no-irregular-whitespace
      const reg = new RegExp(term.split(/( |　)+|\n+/g).join('|'), 'mi');
      function hasTerm (parent) {
        if (reg.test(parent.value)) {
          return true;
        }
        if (parent.children !== undefined) {
          let i = parent.children.filter(c => hasTerm(c));
          if (i.length > 0) return true;
        }
        return false;
      }
      function isTodo (parent) {
        if (parent.todo === 1) {
          return true;
        }
        if (parent.children !== undefined) {
          let i = parent.children.filter(c => isTodo(c));
          if (i.length > 0) return true;
        }
        return false;
      }
      return this.children.filter(c => (!term || hasTerm(c)) && (!onlyTodo || isTodo(c)));
    }
  },
  methods: {
    delayResize () {
      for (let i = 0; i < this.$refs.childItem.length; i++) {
        this.$refs.childItem[i].resize();
      }
    },
    removeChild (e) {
      // HACK: duplicate with MemoTree.vue
      this.children = this.children.filter(c => c !== e);
      // 'mounted' (= resizing textarea) dont work when part of v-for array is removed
      window.setTimeout(this.delayResize, 10);
    },
    addRootMemo () {
      // HACK: duplicate with MemoTree.vue
      this.children.push({
        addDt: this.formatDate(new Date(), 'YYYY-MM-DD hh:mm'),
        expanded: true,
        type: 0,
        value: ''
      });
    },
    save () {
      const d = JSON.stringify({
        value: this.value,
        children: this.children
      })
      localStorage.setItem('halOutliner', d);
    },
    clear () {
      if (confirm('clear?')) {
        this.value = '';
        this.children = [];
      }
    },
    initialize (memo) {
      this.addDt = memo.addDt;
      this.value = memo.value;
      this.children = memo.children;
    },
    formatDate (date, format) {
      // HACK: duplicate with MemoTree.vue
      // https://qiita.com/osakanafish/items/c64fe8a34e7221e811d0
      if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
      format = format.replace(/YYYY/g, date.getFullYear());
      format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
      format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
      format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
      format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
      format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
      if (format.match(/S/g)) {
        var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        var length = format.match(/S/g).length;
        for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
      }
      return format;
    }
  },
  created () {
    // load from localStorage
    const strSavedata = localStorage.getItem('halOutliner');
    if (strSavedata !== null) {
      const d = JSON.parse(strSavedata);
      this.value = d.value;
      this.children = d.children;
    }
    // alert when try to leave this page
    window.addEventListener('beforeunload', function (e) {
      e.returnValue = 'caution!';
    }, false);
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
  &__title{
    @extend .txt;
    font-size: 18px;
    width: 90%;
    min-height: 1.4em;
    border-bottom: 1px solid $col_accent;
    background: transparent;
  }
  &__items{
    margin: auto;
    padding: 0;
  }
  &__btn-delete{
    @extend .btn-delete;
    float: right;
  }
  &__btn-add{
    @extend .btn-add;
    width: 100%;
    margin-top: $siz_space;
  }
}
</style>
