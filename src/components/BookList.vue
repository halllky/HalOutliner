<template>
  <div>
    HalOutliner
    <ul>
      <li
        v-for="(b, index) in children"
        :key="index"
        @click="selectBook(index)">
        {{ b.value }}
        {{ b.AddDt }}
      </li>
      <li>create new memo</li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
      AddDt: new Date(),
      children: []
    }
  },
  mounted () {
    // import data from stolage to this.children
    this.children.push({
      value: 'book title',
      AddDt: new Date(),
      children: []
    })
  },
  methods: {
    selectBook (id) {
      this.$emit('selectBook', this.children[id]);
    }
  }
}
</script>
