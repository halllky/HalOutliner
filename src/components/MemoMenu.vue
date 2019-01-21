<template>
  <div class="memo-menu">
    <span>{{ timestamp }}</span>
    <ul class="memo-menu__list">
      <li class="btn" @click="switchTodo(); $emit('close');">{{ todoButtonText }}</li>
      <li class="btn-add" @click="$emit('addChild'); $emit('close');"></li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    timestamp: '',
    todo: 0
  },
  computed: {
    todoButtonText: {
      get () {
        // show not current name, but next name
        switch (this.todo) {
          case 1: return 'done';
          case 2: return 'reset';
          default: return 'todo';
        }
      }
    }
  },
  methods: {
    switchTodo: function () {
      let t;
      switch (this.todo) {
        case 1: t = 2; break; // todo -> done
        case 2: t = 0; break; // done -> normal
        default: t = 1; break;// normal -> todo
      }
      this.$emit('switchTodo', t);
    }
  }
}
</script>
<style lang="scss">
@import '../assets/util.scss';
.memo-menu{
  position: absolute;
  right: 0;
  background: $col_main;
  box-shadow: 0px 0px 15px -5px rgba(0, 0, 0, 0.8);
  &__list{
    display: flex;
    flex-direction: column;
    margin: 2px;
    & :not(:first-child){
      margin-top: 2px;
    }
  }
}
</style>
