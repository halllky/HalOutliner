<template>
  <div>
    <img
      :src="value"
      :class="cssclass">
  </div>
</template>
<script>
export default {
  name: 'CaptionAndImage',
  props: {
    value: String,
    cssclass: String
  }
}
</script>
