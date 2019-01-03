<template>
  <dialog class="book-uploader" ref="dialog">
    <a class="book-uploader__cancel" @click="cancel"></a>
    <input
      type="file"
      accept="application/json"
      class="book-uploader__input"
      @change="importData">
      <div class="txt">{{ state }}</div>
    <a class="book-uploader__ok" @click="ok">OK</a>
  </dialog>
</template>
<script>
export default {
  data () {
    return {
      state: 'no file selected',
      importString: ''
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
      this.$emit('close', this.importString);
    },
    cancel () {
      this.$emit('close', '');
    },
    importData (e) {
      if (e.target.files.length === 0) {
        this.state = 'no file selected';
      } else {
        const vm = this;
        const r = new FileReader();
        r.onload = function () {
          try {
            JSON.parse(this.result);
            vm.state = 'load complete';
            vm.importString = this.result;
          } catch (error) {
            vm.state = 'invalid file';
          }
        }
        r.readAsText(e.target.files[0]);
        this.state = 'now on loading';
      }
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
  &__input{
    display: block;
    outline: none;
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
