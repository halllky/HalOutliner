<template>
  <dialog class="book-uploader" ref="dialog">
    <a class="book-uploader__cancel" @click="cancel"></a>
    <span class="txt">please paste JSON here to upload your memo</span>
    <textarea
      class="book-uploader__txt"
      spellcheck="false"
      onfocus="select()"/>
    <a class="book-uploader__ok">OK</a>
  </dialog>
</template>
<script>
export default {
  mounted () {
    this.$refs.dialog.showModal();
  },
  methods: {
    cancel () {
      this.$emit('cancel');
      this.$refs.dialog.close();
    }
  }
}
</script>
<style lang="scss">
@import '../assets/util.scss';
.book-uploader{
  border: none;
  border-radius: $siz_radius;
  background: $col_main;
  &__txt{
    @extend .txt;
    resize: none;
    border: solid 1px;
    width: 100%;
    box-sizing: border-box;
  }
  &__ok{
    @extend .btn;
    min-width: 5em;
  }
  &__cancel{
    @extend .btn-delete;
    position: absolute;
    top: 0.6em;
    right: 0.6em;
  }
}
</style>
