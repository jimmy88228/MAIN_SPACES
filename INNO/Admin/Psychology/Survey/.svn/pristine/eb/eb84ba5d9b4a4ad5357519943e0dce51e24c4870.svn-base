<template>
  <div class="custom-form">
    <Form ref="formValidate" :model="model" :rules="rules" :label-width="labelWidth" v-friendly-errors>
      <slot></slot>
    </Form>
  </div>
</template>

<script>
  export default {
    name: 'customForm',
    props: {
      model: {
        type: Object,
        default: function(){
          return {};
        }
      },
      rules: {
        type: Object,
        default: function(){
          return {};
        }
      },
      'label-width':{
        type: Number,
        default: 140
      },
      'v-friendly-errors':{
        type:Boolean,
        default:true
      }
    },
  }
</script>

<style lang="less" scoped>

</style>