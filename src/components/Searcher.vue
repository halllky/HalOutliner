<template>
  <span>
    <input type="text" v-model="searchTerm" @blur="onBlur">
    <a class="btn" @click="search">search</a>
  </span>
</template>
<script>
export default {
  name: 'Searcher',
  data () {
    return {
      searchTerm: ''
    }
  },
  methods: {
    onBlur () {
      if (this.searchTerm.length === 0) this.$emit('search', '');
    },
    search () {
      this.$emit('search', this.searchTerm);
    }
  }
}
</script>
