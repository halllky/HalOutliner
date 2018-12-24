<template>
  <span>
    <input type="text" v-model="searchTerm">
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
    search () {
      this.$emit('search', this.searchTerm);
    }
  }
}
</script>
