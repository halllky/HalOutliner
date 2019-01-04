<template>
  <div>
    <img
      :src="value"
      class="memo__img">
    <a class="btn-delete" @click="deleteThis"></a>
  </div>
</template>
<script>
export default {
  name: 'CaptionAndImage',
  props: {
    value: String
  },
  methods: {
    deleteThis () {
      if (confirm('do you delete this image?')) {
        this.$emit('deleted', this);
      }
    }
  }
}
</script>
<style lang="scss">
@import '../assets/util.scss';
.memo__img{
  max-width: 90%;
}
</style>
