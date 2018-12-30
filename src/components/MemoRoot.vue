<template>
  <div ref="divBook" class="book">
    <searcher @search="search"></searcher>
    <div style="text-align: right;">
      <a class="btn" @click="clear">clear</a>
      <a class="btn download" @click="download">export</a>
      <a class="btn" @click="restore">import</a>
    </div>
    <input
      class="title"
      type="text"
      placeholder="title"
      spellcheck="false"
      v-model="value"
      @input="save">
    <ul class="memo__children" style="padding-left: 0;">
      <memo-tree
        v-for="(c, index) in filteredChildren"
        :key="index"
        :item="c"
        ref="childItem"
        class="memo__child"
        @remove="removeChild($event); save();"
        @save="save">
      </memo-tree>
    </ul>
    <a class="btn memo__child" @click="addRootMemo">
      <span class="plus"></span>
    </a>
  </div>
</template>
<script>
import MemoTree from './MemoTree';
import Searcher from './Searcher';

export default {
  name: 'MemoRoot',
  components: { MemoTree, Searcher },
  data () {
    return {
      addDt: this.formatDate(new Date(), 'YYYY-MM-DD hh:mm'),
      expanded: true,
      type: 0,
      value: '',
      children: [],
      searchCondition: null
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
      function hasTerm (parent) {
        if (parent.value.indexOf(term) >= 0) {
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
      // clear search condition
      this.search(null);
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
    download () {
      const d = JSON.stringify({
        value: this.value,
        children: this.children
      })
      const btn = this.$el.getElementsByClassName('download');
      if (btn) {
        const blob = new Blob([d], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        btn[0].href = url;
        btn[0].download = this.value ? this.value : 'HalOutliner';
      }
    },
    restore () {
      const d = window.prompt('paset JSON here', '');
      const j = JSON.parse(d);
      if (j) {
        this.value = j.value;
        this.children = j.children;
      }
    },
    search (condition) {
      this.$set(this, 'searchCondition', condition);
      window.setTimeout(this.delayResize, 10);
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
