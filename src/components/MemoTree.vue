<template>
  <div>
    <div class="memo" :class="{ todo: item.todo }">
      <div ref="divHeader">
        <span class="memo__timestamp">{{ item.addDt }}</span>
        <span class="btn" @click="addChild"><span class="plus"></span></span>
        <span class="btn" @click="switchTodo">todo</span>
        <span class="btn" @click="switchExpand" style="min-width: 20px;">
          {{ item.expanded ? '-' : item.children ? item.children.length : '0' }}
        </span>
      </div>
      <div class="memo__body">
        <textarea
          ref="txtBody"
          v-if="item.type === 0"
          v-model="item.value"
          class="memo__txt"
          placeholder=""
          spellcheck="false"
          @input="changeHeight($event); save();"
          @blur="deleteIfEmpty"
          @keydown="insertTab"></textarea>
        <img
          v-if="item.type === 1"
          :src="item.value"
          class="memo__img">
      </div>
    </div>
    <div class="memo__children" v-show="item.expanded">
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
    // switch header class where the view area is wide or not
    const iswide = this.$refs.divHeader.clientWidth > 500;
    this.$refs.divHeader.classList.add(iswide ? 'memo__header_inbody' : 'memo__header_outbody');
    // adjust height of textarea
    this.$refs.txtBody.style.height = '0';
    this.$refs.txtBody.style.height = this.$refs.txtBody.scrollHeight + 'px';
    // focus on textarea
    this.$refs.txtBody.focus();
  },
  methods: {
    save: function () {
      this.$emit('save');
    },
    switchTodo: function () {
      this.$set(this.item, 'todo', !this.item.todo);
    },
    switchExpand: function () {
      if (this.item.children) {
        this.$set(this.item, 'expanded', !this.item.expanded);
      } else {
        this.$set(this.item, 'expanded', true);
      }
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
        expanded: true,
        type: 0,
        value: ''
      })
      this.$set(this.item, 'expanded', true);
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
