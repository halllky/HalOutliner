<template>
  <li>
    <div class="memo" :class="{ todo: item.todo === 1 }">
      <span class="icon__todo" v-if="showTodoIcon">！</span>
      <div ref="divHeader">
        <span class="memo__timestamp">{{ item.addDt }}</span>
        <a class="btn" @click="addChild(0, '')"><span class="plus"></span></a>
        <a class="btn" @click="switchTodo">{{ todoButtonText }}</a>
        <a class="btn" @click="switchExpand" style="min-width: 20px;">
          {{ item.expanded ? '-' : item.children ? item.children.length : '0' }}
        </a>
      </div>
      <div class="memo__body">
        <stretchable-textarea
          v-if="item.type === 0"
          v-model="item.value"
          :strike="item.todo === 2"
          ref="textItem"
          @textchange="save"
          @leave="deleteIfEmpty"
          @imagepasted="addChildImage">
        </stretchable-textarea>
        <stretchable-image
          v-if="item.type === 1"
          :value="item.value"
          cssclass="memo__img"
          @deleted="deleteMe">
        </stretchable-image>
      </div>
    </div>
    <transition-group tag="ul" class="memo__children" v-if="item.expanded">
      <memo-tree
        v-for="(c, index) in item.children"
        :key="index"
        :item="c"
        ref="childItem"
        class="memo__child"
        @remove="removeChild($event); save();"
        @save="save">
      </memo-tree>
    </transition-group>
  </li>
</template>
<script>
import StretchableTextarea from './StretchableTextarea';
import StretchableImage from './StretchableImage';

export default {
  name: 'MemoTree',
  components: {
    StretchableTextarea,
    StretchableImage
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    showTodoIcon: {
      get () {
        function hasTodoChild (parent) {
          if (parent.todo === 1) return true;
          if (parent.children !== undefined) {
            let i = parent.children.filter(c => hasTodoChild(c));
            if (i.length > 0) return true;
          }
          return false;
        }
        if (this.item.todo === 1) {
          return true;
        } else {
          return !this.item.expanded &&
            hasTodoChild(this.item);
        }
      }
    },
    todoButtonText: {
      get () {
        // show not current name, but next name
        switch (this.item.todo) {
          case 1: return 'done';
          case 2: return 'reset';
          default: return 'todo';
        }
      }
    }
  },
  mounted () {
    // switch header class where the view area is wide or not
    const iswide = this.$refs.divHeader.clientWidth > 500;
    this.$refs.divHeader.classList.add(iswide ? 'memo__header_inbody' : 'memo__header_outbody');
  },
  methods: {
    save () {
      this.$emit('save');
    },
    switchTodo: function () {
      let t;
      switch (this.item.todo) {
        case 1: t = 2; break; // todo -> done
        case 2: t = 0; break; // done -> normal
        default: t = 1; break;// normal -> todo
      }
      this.$set(this.item, 'todo', t);
    },
    switchExpand () {
      if (this.item.children) {
        this.$set(this.item, 'expanded', !this.item.expanded);
      } else {
        this.$set(this.item, 'expanded', true);
      }
    },
    deleteMe () {
      this.$emit('remove', this.item);
    },
    deleteIfEmpty (e) {
      if (e.target.value || (this.item.children && this.item.children.length)) {
        return;
      }
      this.deleteMe();
    },
    removeChild (e) {
      this.item.children = this.item.children.filter(c => c !== e);
      // 'mounted' (= resizing textarea) dont work when part of v-for array is removed
      const vm = this;
      function delayResize () {
        for (let i = 0; i < vm.$refs.childItem.length; i++) {
          vm.$refs.childItem[i].resize();
        }
      }
      window.setTimeout(delayResize, 10);
    },
    addChild (type, value) {
      if (this.item.children === undefined) {
        this.$set(this.item, 'children', []);
      }
      this.item.children.push({
        addDt: this.formatDate(new Date(), 'YYYY-MM-DD hh:mm'),
        expanded: true,
        type: type,
        value: value
      })
      this.$set(this.item, 'expanded', true);
    },
    addChildImage (e) {
      const vm = this;
      const fr = new FileReader();
      fr.onload = function () {
        vm.addChild(1, fr.result);
      }
      fr.readAsDataURL(e);
    },
    resize () {
      this.$refs.textItem.resize();
    },
    isHitsSearch (term) {
      function hasTerm (parent) {
        if (parent.value.indexOf(term) >= 0) return true;
        if (parent.children !== undefined) {
          let i = parent.children.filter(c => hasTerm(c));
          if (i.length > 0) return true;
        }
        return false;
      }
      return hasTerm(this.item);
    },
    formatDate (date, format) {
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
