<!-- extend ： template,mount,el  -->
<template>
  <div>
    <div id="template"></div>
    <div id="template2"></div>
  </div>
</template>

<script>
import Vue from 'vue'
var _template = `<div>哈哈哈template模板1</div>`;
var _template2 = `<div>哈哈哈template模板2</div>`;
export default {
  mounted() {
    new Vue({
      template: _template    //挂载到template  //无render, 要template
    }).$mount("#template");  //无el 要$mount

    new Vue({                //挂载到template2 //无render, 要template
      el:'#template2',       //有el 不用$mount
      template: _template2
    });  
  }
};
</script>

<style lang="less" scoped>
</style>