<template>
  <Input v-model="discountValue" :placeholder="placeholder" type="number" style="width: 100px;"/>
</template>

<script>
export default {
  props: ['value', 'rowData'],
  data () {
    return {
      placeholder: ''
    }
  },
  computed: {
    discountValue: {
      get () {
        let result;
        let valueCol = this.rowData.get_products.map(item => item.discountPrice);
        let max = valueCol.length && Math.max(...valueCol) || 0;
        let min = valueCol.length && Math.min(...valueCol) || 0;
        if (max === min) {
          result = min;
          this.placeholder = `${min}`;
        } else {
          result = '';
          this.placeholder = `${min}-${max}`;
        }
        return result;
      },
      set (val) {
        this.$emit('set-discount-value', Number(val));
      }
    }
  }
}
</script>

<style>

</style>
