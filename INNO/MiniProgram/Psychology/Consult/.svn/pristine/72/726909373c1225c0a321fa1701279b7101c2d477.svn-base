<template>
  <view class="tree-hole-record flex-s-s flex-col">
    <page-nav></page-nav>
    <view class="header flex-s-c">
      <image :src="setStaticAddress('/tree-hole/hug.png')" mode="aspectFit" class="img-hug" />
      <view class="hug-box flex-e-s flex-col flex-1">
        <view class="hug p-t-20">
          <span style="padding-right:33rpx;">收获拥抱</span>
          <span class="font-32 bold">{{hugCount}}</span>
        </view>
        <swiper 
            class="swiper-box" 
            :current-item-id="index" 
            :circular="circular" 
            :vertical="vertical" 
            :autoplay="autoplay" 
            :interval="interval" 
            :duration="duration" 
            @change="toogle">
            <block v-for="(item,index) in carousel_list" :key="index">
                <swiper-item v-if="carousel_list.length>0" @touchmove.stop="noAction" class="swiper-item">
                    <view class="top-content" :style="currentSwiper==index?opacity_1:opacity_0">
                        <view class="text text-overflow-2"><span class="C_333 p-r-10" style="opacity:0.3;">TA们说:"</span>{{item}}</view>
                    </view>
                </swiper-item>
            </block>
        </swiper>
      </view>
    </view>
    <view class="box">
      <view class="title-box">
        <view class="title">倾述记录</view>
        <view class="tip">记录只保留{{expire_timeStr}},&nbsp;{{expire_timeStr}}后系统自动销毁</view>
      </view>
    </view>
    <view class="box flex1" style="overflow: hidden;">
      <scroll-view class="list-box" :scroll-y="true" @scrolltolower="scrolltolower">
        <view class="list">
          <view class="list-item" v-for="(item,index) in list" :key="index">
            <view v-if="item.type == 'text' && item.isExpired != 1" class="title p-b-20 font-28 w-break">{{item.content}}</view>
            <view v-if="item.type == 'voice' && item.isExpired != 1" :class="{anim:audioPlaying&&curIndex==index}" class="voice flex-s-c" @click="getVoice(item.content,index)">
              <image :src="setStaticAddress('/tree-hole/voice.png')" mode="aspectFit" class="img-voice" />
            </view>
            <view class="msg-box">
              <view class="time">
                <span class="p-r-20">{{item.createTime}}</span>
                <span class="C_7f">
                  {{item.isExpired == 1?'已销毁': getTime(item.distanceEndTime||0) + '后销毁'}}
                </span>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  import DateUtil from "@/common/support/utils/date-util.js";
  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        currentSwiper:0,
        interval: 3000,
        autoplay: true,
        vertical: true,
        duration: 3000,
        circular: true,
        opacity_0: "opacity:0;transition: all 1000ms ease-in-out;",
        opacity_1: "opacity:1;transition: opacity 400ms ease-in-out 1000ms;",
        carousel_list:[],
        list:[],
        pageIndex:1,
        pageSize:app.Conf.PAGE_SIZE,
        hugInfo:{},
        hasMore:true,
        isLoading:false,
        audioContext:null,
        audioPlaying:false,
        curIndex:-1,
        hugCount:0,
        expire_timeStr: ''
      }
    },
    components: {
    },
    onLoad(){
      this.init();
    },
    onUnload(){
      this.unListen();
    },
    methods: { 
      getTime(data){
        if(data<=60){
          return '1分钟';
        }else{
          let format = data > (60 * 60) ? 'HH小时mm分钟' : 'mm分钟';
          return DateUtil.spanFormat(Number(data) * 1000, format);
        }
      },
      pause(){
        this.audioContext&&this.audioContext.pause&&this.audioContext.pause();
      },
      stop(){
        this.audioContext&&this.audioContext.stop&&this.audioContext.stop();
      },
      unListen(){
        if(this.audioContext.offPlay){
          this.audioContext.offPlay();
          this.audioContext.offError();
          this.audioContext.offStop();
          this.audioContext.offPause();
          this.audioContext.offEnded(); 
        }
      },
      init(){
        this.audioContext = wx.createInnerAudioContext();
        this.audioContext.onPlay(() => {
          console.log('开始播放');
          this.audioPlaying = true;
        })
        this.audioContext.onError((res) => {
          console.log('onError',res)
          this.audioPlaying = false;
        })
        this.audioContext.onStop((res) => {
          console.log('onStop',res);
          this.audioPlaying = false;
        })
        this.audioContext.onPause((res) => {
          console.log('onPause',res)
          this.audioPlaying = false;
        }) 
        this.audioContext.onEnded((res) => {
          console.log('onEnded',res)
          this.audioPlaying = false;
        });
        app.Sysm.getSysConfReq('tree_hole_expire_time').then(data=>{
          this.expire_timeStr = data > 60 ? parseInt(Number(data) / 60) + '小时' : data + '分钟'
        })
        this.getList();
        this.getHugInfo();
      },
      toogle(e) {
        this.currentSwiper = e.detail.current
      },
      getList(){ 
        if(this.isLoading)return
        this.isLoading = true;
        return this.$Http(this.$Apis.selectPourOutListByPage,{
          data:{
            pageIndex:this.pageIndex,
            pageSize:this.pageSize,
          }
        }).then(res=>{
          if(res.code == 1){
            let data = res.data||{};
            this.list = this.list.concat(data.list||[]);
            this.hasMore = this.pageIndex*this.pageSize < data.totalCount;
            this.pageIndex+=1;
          }
          return res;
        }).finally(()=>{
            this.isLoading = false;
        })
      }, 
      getHugInfo(){
        return this.$Http(this.$Apis.getHugInfo, {
          data:{}
        }).then(res=>{
          if(res.code == 1){
            let data = res.data||{};
            this.hugCount = data.hubCount||0;
            this.carousel_list = data.hugContent||[];
          }
          return res;
        })
      },
      scrolltolower(){
        if(this.hasMore)this.getList();
      },
      getVoice(src="",index){
        if(index == this.curIndex && this.audioPlaying){
          this.pause();
          return
        }
        let audioContext = this.audioContext||{};
        // let src = this.$Apis.getVoice + '?id=' + id; 
        this.audioPlaying = false;
        this.curIndex = index;
        audioContext.src = src;
        audioContext.play();
        console.log('srcsrc',src);
      },

    },
  })
  export default pageOption
