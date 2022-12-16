<template>
  <div class="rewrite-area" :class="{'opacirt-bg': isOpacityBg }">
      <slot></slot>
  </div>
</template>

<script>
export default {
    props: {
        isOpacityBg: {
            type: Boolean,
            default: false
        }
    },
    name: "rewrite-area",
    data(){
        return {

        }
    },

}
</script>
<style lang="less" scoped>
.rewrite-area{
    background: #FCFBFE;
    border: 1px solid #F2F2F2;
    border-radius: 4px;
    padding: 8px 11px;
}
.opacirt-bg{
    background: none;
    border: 0 none;
}
</style>