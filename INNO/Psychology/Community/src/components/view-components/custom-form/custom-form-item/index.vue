<template>
  <FormItem :class="['custom-form-item','inline-block',tipType]" :label="label" :prop="prop" :rules="rules">
    <slot></slot>
  </FormItem>
</template>

<script>
  export default {
    name: 'customFormItem',
    props: {
      label: {
        type: String,
        default: ''
      },
      prop: {
        type: String,
        default: ''
      },
      'tip-type': {
        type: String,
        default: 'bottom'
      },
      rules:{
        type: Object|Array,
        default: function(){
          return {}
        }
      }
    },
  }
</script>

<style lang="less">
.custom-form-item{
  &.right{
    .ivu-form-item-error-tip{
      position: absolute;
      top: 50%;
      left: 100%;
      line-height: 1; 
      color: #ed4014;
      word-break: break-all;
      white-space: nowrap;
      transform: translateY(-50%);
      padding-top: 0;
    }
  }
}
</style>