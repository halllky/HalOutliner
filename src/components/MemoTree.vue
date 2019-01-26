<template>
  <li class="memo__child">
    <div class="memo" :class="{ todo: item.todo === 1 }">
      <span class="memo__todo-icon" v-if="showTodoIcon"></span>
      <div class="memo__btn-expand" @click="switchExpand">
        {{ item.expanded ||
        !item.children ||
        item.children.length === 0 ? '-' : item.children.length }}
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
          @deleted="deleteMe">
        </stretchable-image>
      </div>
      <a class="memo__btn-menu" @click="menuOpened = !menuOpened">menu</a>
      <div
        class="smoke"
        style="z-index: 1; background: transparent;"
        v-if="menuOpened"
        @click="menuOpened = false">
      </div>
      <transition name="transition-dropdown">
        <memo-menu
          v-if="menuOpened"
          style="z-index: 2;"
          :timestamp="item.addDt"
          :todo="item.todo"
          @close="menuOpened = false"
          @switchTodo="switchTodo"
          @addChild="addChild(0, '')"/>
      </transition>
    </div>
    <transition-group
      tag="ul"
      name="transition-dropdown"
      class="memo__children"
      v-if="item.expanded">
      <memo-tree
        v-for="(c, index) in item.children"
        :key="index"
        :item="c"
        ref="childItem"
        @remove="removeChild($event); save();"
        @save="save">
      </memo-tree>
    </transition-group>
  </li>
</template>
<script>
import MemoMenu from './MemoMenu.vue';
import StretchableTextarea from './StretchableTextarea';
import StretchableImage from './StretchableImage';

export default {
  name: 'MemoTree',
  components: {
    MemoMenu,
    StretchableTextarea,
    StretchableImage
  },
  data () {
    return {
      menuOpened: false
    }
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
  methods: {
    save () {
      this.$emit('save');
    },
    switchTodo (val) {
      this.$set(this.item, 'todo', val);
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
      // scroll to created child ... but the element isn't exist yet
      if (this.$refs.childItem.length > 0) {
        const lastChild = this.$refs.childItem[this.$refs.childItem.length - 1].$el;
        this.scrollTo(lastChild, lastChild.getBoundingClientRect().height);
      }
    },
    addChildImage (e) {
      const vm = this;
      const fr = new FileReader();
      fr.onload = function () {
        vm.addChild(1, fr.result);
      }
      fr.readAsDataURL(e);
    }
  }
};
</script>
<style lang="scss">
@import '../assets/util.scss';
.memo{
  display: flex;
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
    width: 100%;
  }
  &__children{
    margin: auto;
    padding-left: 1.5em;
  }
  &__child{
    display: block;
    margin-top: $siz_space;
  }
  &__timestamp{
    right: 0;
    color: $col_subfont;
    font-size: 10px;
    cursor: default;
    user-select: none;
  }
  &__todo-icon{
    @extend .icon-attention;
    position: absolute;
    top: -0.2em;
    left: -1.2em;
  }
  &__btn-expand{
    @extend .btn;
    margin-right: $siz_space;
    background: transparent;
    color: $col_accent;
    &:active{
      background: transparent;
    }
  }
  &__btn-menu{
    @extend .btn;
    font-size: 8px;
  }
}
.todo{
  background: $col_todo_back;
}
.done{
  color: $col_font_strike;
}
.transition-dropdown{
  &-enter-active, &-leave-active{
    transition: all .3s ease;
  }
  &-enter, &-leave-to{
    opacity: 0;
    transform: translateY(-100%);
  }
}
</style>
