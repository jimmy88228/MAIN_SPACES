<template>
  <Checkbox v-model="colorCheck" :indeterminate="indeterminate"></Checkbox>
</template>

<script>
export default {
  props: {
    checked: Boolean,
    indeterminate: Boolean,
    isMulti: Boolean,
    data: Array,
    curData: Object
  },
  inject: ['root'],
  computed: {
    colorCheck: {
      get() {
        let multiCheck = false;
        if (this.isMulti) {
          let colorId = this.curData.color_id;
          let curColor = this.data.filter(item => item.color_id === colorId);
          let selectedLen = curColor.filter(item => item._sizeChecked).length;
          let {checked, indeterminate} = this.root.handleCheckStatus(curColor.length, selectedLen);
          multiCheck = checked;
          this.$emit('color-indeterminate', indeterminate);
        }
        return this.checked || multiCheck;
      },
      set (val) {
        this.$emit('color-check-change', val);
      }
    }
  }
}
</script>

<style>

</style>
