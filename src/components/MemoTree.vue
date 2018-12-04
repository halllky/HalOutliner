<template>
  <div>
    <div class="memo" :class="{ todo: item.todo }">
      <div class="memo__header">
        <span class="memo__timestamp">{{ item.updDt }}</span>
        <span class="btn" @click="addChild"><span class="plus"></span></span>
        <span class="btn" @click="switchTodo">todo</span>
        <span class="btn" @click="switchExpand">{{ item.expanded ? '-' : '+' }}</span>
      </div>
      <div class="memo__body" v-for="(i, index) in item.body" :key="index">
        <textarea
          v-if="i.type == 0"
          v-model="i.val"
          class="memo__txt"
          placeholder=""
          spellcheck="false"
          @input="changeHeight($event); save();"
          @blur="deleteIfEmpty"
          @keydown="insertTab"></textarea>
        <img
          v-if="i.type == 1"
          :src="i.val"
          class="memo__img">
      </div>
    </div>
    <div class="memo__children">
      <div v-if="item.expanded">
        <transition-group>
            <div class="memo__child" v-for="(c, index) in item.children" :key="index">
              <memo-tree
                :item="c"
                @remove="removeChild($event); save();"
                @save="save();"></memo-tree>
            </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MemoTree',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  mounted () {
    var txt = this.$el.getElementsByClassName('memo__txt');
    if (txt.length) {
      // adjust height of textarea
      txt[0].style.height = '0';
      txt[0].style.height = txt[0].scrollHeight + 'px';
      // focus on textarea
      txt[0].focus();
    }
  },
  methods: {
    save: function () {
      this.$emit('save');
    },
    switchTodo: function () {
      this.$set(this.item, 'todo', !this.item.todo);
    },
    switchExpand: function () {
      this.$set(this.item, 'expanded', !this.item.expanded);
    },
    deleteIfEmpty: function (e) {
      if (e.target.value || (this.item.children && this.item.children.length)) {
        return;
      }
      this.$emit('remove', this.item);
    },
    insertTab: function (e) {
      // Tabキーを押したときは次の項目に移るのでなくスペース4個入力
      if (e.keyCode === 9) {
        if (e.preventDefault) {
          e.preventDefault();
        }
        var text = event.target.value;
        var pos = event.target.selectionStart;
        event.target.value = text.slice(0, pos) + '\t' + text.slice(pos);
        event.target.selectionStart = pos + 1;
        event.target.selectionEnd = pos + 1;
      }
    },
    removeChild: function (e) {
      this.item.children = this.item.children.filter(c => c !== e);
    },
    addChild: function () {
      if (this.item.children === undefined) {
        this.$set(this.item, 'children', []);
      }
      this.item.children.push({
        addDt: this.formatDate(new Date(), 'YYYY-MM-DD hh:mm'),
        updDt: this.formatDate(new Date(), 'YYYY-MM-DD hh:mm'),
        expanded: true,
        body: [
          {
            type: 0,
            val: ''
          }
        ]
      })
    },
    changeHeight: function (e) {
      e.target.style.height = '0';
      e.target.style.height = e.target.scrollHeight + 'px';
    },
    formatDate: function (date, format) {
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
  }
};
</script>
