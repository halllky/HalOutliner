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
  updated () {
    this.resize();
  },
  mounted () {
    this.resize();
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
      this.$emit('textchange', e, this);
    },
    onPaste (e) {
      Array.from(e.clipboardData.files)
        .filter(f => f.type.indexOf('image/') >= 0)
        .forEach(i => {
          this.$emit('imagepasted', i);
        });
    },
    resize () {
      this.$el.style.height = '0';
      this.$el.style.height = this.$el.scrollHeight + 'px';
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
<style lang="scss">
@import '../assets/util.scss';
.memo__txt{
  @extend .txt;
  resize: none;
  overflow: hidden;
  padding: 0;
  width: 100%;
  height: 1em;
  min-height: 1em;
  font-size: 14px;
  background: transparent;
  font-weight: 500;
  line-height: 16px;
  &_strike{
    color: $col_font_strike;
    text-decoration-line: line-through;
  }
}
</style>
