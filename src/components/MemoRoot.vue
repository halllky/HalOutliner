<template>
  <div ref="divBook" class="book">
    <div style="text-align: right;">
      <searcher @search="search"></searcher>
      <label for="only_todo">
        <input type="checkbox" id="only_todo" v-model="onlyTodo">only todo
      </label>
      <a class="btn" @click="clear">clear</a>
      <a class="btn download" @click="download">export</a>
      <input type="hidden" id="hdnDLObject" ref="hdnDLObject">
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
      searchTerm: '',
      onlyTodo: false
    }
  },
  computed: {
    filteredChildren () {
      const term = this.searchTerm;
      const onlyTodo = this.onlyTodo;
      function isHit (parent) {
        if ((term.length === 0 || parent.value.indexOf(term) >= 0) &&
        (!onlyTodo || parent.todo === 1)) {
          return true;
        }
        if (parent.children !== undefined) {
          let i = parent.children.filter(c => isHit(c));
          if (i.length > 0) return true;
        }
        return false;
      }
      return this.children.filter(c => isHit(c));
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
      this.search('');
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
      try {
        this.$refs.hdnDLObject.value = JSON.stringify({
          value: this.value,
          children: this.children
        });
        this.$refs.hdnDLObject.dispatchEvent(new Event('change'));
        this.$refs.hdnDLObject.value = '';
      } catch (error) {
        alert(error.toString());
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
    search (term) {
      this.searchTerm = term;
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
<style lang="scss">
$siz_space: 6px;
$siz_radius: 4px;
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
    resize: none;
    outline: none;
    border: none;
    padding: 0;
    width: 100%;
    height: 1em;
    min-height: 1em;
    font-size: 14px;
    background: transparent;
    color: $col_font;
    font-family: "Yu Gothic", "游ゴシック", YuGothic, "游ゴシック体", "ヒラギノ角ゴ Pro W3", "メイリオ", sans-serif;
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
