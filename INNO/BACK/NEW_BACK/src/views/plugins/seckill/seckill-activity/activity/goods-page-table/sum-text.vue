<template>
  <p>{{sumText}}</p>
</template>

<script>
export default {
  props: ['value', 'rowData', 'type'],
  computed: {
    sumText() {
      let sum = this.rowData.get_products.map(item => +item[this.type]).reduce((acc, item) => acc + item, 0);
      return sum;
    }
  }
}
</script>

<style>

</style>
