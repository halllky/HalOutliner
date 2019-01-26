<template>
  <div class="search">
    <label for="text" class="search__condition">
      contains:
      <input
        type="text"
        class="search__txt"
        v-model="searchTerm"
        spellcheck="false"
        onfocus="select();"
        @keydown="searchOnEnter">
    </label>
    <label for="only_todo" class="search__condition">
      <input type="checkbox" id="only_todo" v-model="onlyTodo">only todo
    </label>
    <a class="search__btn" @click="search">search</a>
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
    search () {
      this.$emit('search', {
        searchTerm: this.searchTerm,
        onlyTodo: this.onlyTodo
      });
    },
    searchOnEnter (e) {
      if (e.keyCode === 13) {
        this.search();
      }
    }
  }
}
</script>
<style lang="scss">
@import '../assets/util.scss';
.search{
  position: fixed;
  bottom: $siz_footer_height;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: $siz_space;
  background: $col_base;
  border-radius: $siz_radius;
  &__condition{
    display: flex;
    padding-bottom: $siz_space;
  }
  &__txt{
    @extend .input__txt;
    width: -webkit-fill-available;
    font-size: 20px;
  }
  &__btn{
    @extend .btn;
    width: -webkit-fill-available;
  }
}
</style>
