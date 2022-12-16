<template>
  <view>
    <view v-if="!showLoading" class="video-detail-page"
      :style="{'background-color':backgroundShow?'transparent':'#9AB9B2'}">
      <!-- <image @load="getBgSize" :style="{height:bgHeight,width:bgWidth}" class="video-detail-background"
        v-if="videoDetail.videoBgPic" @error="backgroundError" :src="videoDetail.videoBgPic" mode="widthFix" /> -->
      <page-nav :isTransparent="true" mode="Close" :full="true"></page-nav>
      <template v-if="(!isTest && showVideo) && videoDetail.videoUrl">
        <view class="video-content">
          <video @ended="videoEnded" @pause="videoPause" id="video"
            :show-fullscreen-btn="videoOptions.showFullscreenBtn" :show-play-btn="videoOptions.showPlayBtn"
            class="videoInfo" @play="playVideo" @fullscreenchange="fullscreenchange" :src="videoDetail.videoUrl"
            :autoplay="videoOptions.autoplay" :enable-play-gesture="videoOptions.enablePlayGesture"
            :object-fit="videoOptions.objectFit" @loadedmetadata="getVideoDetail"></video>
          <view class="video-detail-info">
            <!-- <view class="bold font-28 m-b-25" :class="!!videoDetail.videoBgPic ? 'C_fff':'C_333'"> -->
            <view class="font-28 m-b-18 bold C_fff">
              {{videoDetail.videoTitle?videoDetail.videoTitle:""}}</view>
            <!-- <view class="font-24" style="line-height: 49rpx;" :class="!!videoDetail.videoBgPic ? 'C_fff':'C_7f'"> -->
            <view class="font-24 C_fff" style="line-height: 49rpx;">
              {{subText || videoDetail.videoDescription}}<text class="C_008acb m-l-10"
                style="text-decoration:underline;" @click="toggleText" v-if="subText">展开</text></view>
          </view>
          <ori-popup @touchmove.stop.prevent="disabledScroll" ref="popup" type="bottom" :is-mask-click="true"
            :safe-area="false">
            <template v-slot:content>
              <view class="popup-content">
                <image class="close-icon" :src="staticAddress+closeIcon" mode="widthFix" @click="closePupup" />
                <view class="font-28 popup-title flex-s-c m-b-18">
                  <view class="C_333 popup-consultant-name bold">
                    {{videoDetail.videoTitle?videoDetail.videoTitle:""}}</view>
                </view>
                <view>
                  <scroll-view :scroll-y="true" class="scroll-view-info">
                    <text class="font-26 C_8E">{{ videoDetail.videoDescription }}</text>
                  </scroll-view>
                </view>
              </view>
            </template>
          </ori-popup>
          <view class="toggle-play" @click="togglePlay">
            <image class="toggle-play-play-icon" :class="videoStatus?'':'toggle-play-play-icon-show'"
              :src="staticAddress+videoPlayIcon" mode="aspectFit" />
            <view class="full-screen-button font-22 C_fff" v-if="canFullScreen" @click.stop="fullScreenVideo">
              <image :src="staticAddress + videoFullScreenIcon" mode="aspectFit" />
              <view>全屏展示</view>
            </view>
          </view>
        </view>
      </template>
      <template v-else>
        <empty>暂无内容噢～</empty>
      </template>
    </view>
    <view v-show="showLoading" class="video-detail-page flex-c-c">
      <loading-view></loading-view>
    </view>
  </view>
</template>

