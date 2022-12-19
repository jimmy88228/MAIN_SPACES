<template>
  <div class="v-bar-box" v-bar>
    <div class="material-list-box flex flex-wrap">
      <materialItem :type="type" :fromType="fromType" @selectItem="selectItem" v-for="(item, index) in list" :key="item.id" :index="index" :item="item" :selected="ids.indexOf(item.id) != -1" :disabled="disabledIds.indexOf(item.id) != -1"></materialItem>
    </div>
  </div>
</template>

<script>
import materialItem from "@/components/view-components/material-view/material-item.vue";
export default {
  components: {
    materialItem,
  },
  props: {
    type:{
      type:String,
      default:"",
    },
    fromType:{
      type:String,
      default:"",
    },
    list: {
      type: Array,
      default: function() {
        return []
      }
    },
    chooseData: {
      type: Array,
      default: function () {
        return []
      }
    },
    ids: {
      type: Array,
      default: function () {
        return []
      }
    },
    disabledIds: {
      type: Array,
      default: function() {
        return []
      }
    },
  },
  data() {
    return {
    }
  },
  methods: { 
    selectItem(index,item) {
      this.$emit('selectItem',index,item)
    }

  },
};
</script>

<style lang="less" scoped>
.v-bar-box{
    height: 100%;
  }
  .material-list-item{
    position: relative;
    width: 182px;
    margin-right: 12px;
    // &:nth-child(4n){
    //   margin-right: 0;
    // }
  }
  .img-box{
    position: relative;
    width: 100%;
    height: 136px;
    border-radius: 2px;
    overflow: hidden;
    &.init{
      background: #EFEFEF;
    }
  }
  .img-cover{
    width: 100%;
    height: 100%;
  }
  .title{
    margin-top: 12px;
    width: 100%;
    white-space: pre;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
  }
  .check-box{
    position: absolute;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(213,241,255,0.5);
    z-index: 1;
  }
  .check{
    position: absolute;
    left: 10px;
    top: 10px;
    width: 20px;
    height: 20px;
    border-right: 2px;
    background: #008ACB;
    display: flex;
    justify-content: center;
    align-items: center;
    &::after{
      content: "";
      width: 70%;
      height: 6px;
      border-left: 2px solid #fff;
      border-bottom: 2px solid #fff;
      transform: rotate(-45deg);
      z-index: 2;
      margin-top: -2px;
    }
  }
  .dist-label{
    position: absolute;
    right: 0;
    top: 0;
    background: rgba(23, 23, 23, 0.6);
    color: #fff;
    padding: 0 5px; 
    font-size: 13px;
  }
</style>