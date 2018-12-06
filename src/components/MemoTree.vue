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
        <stretchable-textarea
          v-if="item.type === 0"
          v-model="item.value"
          cssclass="memo__txt"
          @textchange="onTextChanged"></stretchable-textarea>
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
import StretchableTextarea from './StretchableTextarea';

export default {
  name: 'MemoTree',
  components: { StretchableTextarea },
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
  },
  methods: {
    save: function () {
      this.$emit('save');
    },
    switchTodo: function () {
      this.$set(this.item, 'todo', !this.item.todo);
    },
    onTextChanged (e, v) {
      // delete if empty
      if (!e.data) this.removeChild(v);
      this.save();
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
