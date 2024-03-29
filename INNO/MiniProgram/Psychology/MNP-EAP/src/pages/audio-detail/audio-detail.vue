<template>
  <view>
    <view v-if="!showLoading" class="audio-detail-page" :style="{'background-color':backgroundColor}">
      <page-nav :isTransparent="!showTitleText" full="false" :mode="pageNavMode" :isCatch="isCatch" @navClick="navClick">
        <view v-if="showTitleText" slot="title">{{showTitleText}}</view>
      </page-nav>
      <template v-if="audioDetail.audioUrl">
        <view class="background-container">
          <image @load="getBgSize" :style="{height:bgHeight,width:bgWidth}" v-if="audioDetail.audioBgPic"
            class="audio-detail-background" :src="audioDetail.audioBgPic" @error="backgroundError" />
        </view>
        <view class="cover-background" :style="{ 'background-image': `url(${audioDetail.audioCoverPic})` }"
          v-if="!audioDetail.audioBgPic"></view>
        <view class="audio-detail-title clamp2" :class="audioDetail.audioBgPic ? 'C_fff' : 'C_33'" :style="titleStyle">
          {{ audioDetail.audioTitle ? audioDetail.audioTitle : "" }}</view>
        <image v-if="!audioDetail.audioBgPic" class="audio-detail-cover" :src="audioDetail.audioCoverPic"
          @error="coverError" mode="scaleToFill" />
        <image class="audio-loop" :src="loopIcon" mode="scaleToFill" @click="setLoop" />
        <image class="audio-status" :src="audioIcon" mode="scaleToFill" @click="changeStatus" />
        <image class="audio-timer" :src="timingIcon" mode="scaleToFill" @click="setTimer" />
        <view class="audio-detail-progress">
          <view class="font-22" :class="audioDetail.audioBgPic ? 'C_fff' : 'C_B2'">{{ time }}</view>
          <slider :value="playJd" :disabled="sliderDisable" @change="sliderChange" :activeColor="activeColor"
            backgroundColor="rgba(216, 216, 216, 0.5)" :max="sliderMax" />
          <view class="font-22" :class="audioDetail.audioBgPic ? 'C_fff' : 'C_B2'">
            {{ audioDetail.duration_str || "00:00" }}
          </view>
        </view>
      </template>
      <template v-else>
        <empty>暂无内容噢～</empty>
      </template>
    </view>
    <view v-else class="audio-detail-page flex-c-c">
      <loading-view></loading-view>
    </view>
    <ori-popup class="W100" @touchmove.stop.prevent="disabledScroll" ref="popup" type="bottom" :is-mask-click="false" :safe-area="false">
      <template v-slot:content>
        <view class="timer-box flex-s-c flex-col" :style="'padding-top:'+navPlace+'px;'">
          <view class="timer-item flex-b-c" v-for="(item,index) in timerSelArr.normal" :key="index" @click="selectTime('normal',item)">
            <view>{{item==0?'不开启':item+'分钟后'}}</view>
            <view v-if="curSel.type=='normal' && curSel.normal == item" class="arrow"></view>
          </view>
          <ori-picker @click.stop="_noFn" class="W100" @pickerChange="pickerChange" range-key="name" :range="timerSelArr.custom" :pickerValue="curSel.custom" mode="multiSelector">
            <template v-slot:content>
              <view class="timer-item flex-b-c" @click="setTimer">
                <view>自定义</view>
                <view v-if="curSel.type=='custom'" class="arrow"></view>
              </view>
            </template>
          </ori-picker>
        </view>
      </template>
    </ori-popup>

  </view>
</template>

