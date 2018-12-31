<template>
  <div>
    <img
      :src="value"
      :class="cssclass">
    <a class="btn-delete" @click="deleteThis"></a>
  </div>
</template>
<script>
export default {
  name: 'CaptionAndImage',
  props: {
    value: String,
    cssclass: String
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
