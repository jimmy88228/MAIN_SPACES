<template>
  <div class="rewrite-area">
      <slot></slot>
  </div>
</template>

<script>
export default {
    name: "rewrite-area",
    data(){
        return {

        }
    },

}
</script>
<style lang="less" scoped>
.rewrite-area{
    background: rgba(216,216,216,0.11);
    border: 1px solid #F2F2F2;
    border-radius: 4px;
    padding: 8px 11px;
}
</style>