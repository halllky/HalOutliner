<template>
  <dialog class="book-uploader" ref="dialog">
    <a class="book-uploader__cancel" @click="cancel"></a>
    <span class="txt">please paste JSON here to upload your memo</span>
    <textarea
      v-model="importData"
      class="book-uploader__txt"
      spellcheck="false"
      onfocus="select()"/>
    <a class="book-uploader__ok" @click="ok">OK</a>
  </dialog>
</template>
<script>
export default {
  data () {
    return {
      importData: ''
    }
  },
  mounted () {
    this.$refs.dialog.showModal();
  },
  beforeDestroy () {
    this.$refs.dialog.close();
  },
  methods: {
    ok () {
      this.$emit('close', this.importData);
    },
    cancel () {
      this.$emit('close', '');
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
