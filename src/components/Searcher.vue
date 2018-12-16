<template>
  <span>
    <input type="text" v-model="word">
    <a class="btn" @click="search">search</a>
  </span>
</template>
<script>
export default {
  name: 'Searcher',
  props: {
    from: Object
  },
  data () {
    return {
      word: ''
    }
  },
  methods: {
    search () {
      // todo: make this function
    }
  }
}
</script>
