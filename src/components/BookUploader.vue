<template>
  <dialog ref="dialog">
  </dialog>
</template>
<script>
export default {
  mounted () {
    this.$refs.dialog.showModal();
  }
}
</script>
