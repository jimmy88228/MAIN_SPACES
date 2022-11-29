<template>
  <div @click="changeItem" class="material-list-item pointer" :class="[isLongStyleType?'long-type':'normal-type', type + '-material-list', { 'disabled': disabled }]">
    <div class="img-box reletive" :title="item.title" :class="{ init: !item.cover_pic}">
      <img v-if="item.cover_pic" :src="item.cover_pic" alt="" class="img-cover" />
      <div class="default-box flex-c-c" v-if="!item.cover_pic && isLongStyleType">
        <img class="img-default" :src="DefaultImg[type]" alt="" v-if="DefaultImg[type]">
      </div>
      <div v-if="isLongStyleType" class="text-flow">{{item.title}}</div>
      <div class="dist-label" v-if="(target_id == item.target_id || item.get_distribution_count == 1) && distribute">已分配</div>
    </div> 
    <div v-if="!isLongStyleType" class="title text-flow">{{ item.title }}</div>
    <div class="check-box" v-if="isSelect">
      <div class="check"></div>
    </div>
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
    isSelect: Boolean,
    target_id: Number | String,
    distribute: Number | String,
    disabled: Boolean
  },
  computed:{
    isLongStyleType(){
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
    changeItem() {
      this.$emit('changeItem', this.index, this.item);
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
    width: 200px;
    margin: 10px 5px;
    padding: 10px;
    border-radius: 6px;
    background-color:#fff;
    box-shadow: 0px 0px 10px #efefef;
    &.normal-type{
      &:nth-child(4n){
        margin-right: 0;
      }
    }
    &.long-type{
      width: 230px;
      &:nth-child(3n){
        margin-right: 0;
      }
      .img-box{
        height: 60px;
        display: flex;
        align-items: center;
        background: none;
      }
      .img-cover{
        position: static;
        width: 60px;
        height: 60px;
        transform: unset;
        margin-right: 5px;
        flex-shrink: 0;
      }
    }
  }
  .material-list-item:hover{
    box-shadow: 0px 0px 10px #ccc;
  }
  
  .img-box{
    position: relative;
    width: 100%;
    height: 128px;
    border-radius: 2px;
    overflow: hidden;
    background-color:#efefef;
    &.init{
      background: #EFEFEF;
    }
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
    display: block;
    position: absolute;
    top: 50%;
    left:50%;
    transform: translate(-50%, -50%);
    width: 100%;
    flex-shrink: 0;
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
  .exam-material-list{
    width: 100%;
    padding: 20px;
    padding-left: 40px;
    background-color:#F7F7F7;
    box-shadow: 0px 0px 5px #e4e4e4;
    .img-box{
      display: none;
    }
    .title{
      margin: 0px;
    }
  }
  .material-list-item.disabled{
    .check-box{
      background: rgba(218, 234, 241, 0.5);
    }
    .check{
      background:#cecece;
    }
  }
  .material-list-item.disabled::after{
    content: "";
    width:100%;
    height:100%;
    position:absolute;
    top:0px;
    left:0px;
    background-color:#999;
    display: block;
    opacity: 0.2;
  }
</style>