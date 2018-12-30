<template>
  <span>
    <input type="text" class="search_condition" v-model="searchTerm" @blur="onBlur">
    <label for="only_todo" class="search_condition">
      <input type="checkbox" id="only_todo" v-model="onlyTodo">only todo
    </label>
    <a class="btn" @click="search">search</a>
  </span>
</template>
<script>
export default {
  name: 'Searcher',
  data () {
    return {
      searchTerm: '',
      onlyTodo: false
    }
  },
  methods: {
    onBlur () {
      if (this.searchTerm.length === 0) this.$emit('search', '');
    },
    search () {
      this.$emit('search', {
        searchTerm: this.searchTerm,
        onlyTodo: this.onlyTodo
      });
    }
  }
}
</script>
