<template>
  <div class="book">
    <div style="text-align: right;">
      <a class="btn" @click="clear">clear</a>
      <a class="download btn" @click="download">download</a>
    </div>
    <input
      class="title"
      type="text"
      placeholder="title"
      spellcheck="false"
      v-model="title"
      @input="save">
    <transition-group>
      <div v-for="(i, index) in itemData" :key="index">
        <memo-tree
          :item="i"
          class="memo__child"
          @remove="removeChild($event); save();"
          @save="save"></memo-tree>
      </div>
    </transition-group>
    <div class="btn memo__child" @click="addRootMemo">
      <span class="plus"></span>
    </div>
  </div>
</template>
<script>
import MemoTree from './MemoTree';

export default {
  name: 'MemoRoot',
  components: { MemoTree },
  data () {
    return {
      title: '',
      itemData: []
    }
  },
  methods: {
    removeChild: function (e) {
      // HACK: duplicate with MemoTree.vue
      this.itemData = this.itemData.filter(c => c !== e);
    },
    addRootMemo: function () {
      // HACK: duplicate with MemoTree.vue
      this.itemData.push({
        addDt: this.formatDate(new Date(), 'YYYY-MM-DD hh:mm'),
        updDt: this.formatDate(new Date(), 'YYYY-MM-DD hh:mm'),
        body: [
          {
            type: 0,
            val: ''
          }
        ]
      });
    },
    save: function () {
      const d = JSON.stringify({
        title: this.title,
        itemData: this.itemData
      })
      localStorage.setItem('halOutliner', d);
    },
    clear: function () {
      if (confirm('clear?')) {
        this.title = '';
        this.itemData = [];
      }
    },
    download: function () {
      const d = JSON.stringify({
        title: this.title,
        itemData: this.itemData
      })
      const btn = this.$el.getElementsByClassName('download');
      if (btn) {
        const blob = new Blob([d], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        btn[0].href = url;
        btn[0].download = this.title ? this.title : 'HalOutliner';
      }
    },
    formatDate: function (date, format) {
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
    // load
    const strSavedata = localStorage.getItem('halOutliner');
    if (strSavedata !== null) {
      const d = JSON.parse(strSavedata);
      this.title = d.title;
      this.itemData = d.itemData;
    }
    // alert try to leave this page
    window.addEventListener('beforeunload', function (e) {
      e.returnValue = 'caution!';
    }, false);
  }
}
</script>
<style lang="scss">
$siz_space: 6px;
$siz_radius: 4px;
$col_base: rgb(199, 224, 216);
$col_main: rgb(246, 250, 249);
$col_accent: rgb(117, 172, 182);
$col_font: rgb(13, 80, 134);
$col_subfont: gray;
.book{
  background: $col_base;
  border-radius: $siz_radius;
  box-sizing: border-box;
  padding: $siz_space;
  margin-bottom: 50vh;
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
    position: absolute;
    right: $siz_space;
    justify-content: flex-end;
  }
  &__header :not(:first-child){
    margin-left: $siz_space;
  }
  &__body{
    line-height: 0;
  }
  &__children{
    padding-left: 1.5em;
  }
  &__child{
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
  }
}
.btn{
  min-width: 20px;
  min-height: 20px;
  padding: 0px 2px;
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
}
.todo{
  background: #fff3b1;
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
/* http://weboook.blog22.fc2.com/blog-entry-401.html */
.memo__delete{
  display: inline-block;
  position: relative;
  margin: 0 7px 0 7px;
  padding: 0;
  width: 4px;
  height: 20px;
  background: rgb(240, 141, 124);
  transform: rotate(45deg);
}
.memo__delete:before{
  display: block;
  content: "";
  position: absolute;
  top: 50%;
  left: -8px;
  width: 20px;
  height: 4px;
  margin-top: -2px;
  background: rgb(240, 141, 124);
}
</style>
