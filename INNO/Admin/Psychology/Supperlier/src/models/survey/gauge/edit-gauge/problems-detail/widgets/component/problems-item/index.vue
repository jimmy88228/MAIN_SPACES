<template>
  <div class="item-info" :class="{'img-item-info': itemInfo.picture, 'editing-box': isEdit}">
    <div class="item-title-area" >
        <div class="item-title-img" :class="{ 'm-b-15':  isEdit && !itemInfo.question}" v-bgStyle v-if="itemInfo.picture" :style="'background-image:url(' + itemInfo.picture + ');'"></div>
        <div class="item-title " v-if="itemInfo.question || (!itemInfo.question && !itemInfo.picture)">
          <p class="item-title-txt bold w-break">{{itemInfo.question || (itemInfo.picture ? '' : '题目标题')}}</p>
          <template>
            <span class="inline-b under-line C_b2 fs-12 m-t-5" v-if="!dimensionsName">未设置维度</span>
            <a class="inline-b under-line fs-12 m-t-5" v-else>{{dimensionsName}}</a>
          </template>
        </div>
    </div>
    <div class="item-options text-flow2" :class=" hasOptionsImg ? 'img-item-options' : '' " v-if="!isEdit && (itemInfo.option_data && itemInfo.option_data.length > 0)">
      <div class="option-item text-flow2" v-for="(item, index) in itemInfo.option_data" :key="index">
        <div class="option-item-img" v-bgStyle v-if="hasOptionsImg" :style="'background-image:url(' + item.option_picture + ');'"></div>
        <div class="option-item-title text-flow2" v-if="item.option_content">{{item.option_content}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isEdit: Boolean,
    itemInfo:{
      type: Object,
      default(){
        return {}
      }
    }
  },
  computed:{
    hasOptionsImg(){
      let itemInfo = this.itemInfo || {};
      let hasOptionsImg = false;
      if(itemInfo.option_data && itemInfo.option_data instanceof Array){
        for(let i = 0; i < itemInfo.option_data.length; i++){
          let item = itemInfo.option_data[i] || {};
          if(item.option_picture){
            hasOptionsImg = true;
            break;
          }
        }
      }
      return hasOptionsImg;
    },
    dimensionsName(){
      let itemInfo = this.itemInfo || {};
      let dimensionsData = itemInfo.dimensionsData || []
      let names = [];
      for(let i = 0; i < dimensionsData.length; i++){
        if(dimensionsData[i].id && dimensionsData[i].id != 0 && dimensionsData[i].name){
          names.push(dimensionsData[i].name)
        }
      }
      return names.join(", ")
    }
  },
  data(){
    return {

    }
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
.item-info{
  padding: 12px 8px;
  transition: padding .35s;
}
.img-item-info{
  padding: 0px;
}

.item-title-img{
  width:100%;
  height: 135px;
  display: block;
  background-color:#F7F7F7;
  background-size: 100% auto;
  background-position: left top;
  background-repeat: no-repeat;
}
.item-title{
  padding: 12px 5px 12px 20px;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: hsl(0, 0%, 20%);
  line-height: 20px;
  background: #F8F8F8;
  border-radius: 6px;
  min-height: 44px;
}
.item-title-txt{

}
.item-options{
  padding: 8px 8px 10px 17px;
}
.option-item{
  // min-height: 30px;
  flex-shrink: 0;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 30px;
  width: 100%;
  padding: 0px 5px;
}
.option-item-title{
  padding: 5px 5px 0px 5px;
  line-height: 20px;
}
.img-item-options{
  padding: 10px 0px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .option-item{
    width: 50%;
    margin-bottom: 10px;
  }
  .option-item-img{
    width: 100%;
    height: 87px;
    background:#F7F4F8;
    background-size: 100% auto;
    background-position: left top;
    background-repeat: no-repeat;
  }
}
.editing-box{
  padding: 0px;
  .item-title{
    padding-right: 80px;
  }
  .item-title-area{
    background-color:#F8F8F8;
    overflow: hidden;
  }
  .item-title-img{
    width: 92px;
    height: 46px;
    display: block;
    background: #D8D8D8;
    border-radius: 2px;
    margin-top: 15px;
    margin-left: 20px;
  }
}
</style>