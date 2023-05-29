<template>
  <div class="rewrite-area" :style="customStyle">
      <slot></slot>
  </div>
</template>

<script>
export default {
    name: "rewrite-area",
    props: {
        customStyle: String
    },
    data(){
        return {

        }
    },

}
</script>
<style lang="less" scoped>
.rewrite-area{
    width:100%;
    background: #FBFBFB;
    border: 1px solid #F2F2F2;
    border-radius: 4px;
    padding: 8px 11px;
}
</style>