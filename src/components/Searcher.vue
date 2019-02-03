<template>
  <div class="search">
    <label for="txt-search-term" class="search__condition">
      contains:
      <input
        id="txt-search-term"
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
  @include if-pc{
    top: 0;
  }
  @include if-phone{
    bottom: $siz_footer_height;
  }
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: $siz_space;
  @include if-pc{
    padding-left: $siz_footer_width;
  }
  background: $col_base;
  border-radius: $siz_radius;
  &__condition{
    display: flex;
    padding-bottom: $siz_space;
    align-items: center;
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
