<template>
  <view>
    <view v-if="!showLoading" class="audio-detail-page" :style="{'background-color':backgroundColor}">
      <page-nav :isTransparent="true" full="false" isClose="true"></page-nav>
      <template v-if="!isTest && audioDetail.audioUrl">
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
        <image class="audio-status" :src="audioIcon" mode="scaleToFill" @click="changeStatus" />
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
  </view>
</template>

<script>
  import utils from '@/common/support/utils.js'
  import SMH from "@/common/helper/show-msg-handler";
  import LoadingView from '@/components/css3/loading/loading.vue';
  import UniApi from "@/common/support/tools/uni-api-promise.js";

  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        showLoading: true,
        bgWidth: 0,
        bgHeight: 0,
        audioPlayIcon: "/play-white.png",
        audioStopIcon: "/stop-white.png",
        audioPlayIconGrey: "/play-grey.png",
        audioStopIconGrey: "/stop-grey.png",
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
        isTest:true,
      };
    },
    components: {
      LoadingView
    },
    onLoad(options) {
      this.options = options; 
    },
    onReady() {
      this.getSysConf(this.getAudioDetail());
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
      getSysConf(callback) {
        // 确保该页面在账号登陆配置时，不展示，不可用
        let isTest = app.IM.authUserInfo.isTest == 1
        this.isTest = isTest;
        typeof (callback) == "function" && callback() || {}
      },
      getBgSize({
        detail
      }) {
       let width = detail.width;
        let height = detail.height;
        utils.getBgSize(width, height).then(res => {
          this.bgWidth = res.imgW + "px"
          this.bgHeight = res.imgH + "px"
        })
      },
      getAudioDetail() {
        return this.$Http(this.$Apis.getAudio, {
          data: {
            id: this.options.id || 0,
            courseId:this.options.courseId || 0
          },
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data
            let min = Math.floor(data.audioTimeLength / 60);
            let second = data.audioTimeLength % 60;
            console.log(min, second)
            data.duration_str = (min >= 10 ? min : "0" + min) + ":" + (second >= 10 ? second : "0" + second)
            this.audioDetail = data;
            this.initAudio();
          }
        }).catch((err) => {
        }).finally(() => {
          this.showLoading = false
        });
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
          // console.log(123)
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
          // console.log("播放进度", that.bgAudioMannage.currentTime);
        });
        //监听播放开始
        that.bgAudioMannage.onPlay(() => {
            if (that.audioStatus) that.audioStatus = false;
            that.resetBgAudio = false
          }),
          //监听播放停止
          that.bgAudioMannage.onStop(() => {
            setTimeout(() => {
              if (!that.audioStatus) that.audioStatus = true;
              that.playJd = 0;
              that.resetBgAudio = true;
              that.time = "00:00"
            }, 300);

          }),
          //监听播放暂停
          that.bgAudioMannage.onPause(() => {
            if (!that.audioStatus) that.audioStatus = true;
          }),
          //自然播放结束
          that.bgAudioMannage.onEnded(() => {
            if (that.time != that.duration_str) that.time = that.duration_str;
            that.bgAudioMannage.stop();
            that.resetBgAudio = true;
            that.audioStatus = true;
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
        this.bgAudioMannage.stop();
        this.bgAudioMannage.startTime = time;
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

    .audio-status {
      width: 52rpx;
      height: 58rpx;
      position: absolute;
      bottom: 12%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999;
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
</style>