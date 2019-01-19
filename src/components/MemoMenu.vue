<template>
  <div>
    <ul>
      <li @click="switchTodo">{{ todoButtonText }}</li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
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