<script>
  import utils from '@/common/support/utils.js'
  import oriPopup from "@/components/ori-comps/popup/ori-popup";
  import LoadingView from '@/components/css3/loading/loading.vue';

  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        showLoading: true,
        showVideo: false,
        isTest: true,
        bgWidth: 0,
        bgHeight: 0,
        options: {},
        videoDetail: {},
        closeIcon: "/close-popup-icon.png",
        videoPlayIcon: "/video-play.png",
        videoFullScreenIcon: "/video-full-screen.png",
        videoOptions: {
          // 显示全屏按钮
          showFullscreenBtn: false,
          // 显示播放按钮
          showPlayBtn: false,
          // 自动播放
          autoplay: true,
          // 视屏在容器内的展示形式  contain：包含，fill：填充，cover：覆盖
          objectFit: 'contain',
          // 是否开启播放手势，即双击切换播放/暂停
          enablePlayGesture: true
        },
        subText: "",
        backgroundShow: true,
        ctxVideo: {},
        videoStatus: true,
        // 是否允许全屏
        canFullScreen: false
      };
    },
    components: {
      LoadingView,
      oriPopup
    },
    onLoad(options) {
      this.options = options;
    },
    onReady() {
      this.getSysConf(this.init())
      this.ctxVideo = uni.createVideoContext("video", this)
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
      init() {
        return this.getInfo().then(data=>{
            console.log(data.videoDescription.trim())
            if (data.videoDescription.trim().length > 50) {
              this.subText = data.videoDescription.substr(0, 50) + "..."
            }
            this.videoDetail = data;
            this.showVideo = true
        }).finally(()=>{
          this.showLoading = false;
        }) 
      },  
      getInfo(){
        let item = decodeURIComponent(this.options.item || '{}'),data={};
        item = JSON.parse(item);
        return new Promise((rs,rj)=>{
          if(parseInt(this.options.id||0)){
            return this.$Http(this.$Apis.getVideo, {
              data: {
                id: this.options.id || 0,
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
                videoUrl : item.path,
                videoTitle:item.title||"",
                videoBgPic:item.cover||"", 
                videoDescription: "",
            }
            rs(data);
          }
        }) 
      },
      // 背景错误
      backgroundError() {
        console.log("背景错误了")
        this.backgroundShow = false
      },
      toggleText() {
        let ref = "popup";
        this.$refs[ref].show();
      },
      closePupup() {
        let ref = "popup";
        this.$refs[ref].dismiss();
      },
      playVideo() {
        const bgAudioMannage = uni.getBackgroundAudioManager();
        bgAudioMannage.stop()
        this.videoStatus = true
      },
      videoPause() {
        this.videoStatus = false
      },
      videoEnded() {
        this.videoStatus = false
      },
      togglePlay() {
        if (this.videoStatus == false) {
          this.ctxVideo.play()
        } else {
          this.ctxVideo.pause()
        }
        console.log(this.ctxVideo)
      },
      fullscreenchange({
        detail
      }) {
        if (detail.fullScreen == true) {
          this.videoOptions.showFullscreenBtn = true
          this.videoOptions.showPlayBtn = true
        }else{
          this.videoOptions.showFullscreenBtn = false
          this.videoOptions.showPlayBtn = false
        }
      },
      fullScreenVideo() {
        this.ctxVideo.requestFullScreen()
      },
      getVideoDetail({
        detail
      }) {
        let {
          duration,
          width,
          height
        } = detail;
        console.log(duration, width, height)
        if (height <= width && (width != 0 || height != 0)) this.canFullScreen = true
      }
    },
    onUnload() {},
    onShow() {},
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .video-detail-page {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: relative;

    .video-content {
      position: relative;
      width: 100%;
      height: 100%;

      .videoInfo {
        width: 100%;
        height: 100vh;
      }

      .video-detail-info {
        position: fixed;
        bottom: 60rpx;
        width: 100%;
        box-sizing: border-box;
        padding: 0rpx 36rpx 24rpx;
        z-index: 99;
      }

      .toggle-play {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(100% - 60rpx);
        z-index: 9;

        .toggle-play-play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(2);
          width: 106rpx;
          height: 130rpx;
          opacity: 0;
        }

        .toggle-play-play-icon-show {
          transform: translate(-50%, -50%) scale(1) !important;
          opacity: 1 !important;
          transition: all 0.2s;

        }

        .full-screen-button {
          position: absolute;
          top: 70%;
          left: 50%;
          transform: translateX(-50%);
          width: 174rpx;
          height: 57rpx;
          border-radius: 40rpx;
          border: 2rpx solid #7F7F7F;
          display: flex;
          align-items: center;
          justify-content: center;

          image {
            width: 22rpx;
            height: 22rpx;
            margin-right: 10rpx;
          }
        }
      }
    }

    .video-detail-background {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      width: 100%;
      z-index: -1;
    }


  }

  // 弹出框
  .popup-content {
    background: #ffffff;
    border-radius: 20rpx 20rpx 0px 0px;
    padding-top: 50rpx;
    padding-left: 55rpx;
    padding-right: 55rpx;
    padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
    position: relative;

    .close-icon {
      position: absolute;
      top: 30rpx;
      right: 21rpx;
      width: 23rpx;
      height: 23rpx;
      padding: 20rpx;
    }

    .popup-consultant-name {
      max-width: 90%;
    }

    .scroll-view-info {
      height: 550rpx;
      width: 100%;
      line-height: 50rpx;
    }
  }

  .popup-title {}
</style>