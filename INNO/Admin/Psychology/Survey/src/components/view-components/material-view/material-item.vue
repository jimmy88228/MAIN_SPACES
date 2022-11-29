<template>
  <div @click="selectItem" class="material-list-item pointer" :class="[isLongStyleType?'long-type':'normal-type']">
    <div class="img-box reletive" :class="{ init: !item.cover }">
      <img v-if="item.cover" :src="item.cover" alt="" class="img-cover" />
      <div class="default-box flex-c-c" v-if="!item.cover && isLongStyleType">
        <img class="img-default" :src="DefaultImg[type]" alt="" v-if="DefaultImg[type]">
      </div>
      <div class="title-box m-l-10" v-if="isLongStyleType">
        <div class="title">{{item.title}}</div>
         <div v-if="fromType == 'contentRepository'" class="tip-box m-t-10 C_7f">
          <div class="flex-s-c">
            <span class="tip-title">来源</span>
            <span class="text-flow">{{item.supplierName}}</span>
          </div>
          <div class="m-t-5 flex-s-c flex-wrap">
            <span class="tip-title belong">所属</span>
            <Tag color="blue" v-for="(item,index) in item.structure_names" :key="index">{{item}}</Tag>
          </div>
        </div>
        <div v-else class="duration m-t-10">{{item.duration_str||""}}</div>
      </div>
      <div class="check-box" v-if="item._selected">
        <div class="check"></div>
      </div>
      <div class="dist-label" v-if="item.isDistribute == 1">已分配</div>
    </div> 
    <template v-if="!isLongStyleType">
      <div class="title m-t-10">{{ item.title }}</div>
      <div v-if="fromType == 'contentRepository'" class="tip-box m-t-10 C_7f">
        <div class="flex-s-c">
          <span class="C_B2 tip-title">来源</span>
          <span class="text-flow">{{item.supplierName}}</span>
        </div>
        <div class="m-t-5 flex-s-c flex-wrap">
          <span class="C_B2 tip-title belong">所属</span>
          <Tag color="blue" v-for="(item,index) in item.structure_names" :key="index">{{item}}</Tag>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import dfAudioImg from "@/assets/images/custom/audio.png"
export default {
  props: {
    item: {
      type: Object,
      default: function() {
        return {}
      }
    },
    index:{
      type:Number,
      default:0
    },
    type:{
      type:String,
      default:""
    },
    fromType:{
      type:String,
      default:""
    }
  },
  computed:{
    isLongStyleType(){
      console.log('isLongStyleType',this.type)
      return this.type == 'audio';
    }
  },
  data() {
    return {
      DefaultImg: {
        "audio":dfAudioImg
      }
    }
  },
  methods: {
    selectItem() {
      console.log('selectItem emit',this.index,this.item);
      this.$emit('selectItem',this.index,this.item)
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
    margin-bottom: 30px;
    // &.normal-type{
    //   &:nth-child(4n){
    //     margin-right: 0;
    //   }
    // }
    &.long-type{
      width: 230px;
      // &:nth-child(3n){
      //   margin-right: 0;
      // }
      .img-box{
        min-height: 80px;
        height: auto;
        padding: 10px;
        display: flex;
        align-items: center;
      }
      .img-cover{
        width: 60px;
        height: 60px;
      }
    }
  }
  .img-box{
    position: relative;
    width: 100%;
    height: 128px;
    border-radius: 2px;
    overflow: hidden;
    background: rgba(239, 239, 239, 0.5);
    // &.init{
    //   background: #EFEFEF;
    // }
  }
  .default-box{
    width: 60px;     
    height: 60px;
    background: #DDDDDD;
    margin-right: 16px;
  }
  .img-default{
    width: 30px;
    height: 30px;
  }
  .img-cover{
    width: 100%;
    height: 100%;
  }
  .title-box{
    overflow: hidden;
  }
  .title{
    // margin-top: 12px;
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
  .duration{
    font-size: 11px;
    color: #B2B2B2;
  }
  .tip-box{
    font-size: 13px;
  }
  .belong{
    line-height: 26px;
  }
  .tip-title{
    margin-right: 5px;
    flex-shrink: 0;
  }
</style>