<template>
  <div class="search">
    <label for="text" class="search_condition">
      contains:
      <input type="text" class="input__txt" v-model="searchTerm" spellcheck="false" @blur="onBlur">
    </label>
    <label for="only_todo" class="search_condition">
      <input type="checkbox" id="only_todo" v-model="onlyTodo">only todo
    </label>
    <a class="search_btn" @click="search">search</a>
  </div>
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