</script>

<style lang="scss">
page{
  height: 100%;
}
</style>

<style lang="scss" scoped> 
.tree-hole-record{
  background: #F3F7F8;
  height: 100%;
  .box{
    padding:0 35rpx;
    box-sizing: border-box;
  }
  .header{
    height: 220rpx;
    border-radius: 0 0 50rpx 50rpx;
    box-shadow: 0px 4px 26px 0px rgba(23,164,255,0.1100);
    padding-left: 46rpx;
    box-sizing: border-box;
    background: #fff;
  }
  .img-hug{
    width: 162rpx;
    height: 145rpx;
  }
  .hug-box{
    padding-left: 20rpx;
    box-sizing: border-box;
    // align-self: flex-end;
  }
  .hug{
    // padding-top: 30rpx;
  }
  .title-box{
    padding-top: 70rpx;
    padding-bottom: 15rpx;
    .title{
      font-size: 32rpx;
      font-weight: bold;
    }
  }
  .title{
    font-size: 28rpx;
  }
  .voice{
    width: 310rpx;
    height: 55rpx;
    background: #00AAFD;
    border-radius: 8rpx;
    border: 1px solid #0098E2;
    margin-bottom: 20rpx;
    &.anim{
      animation: voiceAnim 1s linear infinite;
    }
  }
  @keyframes voiceAnim {
    0%{
      opacity: 1;
    }
    50%{
      opacity: 0.5;
    }
    100%{
      opacity: 1;
    }
  }
  .tip{
    font-size: 20rpx;
    color: #ADABAB;
    padding-top: 18rpx;
    padding-bottom: 45rpx;
  }
  .list-box{
    height: 100%;
  } 
  .list{
    padding-bottom: 30rpx;
    box-sizing: border-box;
  }
  .list-item{
    border-radius: 20rpx;
    background: #fff;
    border: 1px solid rgba($color:#D4E4E8, $alpha: 0.8);
    box-sizing: border-box;
    padding: 40rpx;
    font-size: 18rpx;
    margin-bottom: 20rpx;
    &:last-child{
      margin-bottom: 0;
    }
  }
  .time{
    color: #B7B7B7;
  }
  
  .swiper-box {
    width: 90%; 
    height: 100rpx;
    margin-top: 10rpx;
  } 
  
  .top-content {
    font-size: 18rpx;
    color: #439C00;
    min-height: 42rpx;
    display: flex;
    align-items: center;
    position: relative;
    background: #F4FFF2;
    border-radius: 26rpx;
    box-sizing: border-box;
    padding: 8rpx 20rpx 8rpx 26rpx;
    margin-top: 15rpx;
  }
  .img-voice{
    width: 55rpx;
    height: 55rpx;
    margin-left: 18rpx;
  }
}
</style>