<template>
  <frame-box :showPage="mixShowPage">
    <template v-slot:body>
      <page-nav></page-nav>
      <view class="exam-record">
        <view class="exam-title">{{info.modelName}}</view>
        <view class="exam-mark-box flex-c-c flex-col">
          <view class="mark" :class="{flunk:info.currentStatus==0}">{{info.currentMark||0}}</view>
          <view class="exam-tips">当前得分（{{info.currentStatus==1?'已':'未'}}达标）</view>
        </view>
        <view class="exam-msg-box C_7f">
          <view class="exam-score p-b-20">
            <span>测验总分</span><span class="p-l-20">{{info.totalMark||0}}分</span><span>（达标分数{{info.passMark||0}}）</span>
          </view>
          <view class="exam-question p-b-20"><span>题目数量</span><span class="p-l-20">{{info.questionCount||0}}</span></view>
          <view v-if="info.totalSubmitCount>0"><span>提交次数</span><span class="p-l-20">{{info.details && info.details.length||0}}/{{info.totalSubmitCount||0}}</span></view>
        </view>
        <view class="exam-btn flex-c-c" @click="reExam">
          {{info.inProcess == 1?'继续答题':'重新测验'}}
        </view>
        <view class="exam-record-list-box">
          <view class="exam-list-title C_7f">测验记录</view>
          <view class="exam-record-list">
            <view class="exam-record-item flex-b-c" v-for="(item,index) in info.details" :key="index">
              <view class="record-item-msg">
                <view class="record-item-mark">{{item.points||0}}分</view>
                <view class="record-item-time">{{item.finishTime||''}}</view>
              </view>
              <view class="record-item-btn flex-c-c" @click="check(item)">查看答卷</view>
            </view>
          </view>
        </view>
      </view>
    </template>
  </frame-box>
</template>

<script>
  import SMH from "@/common/helper/show-msg-handler.js"

  const app = getApp();
  const pageOption = Page.BasePage({
    components: {},
    data(){
      return{
        info:{
          details:[{},{}]
        }
      }
    },
    methods: {
      loadData(){
        return this.$Http(this.$Apis.getCourseExamRecordInfo, {
          data: {
            activityId: this.options.activityId || 0,
            contentId : this.options.contentId  || 0
          },
        }).then(res=>{
          if(res.code){
            let data = res.data||{};
            data.currentStatus = data.currentMark>=data.passMark?1:0;            
            this.info = data;
          }
        }).finally(()=>{
          this.mixShowPage = true;
        })
      },
      reExam(){
        let info = this.info;
        if(info.details.length >= info.totalSubmitCount && info.totalSubmitCount != 0){
          SMH.showToast({
            title:"答题次数已到达上限"
          })
          return
        }
        this.jumpAction(`/pages/activities/exam/answer/answer?activityId=${this.options.activityId||0}&contentId=${this.options.contentId||0}&courseId=${this.options.courseId||0}&modelId=${this.options.modelId||0}&comeFrom=record`)
      },
      check(e){
        this.jumpAction(`/pages/activities/exam/answer/check-scores?activityId=${this.options.activityId||0}&examRecordId=${e.examRecordId||0}`)
      },
    },
    onLoad(options){
      this.options = options;
    },
    onShow(){
      this.loadData();
    }
  })
  export default pageOption
</script>

<style lang="scss" scoped>
.exam-record{
  padding: 30rpx;
  box-sizing: border-box;
  font-size: 26rpx;
  .exam-title{
    padding-bottom: 40rpx;
  }
  .exam-mark-box{
    min-height: 262rpx;
    width: 100%;
    border-radius: 10rpx;
    background: rgba(216,216,216,0.1);
    border:1px solid rgba(151,151,151,0.1);
  }
  .mark{
    color: $uni-main-color;
    font-size: 110rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    line-height: 154rpx;
    &.flunk{
      color: #F0570F;
    }
  }
  .exam-tips{
    font-size: 24rpx;
    color: #7f7f7f;
  }
  .exam-msg-box{
    margin:46rpx 0
  }
  .exam-btn{
    width: 100%;
    height:110rpx;
    font-size: 32rpx;
    border: 1px solid $uni-main-color;
    color: $uni-main-color;
    border-radius: 10rpx; 
  }
  .exam-record-list-box{
    margin-top: 60rpx;
    box-shadow: 0 -20rpx 10rpx 0px rgba(125, 125, 125, 0.04);
  }
  .exam-list-title{
    padding-top: 70rpx;
    padding-bottom: 30rpx;
    font-size: 28rpx;
  }
  .exam-record-item{
    height: 140rpx;
    border-bottom: 1px solid #F0F0F0;
    box-sizing: border-box;
    &:first-child{
      border-top: 1px solid #F0F0F0;
    }
  }
  .record-item-mark{
    font-size: 28rpx;
  }
  .record-item-time{
    font-size: 20rpx;
    color: #B2B2B2;
  }
  .record-item-btn{
    background-color: #dfebf1;
    color: $uni-main-color;
    border-radius: 8rpx;
    width: 150rpx;
    height: 66rpx;
  }
}
</style>