<template>
  <Checkbox v-model="sizeCheck"></Checkbox>
</template>

<script>
export default {
  props: {
    checked: Boolean
  },
  computed: {
    sizeCheck: {
      get() {
        return this.checked;
      },
      set (val) {
        this.$emit('size-check-change', val);
      }
    }
  }
}
</script>

<style>

</style>
