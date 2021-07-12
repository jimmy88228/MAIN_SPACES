<template>
  <p><slot name="before"></slot>{{priceValue}}</p>
</template>

<script>
export default {
  props: ['value', 'rowData', 'type'],
  computed: {
    priceValue () {
      let result;
      let valueCol = this.rowData.get_products.map(item => item[this.type]);
      let max = valueCol.length && Math.max(...valueCol) || 0;
      let min = valueCol.length && Math.min(...valueCol) || 0;
      if (max === min) {
        result = min;
      } else {
        result = `${min}-${max}`;
      }
      return result;
    }
  }
}
</script>

<style>

</style>
