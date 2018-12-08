<template>
  <textarea
    v-model="_value"
    spellcheck="false"
    :class="cssclass"
    @input="onInput($event);"
    @blur="onLeave"
    @keydown="insertTab"></textarea>
</template>
<script>
export default {
  name: 'StretchableTextarea',
  props: {
    value: String,
    cssclass: String
  },
  computed: {
    _value: {
      get () { return this.value; },
      set (v) { this.$emit('input', v); }
    }
  },
  mounted () {
    this.$el.style.height = '0';
    this.$el.style.height = this.$el.scrollHeight + 'px';
    // select textarea on constructed
    // HACK: also selected when page loaded or expanded with no child
    if (this.$el.value.length === 0) {
      this.$el.select();
    }
  },
  methods: {
    onLeave (e) {
      this.$emit('leave', e);
    },
    onInput (e) {
      // change height
      this.$el.style.height = '0';
      this.$el.style.height = this.$el.scrollHeight + 'px';
      // emit
      this.$emit('textchange', e, this);
    },
    insertTab (e) {
      // insert TAB
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
    }
  }
}
</script>
