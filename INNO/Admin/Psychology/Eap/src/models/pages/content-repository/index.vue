<template>
  <hold-layout isFullHeight>
    <materialView
      ref="materialView"
      type="video"
      :isShowTabs="true" 
      :isShowClassify="false" 
      fromType="contentRepository"></materialView> 
  </hold-layout>
</template>

<script>
import materialView from '@/components/view-components/material-view/index.vue';  
  export default {
    components: {
      materialView,
    },
    methods: {
      
    },
  }
</script>

<style lang="less" scoped>
</style>