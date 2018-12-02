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
    <div class="memo__add memo__child" @click="addRootMemo">
      <span class="memo__plus"></span>
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
<style>
.book{
  background: rgb(199, 224, 216);
  border-radius: 4px;
  box-sizing: border-box;
  padding: 6px;
  margin-bottom: 50vh;
}
.title{
  outline: none;
  border: none;
  font-size: 18px;
  min-height: 1.4em;
  border-bottom: 1px solid gray;
  background: transparent;
}
.memo{
  position: relative;
  background: rgb(246, 250, 249);
  border-radius: 4px;
  box-sizing: border-box;
  padding: 6px;
}
.memo__header{
  display: flex;
  position: absolute;
  right: 6px;
  justify-content: flex-end;
}
.memo__header :not(:first-child){
  margin-left: 6px;
}
.memo__body{
  line-height: 0;
}
.memo__timestamp{
  right: 0;
  color: gray;
  font-size: 10px;
  cursor: default;
  user-select: none;
}
.memo__children{
  padding-left: 1.5em;
}
.memo__child{
  margin-top: 6px;
}
.memo__txt{
  resize: none;
  outline: none;
  border: none;
  padding: 0;
  width: 100%;
  height: 1em;
  min-height: 1em;
  font-size: 14px;
  background: transparent;
  color: rgb(13, 80, 134);
  font-family: "Yu Gothic", "游ゴシック", YuGothic, "游ゴシック体", "ヒラギノ角ゴ Pro W3", "メイリオ", sans-serif;
  font-weight: 500;
  line-height: 16px;
}
.memo__add{
  min-width: 20px;
  height: 20px;
  display: flex;
  background: rgb(117, 172, 182);
  border-radius: 5px;
}
.v-enter-active, .v-leave-active{
  transition: all .3s ease;
}
.v-enter, .v-leave-to{
  opacity: 0;
  transform: translateY(-100%);
}
/* http://weboook.blog22.fc2.com/blog-entry-401.html */
.memo__plus{
  display: inline-block;
  position: relative;
  margin: auto;
  padding: 0;
  width: 4px;
  height: 16px;
  background: rgb(246, 250, 249);
}
.memo__plus:before{
  display: block;
  content: "";
  position: absolute;
  top: 50%;
  left: -6px;
  width: 16px;
  height: 4px;
  margin-top: -2px;
  background: rgb(246, 250, 249);
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
/* https://saruwakakun.com/html-css/reference/buttons */
.btn {
    position: relative;
    display: inline-block;
    padding: 0.25em;
    text-decoration: none;
    color: #FFF;
    background: #9cc0ae;/*色*/
    border-radius: 4px;
    box-shadow: inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.05);
    font-weight: bold;
    border: solid 1px #859b9a;/*線色*/
    cursor: default;
    user-select: none;
}

.btn:active {/*押したとき*/
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.30);
}
</style>