<script>
  import utils from '@/common/support/utils.js'
  import SMH from "@/common/helper/show-msg-handler";
  import LoadingView from '@/components/css3/loading/loading.vue';
  import UniApi from "@/common/support/tools/uni-api-promise.js";
  import oriPopup from "@/components/ori-comps/popup/ori-popup.vue"
  import oriPicker from "@/components/ori-comps/picker/ori-picker.vue"
  const app = getApp(); 
  const pageOption = Page.BasePage({
    data() {
      return {
        showLoading: true,
        bgWidth: 0,
        bgHeight: 0,
        audioPlayIcon: "/audio/play-white.png",
        audioPlayIconGrey: "/audio/play-grey.png",
        audioStopIcon: "/audio/stop-white.png",
        audioStopIconGrey: "/audio/stop-grey.png",
        audioLoopIcon: "/audio/loop-white.png",
        audioLoopIconGrey: "/audio/loop-grey.png",
        audioTimingIcon: "/audio/timing-white.png",
        audioTimingIconGrey: "/audio/timing-grey.png",
        audioLoopIconAc: "/audio/loop-active.png",
        audioTimingIconAc: "/audio/timing-active.png",

        options: {},
        audioDetail: {},
        sliderDisable: true,
        value: "0",
        sliderMax: "100",
        // 播放器实例
        bgAudioMannage: {},
        // 切换（播放/停止）按钮   true
        audioStatus: false,
        // 播放总时长
        duration: "00:00",
        // 当前已播放时长
        time: "00:00",
        // 当前播放进度
        playJd: 0,
        // 背景是否正常显示
        backgroundShow: true,
        // 封面是否正常显示
        coverShow: true,
        // 重置音频
        resetBgAudio: false,
        // timeSelArr:[0,10,20,30,60,90],
        timerSelArr:{
          normal:[0,10,20,30,60,90],
          custom:[[0,1,2,3,4,5,6],[0,5,10,15,20,25,30,35,40,45,50,55]],
        },
        curSel:{
          type:"normal",
          normal:0,
          custom:[0,0],
        },
        pageNavMode:"Close",
        isCatch:false,
        isTiming:false,
        isLooping:true,
        showTitleText:""
      };
    },
    components: {
      LoadingView,
      oriPopup,
      oriPicker
    },
    onLoad(options) {
      this.options = options;
      this.init();
      this.initTimerArr();
    },
    onReady() {
      this.getAudioDetail();
    },
    computed: {
      // 根据是否有背景换播放主题
      audioIcon() {
        let backgroundImage = this.audioDetail.audioBgPic;
        let audioPlayIcon = backgroundImage ?
          this.audioPlayIcon :
          this.audioPlayIconGrey;
        let audioStopIcon = backgroundImage ?
          this.audioStopIcon :
          this.audioStopIconGrey;
        return this.audioStatus ? this.staticAddress + audioPlayIcon : this.staticAddress + audioStopIcon;
      },
      loopIcon() {
        let backgroundImage = this.audioDetail.audioBgPic;
        let audioLoopIcon = backgroundImage ?
          this.audioLoopIcon :
          this.audioLoopIconGrey;
        let audioLoopIconAc = this.audioLoopIconAc;
        return this.isLooping ? this.staticAddress + audioLoopIconAc : this.staticAddress + audioLoopIcon;
      },
      timingIcon() {
        let backgroundImage = this.audioDetail.audioBgPic;
        let audioTimingIcon = backgroundImage ?
          this.audioTimingIcon :
          this.audioTimingIconGrey;
        let audioTimingIconAc = this.audioTimingIconAc;
        return this.isTiming ? this.staticAddress + audioTimingIconAc : this.staticAddress + audioTimingIcon;
      },
      titleStyle() {
        let backgroundImage = this.audioDetail.audioBgPic;
        let textShadow = backgroundImage ?
          "0px 2rpx 4rpx rgba(0, 0, 0, 0.5)" :
          "";
        let style = `text-shadow: ${textShadow}`;
        return style;
      },
      activeColor() {
        let backgroundImage = this.audioDetail.audioBgPic;
        let color = backgroundImage ? "#FFFFFF" : "#B1DBAE";
        return color;
      },
      backgroundColor() {
        let backgroundShow = this.backgroundShow;
        let coverShow = this.coverShow;
        let bgColor = !backgroundShow || !coverShow ? '#9AB9B2' : 'transparent'
        return bgColor
      }
    },
    methods: {
      initTimerArr(){
        let custom = this.timerSelArr.custom;
        custom[0] = custom[0].map(item=>{
          return {
            name:item+"小时",
            val:item
          }
        })
        custom[1] = custom[1].map(item=>{
          return {
            name:item+"分钟",
            val:item
          }
        })
        console.log('custom',custom)
      },
      init(type){
        let data = app.STH.get('AUDIO_TIMMING') || "";
        let setting = app.STH.get('AUDIO_SETTING') || {};
        this.isLooping = typeof(setting.isLooping) == 'boolean' ? setting.isLooping : true
        this.isTiming = !!data || false;
        if(this.isTiming){
          this.curSel = data;
        } 
        type == 'reset' && (this.curSel = {
          type:"normal",
          normal:0,
          custom:[0,0]
        });
         
      },
      getBgSize({
        detail
      }) {
         let width = detail.width;
        let height = detail.height;
        utils.getBgSize(width, height).then(res => {
          this.bgWidth = res.imgW + "px"
          this.bgHeight = res.imgH + "px"
          this.isLoadBg = true;
        })
      },
      getAudioDetail() { 
          return this.getInfo().then(data=>{
            let min = Math.floor(data.audioTimeLength / 60);
            let second = data.audioTimeLength % 60;
            console.log(min, second)
            data.duration_str = (min >= 10 ? min : "0" + min) + ":" + (second >= 10 ? second : "0" + second)
            this.audioDetail = data;
            this.initAudio();
          }).finally(()=>{
            this.showLoading = false
          })
      },
      getInfo(){
        let item = decodeURIComponent(this.options.item || '{}'),data={};
        item = JSON.parse(item);
        let id = parseInt(this.options.id||0);
        return new Promise((rs,rj)=>{
          if(id){
            return this.$Http(this.$Apis.getAudio, {
              data: {
                id
              },
            }).then((res) => {
              if (res.code == 1) {
                let data = res.data||{};
                rs(data)
              }else{
                rj(data);
              }
            })
          }else if(item.path){ 
            data = {
                audioUrl : item.path,
                audioTimeLength: item.time_length||0,
                audioTitle:item.title||"",
                audioCoverPic:item.cover||"", 
            }
            rs(data);
          }
        }) 
      },
      initAudio() {
        var that = this;
        //创建音频实例
        that.bgAudioMannage = uni.getBackgroundAudioManager();
        console.log(that.bgAudioMannage, "实例")
        //音频地址
        console.log(that.bgAudioMannage.src)
        // that.bgAudioMannage.src = this.audioDetail.audioUrl;
        // that.bgAudioMannage.src = "";
        if (that.bgAudioMannage.src != that.audioDetail.audioUrl || that.bgAudioMannage.paused) {
          that.bgAudioMannage.title = that.audioDetail.audioTitle;
          that.bgAudioMannage.singer = '暂无';
          that.bgAudioMannage.coverImgUrl = that.audioDetail.audioCoverPic || that.audioDetail.audioBgPic || "";
          that.bgAudioMannage.src = that.audioDetail.audioUrl;
        }
        //音频地址（模拟）
        // "http://devimgtest.innourl.com/EAP/audio.mp3";
        // "https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3";
        //   ..音频可以播放 取音频时常并计算
        that.bgAudioMannage.onCanplay(() => {
          console.log('音频 onCanplay')
          that.$nextTick(() => {
            setTimeout(() => {
              // 如果音乐可以正常播放，进度条解开禁用
              if (that.sliderDisable == true) that.sliderDisable = false;
              // 如果没有这一步onTimeUpdate()不会触发回调
              that.bgAudioMannage.duration.toFixed(0);
              // that.getDuration();
            }, 300);
          });
        });
        //监听播放时间 及 计算播放进度
        that.bgAudioMannage.onTimeUpdate(() => {
          // console.log('音频 onTimeUpdate',!!app.STH.get('AUDIO_TIMMING'),app.STH.get('AUDIO_TIMMING'),'---',that.bgAudioMannage)
          if (that.sliderDisable == true) that.sliderDisable = false;

          // if(that.audioStatus) that.audioStatus = false

          // 如果onCanplay的时候获取不到Duration，播放开始的时候再获取一次
          // if (that.duration === "00:00") that.getDuration();

          //播放时间
          var time = that.bgAudioMannage.currentTime.toFixed(0);
          var min = Math.floor(time / 60);
          var second = time % 60;
          if (
            that.bgAudioMannage.currentTime >= that.audioDetail.audioTimeLength
          ) {
            that.time = that.audioDetail.duration_str;
          } else {
            that.time =
              (min >= 10 ? min : "0" + min) +
              ":" +
              (second >= 10 ? second : "0" + second);
          }
          //计算进度
          that.playJd = (time / that.audioDetail.audioTimeLength).toFixed(2) * 100;
          
          if(that.isTiming){
            if(!!!app.STH.get('AUDIO_TIMMING')){
              // console.log('进来 暂停',!!app.STH.get('AUDIO_TIMMING'),app.STH.get('AUDIO_TIMMING'))
              that.audioStatus = false;
              that.pause();
              that.init('reset');
            }
          }
          // console.log("播放进度", that.bgAudioMannage.currentTime);
        });
        //监听播放开始
        that.bgAudioMannage.onPlay(() => {
            that.init();
            console.log('音频 onPlay')
            if (that.audioStatus) that.audioStatus = false;
            that.resetBgAudio = false
          }),
          //监听播放停止
          that.bgAudioMannage.onStop(() => {
            setTimeout(() => {
              if (!that.audioStatus) that.audioStatus = true;
              that.playJd = 0;
              that.resetBgAudio = true;
              that.time = "00:00";
            }, 300);

          }),
          //监听播放暂停
          that.bgAudioMannage.onPause(() => {
            if (!that.audioStatus) that.audioStatus = true;
          }),
          //自然播放结束
          that.bgAudioMannage.onEnded(() => {
            console.log('音频 播放结束');
            if (that.time != that.duration_str) that.time = that.duration_str;
            that.bgAudioMannage.stop();
            that.resetBgAudio = true;
            that.audioStatus = true;
            that.isLooping && that.play();
          }),
          //音频错误
          that.bgAudioMannage.onError((res) => {
            if (that.sliderDisable == false) that.sliderDisable = true;
            if (!that.audioStatus) that.audioStatus = true
            that.bgAudioMannageError(res.errCode);
            console.log(res.errMsg);
            console.log(res.errCode);
          });
      },
      bgAudioMannageError(errCode) {
        let toast = "";
        if (errCode == 10001) {
          toast = "系统错误";
        } else if (errCode == 10002) {
          toast = "网络错误";
        } else if (errCode == 10003) {
          toast = "文件错误";
        } else if (errCode == 10004) {
          toast = "格式错误";
        } else {
          toast = "未知错误";
        }
        SMH.showToast({
          title: toast,
        });
      },
      // 获取音乐长度
      getDuration() {
        var time = this.bgAudioMannage.duration.toFixed(0);
        var min = Math.floor(time / 60);
        var second = time % 60;
        this.duration =
          (min > 10 ? min : "0" + min) +
          ":" +
          (second > 10 ? second : "0" + second);
      },
      // 调整进度
      seek(time) {
        console.log('seek',time,this.bgAudioMannage,this)
        this.bgAudioMannage.stop();
        this.bgAudioMannage.startTime = time;
        // this.bgAudioMannage.seek(time);
        this.bgAudioMannage.play();
      },
      sliderChange({
        detail
      }) {
        let sliderTime = (detail.value / 100) * this.audioDetail.audioTimeLength;
        this.play()
        setTimeout(() => {
          this.bgAudioMannage.seek(sliderTime)
        }, 200);
      },
      changeStatus() {
        if (this.sliderDisable) return;
        if (!this.audioStatus) {
          this.pause();
        } else {
          this.play();
        }
        this.audioStatus = !this.audioStatus;
      },
      //播放
      play() {
        //音乐播放实例
        let bgAudioMannage = this.bgAudioMannage
        if (this.resetBgAudio) {
          bgAudioMannage.title = this.audioDetail.audioTitle;
          bgAudioMannage.singer = '暂无';
          bgAudioMannage.coverImgUrl = this.audioDetail.audioCoverPic || this.audioDetail.audioBgPic || "";
          bgAudioMannage.src = this.audioDetail.audioUrl;
        }
        bgAudioMannage.play() // 调起播放
      },
      //暂停
      pause() {
        let bgAudioMannage = this.bgAudioMannage
        bgAudioMannage.pause() // 调起暂停

      },
      // 音频背景错误
      backgroundError() {
        console.log("音频背景错误了")
        this.backgroundShow = false
      },
      // 音频封面错误
      coverError() {
        console.log("音频封面错误了")
        this.coverShow = false
      },
      setLoop(){
        this.isLooping = !this.isLooping;
        app.SMH.showToast({title:`${this.isLooping?'已切换到单曲循环':'已关闭单曲循环'}`})
        app.STH.set('AUDIO_SETTING',{isLooping:this.isLooping});
      },
      setTimer(){
        this.isCatch = true;
        this.showTitleText = "定时关闭设置"
        this.$refs.popup.show();
        this.pageNavMode = "Back"; 
      },
      pickerChange(e){
        let data = e && e.detail && e.detail.value||[0,0];
        if(data[0] == 0 && data[1] == 0){
          this.selectTime('normal',0);
          return
        }
        this.selectTime('custom',data);
      },
      selectTime(type,data){
        console.log('selectTime',type,data)
        this.curSel.type = type;
        this.curSel[type] = data;
        let time = this.curSel[type];
        if(type == 'normal' && this.curSel[type] == 0){
          this.isTiming = false;
          app.STH.remove('AUDIO_TIMMING');
          return
        }
        if(type == 'custom'){
          let item = this.timerSelArr.custom||{}; 
          time = item[0][this.curSel[type][0]].val*60 + item[1][this.curSel[type][1]].val;
        }
        this.isTiming = true;
        app.STH.set('AUDIO_TIMMING',this.curSel,time);
      },
      navClick(){
        this.showTitleText = "";
        this.$refs.popup.dismiss();
        this.pageNavMode = "Close"
        this.isCatch = false;
      }
    },
    onUnload() {
      // 销毁当前播放器实例
      // this.bgAudioMannage.destroy();
    },
    onShow() {},
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .audio-detail-page {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: relative;

    // background: #808080;
    .cover-background {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-position: top center;
      background-repeat: no-repeat;
      background-size: 100% auto;
      filter: blur(100px);
    }

    .background-container {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      overflow: hidden;

      .audio-detail-background {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .audio-detail-title {
      width: 70%;
      text-align: center;
      position: absolute;
      top: 16%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 36rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      line-height: 50rpx;
    }

    .audio-detail-cover {
      position: absolute;
      top: 25%;
      left: 50%;
      transform: translateX(-50%);
      width: 400rpx;
      height: 400rpx;
    }

    .audio-status , .audio-timer , .audio-loop{
      width: 50rpx;
      height: 50rpx;
      position: absolute;
      bottom: 12%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 98;
    }
    .audio-timer{
      left: unset;
      transform: unset;
      right: 152rpx;
    }
    .audio-loop{
      left: 152rpx;
      transform: unset;
    }
    .audio-detail-progress {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 5%;
      width: 90%;

      slider {
        flex: 1;

        ::v-deep .wx-slider-thumb {
          opacity: 0;
        }
      }
    }
  }
  .timer-box{
    width: 100%; 
    height: 100vh;
    background: #fff;
    padding-left: 30rpx;
    box-sizing: border-box;
  }
  .timer-item{
    border-bottom: 1px solid #DDD;
    height: 110rpx;
    padding-left: 13rpx;
    padding-right: 50rpx;
    box-sizing: border-box;
    font-size: 28rpx;
    width:100%;
  }
  .arrow{
    width: 28rpx;
    height: 16rpx;
    transform: rotate(-45deg);
    border-left: 4rpx solid;
    border-bottom: 4rpx solid;
    border-color: $uni-main-color;
  }
</style>