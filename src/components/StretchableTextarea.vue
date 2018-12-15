<template>
  <textarea
    v-model="_value"
    spellcheck="false"
    contenteditable="true"
    class="memo__txt"
    :class="{ memo__txt_strike: strike }"
    @input="onInput($event);"
    @blur="onLeave"
    @keydown="insertTab"
    @paste="onPaste"></textarea>
</template>
<script>
export default {
  name: 'StretchableTextarea',
  props: {
    value: String,
    strike: Boolean
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
    onPaste (e) {
      Array.from(e.clipboardData.files)
        .filter(f => f.type.indexOf('image/') >= 0)
        .forEach(i => {
          this.$emit('imagepasted', i);
        });
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
