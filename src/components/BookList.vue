<template>
  <div class="book-list">
    <span class="txt">HalOutliner</span>
    <ul class="book-list__list">
      <li
        v-for="(b, index) in children"
        :key="index"
        class="book-list__item">
        <a class="btn-edit" @click="selectBook(index)"></a>
        <span class="txt">{{ b.value }}</span>
        <a class="book-list__btn-delete" @click="clear(index)"></a>
        <div class="book-list__txt-time">{{ b.addDt }}</div>
        <hr class="book-list__hr">
      </li>
      <li class="book-list__add"></li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
      addDt: new Date(),
      children: []
    }
  },
  mounted () {
    // import data from stolage to this.children
    this.children.push({
      value: 'dummy001',
      addDt: new Date(),
      children: [
        {value: 'aaa', type: 0, addDt: new Date()},
        {value: 'bbb', type: 0, addDt: new Date()}
      ]
    });
    this.children.push({
      value: 'dummy002',
      addDt: new Date(),
      children: []
    });
    this.children.push({
      value: 'dummy003',
      addDt: new Date(),
      children: []
    });
  },
  methods: {
    selectBook (id) {
      this.$emit('selectBook', this.children[id]);
    },
    clear (id) {
      if (!confirm('clear?')) return;
      this.children = this.children.filter(c => c !== this.children[id]);
    }
  }
}
</script>
<style lang="scss">
@import '../assets/util.scss';
.book-list{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  min-width: 50vw;
  background: $col_base;
  box-sizing: border-box;
  padding: $siz_space;
  margin-bottom: 50vh;
  margin-left: auto;
  margin-right: auto;
  &__list{
    display: block;
    margin: 0;
    padding: $siz_space;
    background: $col_main;
  }
  &__item{
    display: block;
  }
  &__add{
    @extend .btn-add;
    display: flex;
  }
  &__txt-time{
    @extend .txt;
    float: right;
    color: $col_subfont;
    font-size: 10px;
    cursor: default;
    user-select: none;
  }
  &__hr{
    width: 95%;
    height: 1px;
    border-width: 0;
    margin: $siz_space/2 auto;
    background-color: $col_font_strike;
  }
  &__btn-delete{
    @extend .btn-delete;
    float: right;
  }
}
</style>
