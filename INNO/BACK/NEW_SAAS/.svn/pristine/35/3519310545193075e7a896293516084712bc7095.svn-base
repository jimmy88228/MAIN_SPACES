<template>
  <div>
    <i-switch :true-value="1" :false-value="0" v-model="isEnabled">
      <span slot="open">是</span>
      <span slot="close">否</span>
    </i-switch>
  </div>
</template>

<script>
export default {
  props: ['row'],
  computed: {
    isEnabled: {
      get () {
        return this.row.get_products.some(item => !!item.enable) ? 1 : 0;
      },
      set (val) {
        this.$emit('get-val', val);
      }
    }
  }
}
</script>

<style>

</style>
