<template>
  <view class="course-video">
    <page-nav :scroll-height="scrollHeight" :isTransparent="false" :full="false">
      <view slot="title">课程任务</view>
    </page-nav>
    <video @play="stopAudio" id="video" @timeupdate="videoTimeUpdate" autoplay class="video-style"
      :src="videoDetail.videoUrl"></video>
    <view class="course-info-bg">
      <view class="course-info flex-b-c">
        <view class="curse-info-detail">
          <view class="curse-info-detail-title flex-s-c m-b-15">
            <view class="font-32 bold C_333 m-r-10 clamp2" style="max-width: 300rpx;">视频任务</view>
            <view v-if="!isFinish" class="curse-type font-20">待完成</view>
            <view v-else class="curse-type curse-type-success font-20">已完成</view>
          </view>
          <view v-if="timeStr.trim().length>0 && !isFinish" class="curse-info-detail-time flex-s-c">
            <image class="icon-time m-r-10" :src="requireStatic('/course-video/time.png')" mode="aspectFit" />
            <view class="font-22 C_333">{{timeStr}}</view>
          </view>
        </view>
        <template v-if="showPunch">
          <template v-if="!timeStr.trim() && !isFinish">
            <view v-if="contentDetail.limitNumber && contentDetail.limitNumber !== 0" @click="punchOrder(true,1)"
              class="punch-button bold shrink0">学习打卡</view>
          </template>
          <template v-else-if="timeStr.trim() && !isFinish">
            <view class="punch-button bold shrink0 opa-50">学习打卡</view>
          </template>
          <template v-else>
            <image class="punch-success shrink0" :src="requireStatic('/course-video/punch-success.png')"
              mode="aspectFit" />
          </template>
        </template>
      </view>
    </view>
    <view class="course-catalog">
      <view class="course-catalog-count font-20 C_7f m-b-10">课程目录 {{subsections.length || ''}}节</view>
      <template v-if="subsections">
        <view class="font-32 bold C_333 clamp2 m-b-20" style="padding-right:43rpx">
          {{videoTitle || subsections[0].title || ""}}</view>
        <scroll-view @scroll="scrollHorList" class="course-catalog-list" :scroll-into-view="'id'+scrollId" scroll-x>
          <view :id="'id'+item.id" class="course-catalog-item" v-for="(item,index) in subsections" :key="index">
            <view class="item-cont bg_f8 relative" :data-c-index="index" :data-c-item="item" @click="clickItem">
              <view v-if="item.contentType == 'video'" class="item-cont-type font-20 C_7f m-b-15">视频</view>
              <view v-else-if="item.contentType == 'audio'" class="item-cont-type font-20 C_7f m-b-15">音频</view>
              <view v-else-if="item.contentType == 'exam'" class="item-cont-type font-20 C_7f m-b-15">测验</view>
              <view class="font-24 C_7f clamp2" style="white-space: pre-wrap;height:64rpx"
                :class="item.click?'C_52b200':''">{{item.contentName}}</view>
              <image v-if="item.needlock" class="lock-icon absolute" :src="requireStatic('/course-video/lock.png')"
                mode="aspectFit" />
            </view>
          </view>
          <view class="course-catalog-item">
            <view class="item-cont">
              <view class="item-cont-type font-20 C_7f m-b-15"></view>
              <view class="font-24 C_7f clamp2" style="white-space: pre-wrap;height:64rpx"></view>
            </view>
          </view>
        </scroll-view>
      </template>
      <view class="open-list-outside">
        <view class="flex-c-c C_7f font-20" @click="openList">
          展开目录
        </view>
      </view>
    </view>
    <ori-popup @touchmove.stop.prevent="disabledScroll" @change="popupChange" ref="popup" type="bottom"
      :is-mask-click="true" :mask-background-color="'rgba(0,0,0,0)'" :safe-area="false">
      <template v-slot:content>
        <view class="popup-content" :style="{height:`${popupHeight}px`}">
          <view class="popup-title flex-b-c">
            <view class="bold font-28">课程目录</view>
            <image @click="hideBench" :src="requireStatic('/course-video/close_popup.png')" mode="aspectFit" />
          </view>
          <!-- <scroll-view :scroll-into-view="'ids'+scrollIds" class="course-scroll-view"
            :style="{height:`calc(${popupHeight}px - 450rpx)`}" scroll-y> -->
          <courseModule :light-id="contentDetail.id" :scroll-height="scrollHeightCom"
            :scroll-into-view="'ids'+scrollIds" @clickItem="clickItem" :courseDetail="courseDetail" ref="course">
          </courseModule>
          <!-- </scroll-view> -->
        </view>
      </template>
    </ori-popup>
  </view>
</template>

<script>
  import courseModule from "@/components/course-module/course-module"
  import oriPopup from "@/components/ori-comps/popup/ori-popup";
  import courseManage from "@/common/manager/course-manage.js";
  import SMH from "@/common/helper/show-msg-handler.js"

  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        options: {},
        scrollHeight: 0,
        scrollHeightCom: 0,
        courseDetail: {},
        popupHeight: 0,
        contentDetail: [],
        isFinish: 0,
        videoDetail: [],
        playedTime: 0,
        checkTime: 0,
        timeStr: '0分0秒后解锁打卡',
        subsections: "",
        scrollId: "",
        scrollIds: 0,
        videoProgress: 0,
        showPunch: false,
        scrollItemWidth: 0,
        videoTitle: "",
        autoPunchInterval: "",
        punchCardHold: "",
        punchCardArr: [],
      };
    },
    components: {
      courseModule,
      oriPopup
    },
    onLoad(options) {
      this.options = options
      // this.initSubsectionsList()
      this.caculatePopupHeight()
    },

    onShow() {
      courseManage.getCourseList(this.options.activityId).then(() => {
        this.courseDetail = courseManage.courseList
        this.getSubInfo(this.options);
        this.loadContentDetail(this.options.contentId)
      })
      this.stopAudio()
    },
    onReady() {},
    onUnload() {
      if (this.punchCardHold != 1) {
        this.punchOrder(true,0)
      }
      clearInterval(this.autoPunchInterval);
      if (this.contentDetail.limitNumber == 0) {
        courseManage.getCourseList(this.options.activityId)
      }
    },
    methods: {
      getItemQuery() {
        this._getQuery(".course-catalog-item").then(res => {
          // console.log(res, "item的长宽")
          this.scrollItemWidth = res[0].width
        })
      },
      getSubInfo(options) {
        options = options || this.options || {};
        console.log(options, "getsubinfo")
        let contentId = options.contentId
        let subsections = courseManage.getCurrSub(options);
        let contentList = subsections;
        contentList.forEach((item, i) => {
          if (item.id == contentId) {
            item.click = true
          } else {
            item.click = false
          }
        })
        this.subsections = subsections
        this.$nextTick(() => {
          this.getItemQuery();
        })
      },
      caculatePopupHeight() {
        // console.log(app.SIH.safeAreaInsets, "safeAreaInsets")
        let topHeight = app.SIH.getConvert(500, "PX")
        this.popupHeight = app.SIH.screenHeight - app.SIH.navPlace - topHeight;
        this.scrollHeightCom = app.SIH.screenHeight - app.SIH.navPlace - app.SIH.navHeight - topHeight;
      },
      loadContentDetail(contentId, init = false) {
        return this.$Http(this.$Apis.getCourseContent, {
          data: {
            activityId: this.options.activityId,
            id: contentId
          }
        }).then(res => {
          this.isFinish = res.data.isFinish;
          this.contentDetail = res.data;
          this.getVideo(res.data.relatedId);
          this.scrollId = res.data.id;
          if (res.data.hadViewTime < res.data.limitNumber && res.data.isFinish == 0) {
            this.autoPunchCard(init)
          } else {
            clearInterval(this.autoPunchInterval);
          }
          // console.log(res, "内容详情")
        })
      },
      // 滑动更换标题
      scrollHorList(e) {
        if (!this.scrollItemWidth) return
        // console.log(parseInt(e.detail.scrollLeft/this.scrollItemWidth), "滑动")
        let subsections = this.subsections;
        let index = Math.round(e.detail.scrollLeft / this.scrollItemWidth)
        this.videoTitle = subsections[index].title
      },
      // 打卡排序
      punchOrder(set, isCard) {
        let punchCardArr = this.punchCardArr;

        if (set) punchCardArr.push({
          fun: this.punchCard,
          isCard
        })

        if (this.punchCardHold == 1) return Promise.resolve()
        this.punchCardHold = 1

        let arrItem = punchCardArr[0]
        return typeof (arrItem.fun) == "function" ? arrItem.fun(arrItem.isCard).then((res) => {
          return res
        }).catch(err => {
          return Promise.reject()
        }).finally(() => {
          punchCardArr.shift()
          this.punchCardHold = ""
          if (punchCardArr.length > 0) {
            setTimeout(() => {
              this.punchOrder()
            }, 200);
          }
        }) : Promise.resolve();

      },
      punchCard(isCard) {
        let formData = {
          activityId: this.options.activityId,
          contentId: this.contentDetail.id,
          courseId: this.courseDetail.id,
          isCard,
          viewTime: this.playedTime,
          progressTime: this.videoProgress
        }
        return courseManage.punchCard(formData).then(res => {
          if (isCard) {
            SMH.showToast({
              title: "打卡成功"
            })
            let contentList = this.subsections;
            for (let i = 0; i < contentList.length; i++) {
              if (contentList[i].needlock) {
                contentList[i].needlock = false
                break;
              }
            }
            this.courseDetail = [];
            // console.log(res, "formataData")
            this.$nextTick(() => {
              this.courseDetail = res;
              this.isFinish = 1
            })
          }
          return res
        }).catch(err => {
          return Promise.reject()
        })
      },
      autoPunchCard(init = false, time = 1) {
        let intervalTime = time * 60000
        if (init) {
          this.playedTime = 0;
          clearInterval(this.autoPunchInterval);
        }
        this.autoPunchInterval = setInterval(() => {
          let coolTime = this.playedTime
          this.punchOrder(true,0).then(res => {
            if (res.code == 1) {
              this.playedTime = this.playedTime - coolTime;
              console.log("冷却时间：", coolTime, "当前时间：", this.playedTime)
            }
          })
        }, intervalTime)
      },
      videoTimeUpdate({
        detail
      }) {
        this.stopAudio()
        // console.log(detail, "视频在播放")
        let checkTime = this.checkTime;
        this.videoProgress = detail.currentTime;
        if (parseInt(detail.currentTime) == checkTime) return
        this.checkTime = parseInt(detail.currentTime);
        if (this.allSecond === 0) {
          this.timeStr = ""
          return
        }
        this.allSecond -= 1
        //获取分钟，除以60取整数，得到整数分钟
        let min = parseInt(this.allSecond / 60);
        //获取秒数，秒数取余，得到整数秒数
        let second = parseInt(this.allSecond % 60);
        this.timeStr = `${min}分${second}秒后解锁打卡`
        this.playedTime += 1
        if (this.allSecond === 0) {
          this.punchOrder(true,0);
          clearInterval(this.autoPunchInterval);
        }
        // console.log(this.playedTime, "this.playedTime")
        // console.log(this.timeStr, "this.timeStr")

      },
      getVideo(id) {

        let that = this;
        that.videoDetail = []
        console.log("courseDetail", this.courseDetail)
        that.$Http(that.$Apis.getVideo, {
          data: {
            id: id || 0,
            courseId: that.courseDetail.id
          },
          other: {
            isShowLoad: true
          }
        }).then((res) => {
          if (res.code == 1) {
            let contentDetail = that.contentDetail;
            let limitNumber = contentDetail.limitNumber;
            let hadViewTime = contentDetail.hadViewTime;
            let allSecond = 0
            if (limitNumber == 0) {
              allSecond = 0
              // 如果不需要限制时长
              if (that.contentDetail.limitNumber == 0 && !that.contentDetail.isFinish) {
                that.punchOrder(true,1)
                courseManage.getCourseList(that.options.activityId)
              }
            } else {
              allSecond = limitNumber - hadViewTime
            }
            that.allSecond = allSecond > 0 ? allSecond : 0;
            if (allSecond === 0) {
              that.timeStr = ""
            } else {
              that.timeStr = "0分0秒后解锁打卡"
            }
            that.videoDetail = res.data;
            that.showPunch = true;
            that.$nextTick(() => {
              if (that.contentDetail.progressTime < res.data.videoTimeLength) {
                let videoContx = uni.createVideoContext('video')
                videoContx.seek(that.contentDetail.progressTime)
                videoContx.play()
              }
            })
          }
        }).catch((err) => {}).finally(() => {
          that.showLoading = false;
        })
      },
      stopAudio() {
        const bgAudioMannage = uni.getBackgroundAudioManager();
        if (bgAudioMannage.paused == false) {
          bgAudioMannage.stop()
        }
      },
      popupChange(e) {
        // console.log(e, "改变")
        if (e.show) {
          this.courseDetail = []
          this.scrollIds = 0;
          this.$nextTick(() => {
            this.courseDetail = courseManage.courseList;
            setTimeout(() => {
              this.scrollIds = courseManage.scrollIds || 0;
            }, 350)
          })
          // setTimeout(() => {
          //   this.courseDetail = courseManage.courseList
          //   setTimeout(() => {
          //     this.$nextTick(() => {
          //       this.scrollIds = courseManage.scrollIds || 0;
          //     })
          //   }, 2000);

          // }, 500);
        }
      },
      hideBench() {
        let ref = "popup";
        this.$refs[ref].dismiss();
      },
      openList() {
        let ref = "popup";
        this.$refs[ref].show();
      },
      clickItem(e) {
        console.log(e, "点击事件")
        this.punchOrder(true,0)
        let clickItem = [];
        let chaptersIndex = ""
        let sIndex = ""
        let cIndex = ""
        let courseId = this.courseDetail.id;
        let activityId = this.options.activityId;
        let videoTitle = ""
        if (e.currentTarget) {
          clickItem = e.currentTarget.dataset.cItem;
          if (clickItem.needlock) {
            SMH.showToast({
              title: '请按顺序解锁课题噢'
            })
            return
          }
          chaptersIndex = this.options.chaptersIndex;
          sIndex = this.options.sIndex;
          cIndex = e.currentTarget.dataset.cIndex;
        } else {
          clickItem = e.clickItem;
          chaptersIndex = e.chaptersIndex;
          sIndex = e.sIndex;
          cIndex = e.cIndex;
        }
        if (clickItem.id == this.contentDetail.id) {
          this.hideBench()
          return
        }
        if (clickItem.contentType == 'audio') {
          let formData = {
            activityId,
            contentId: clickItem.id,
            courseId,
            isCard: 1,
            viewTime: 0
          }
          courseManage.punchCard(formData).then(res => {
            this.jumpAction(
              `/pages/work-bench/course-audio/course-audio?id=${clickItem.relateId}&courseId=${courseId}`
            )
          })
        } else if (clickItem.contentType == 'video') {
          this.showPunch = false;
          if (!e.currentTarget) {
            this.options.chaptersIndex = e.chaptersIndex;
            this.options.sIndex = e.sIndex;
            this.options.contentId = clickItem.id
          }

          let ops = {
            chaptersIndex,
            sIndex,
            contentId: clickItem.id
          }

          this.options = {
            ...this.options,
            ...ops
          }

          // console.log("video", chaptersIndex, sIndex, cIndex)
          this.getSubInfo(ops)
          this.loadContentDetail(clickItem.id, true)
          this.playedTime = 0;
          this.scrollId = clickItem.id

          this.$nextTick(() => {
            this.videoTitle = clickItem.title
          })

        } else if (clickItem.contentType == 'exam') {
          if (!clickItem.isFinish) {
            this.jumpAction(
              `/pages/activities/exam/answer/answer?activityId=${activityId}&contentId=${clickItem.id}&courseId=${courseId}&modelId=${clickItem.relateId}`
            )
          } else {
            this.jumpAction(
              `/pages/activities/exam/answer/exam-record?activityId=${activityId||0}&contentId=${clickItem.id||0}&courseId=${courseId||0}&modelId=${clickItem.relateId||0}`
            )
          }
        }
        this.hideBench()
      }
    }
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .course-video {
    min-height: 100vh;
    background: rgba($color: #000000, $alpha: 0.05);
  }

  .video-style {
    width: 100%;
    height: 500rpx;
  }

  .course-info-bg {
    background: #FFFFFF;
    width: 100%;
  }

  .lock-icon {
    width: 16rpx;
    height: 20rpx;
    right: 22rpx;
    top: 22rpx;
  }

  .course-info {
    padding: 50rpx 0;
    margin: 0 45rpx;
    border-bottom: 1px solid #E4E4E4;

    .curse-info-detail {
      .curse-info-detail-title {
        .curse-type {
          background: rgba(216, 216, 216, 0.3);
          border-radius: 3rpx;
          color: #7C7C7C;
          line-height: 28rpx;
          padding: 0 7rpx;
        }

        .curse-type-success {
          background: rgba($color: #D7EDC4, $alpha: 0.3) !important;
          color: #7AC33B !important;
        }
      }

      .curse-info-detail-time {
        .icon-time {
          width: 20rpx;
          height: 20rpx;
        }
      }
    }

    .punch-button {
      padding: 25rpx 44rpx;
      background: rgba(122, 195, 59, 1);
      border-radius: 53rpx;
      font-size: 28rpx;
      line-height: 40rpx;
      color: #FFFFFF;
    }

    .punch-success {
      width: 66rpx;
      height: 66rpx;
    }
  }

  .course-catalog {
    background: #FFFFFF;
    padding: 38rpx 0 34rpx 43rpx;

    .course-catalog-list {
      width: 100%;
      height: 160rpx;
      overflow: hidden;
      white-space: nowrap;
    }

    .course-catalog-item {
      width: 260rpx;
      height: 160rpx;
      flex-shrink: 0;
      padding-right: 43rpx;
      display: inline-block;
    }

    .item-cont {
      width: 100%;
      height: 100%;
      border-radius: 6rpx;
      box-sizing: border-box;
      padding: 16rpx 28rpx;
      display: flex;
      flex-direction: column;
    }



    .open-list-outside {
      padding-right: 43rpx;
      margin-top: 23rpx;

      &>view {
        width: 100%;
        height: 80rpx;
        background: #FFFFFF;
        border-radius: 6rpx;
        border: 1px solid #B2B2B2;
      }
    }
  }

  .popup-content {
    box-sizing: border-box;
    background: #ffffff;
    padding-top: 100rpx;
    padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
    position: relative;

    .popup-title {
      position: absolute;
      top: 0%;
      left: 0;
      width: 100%;
      padding: 30rpx;
      box-sizing: border-box;
      z-index: 2;
      background: #FFFFFF;

      &>image {
        height: 22rpx;
        width: 22rpx;
        padding: 10rpx;
      }
    }

    .course-scroll-view {
      box-sizing: border-box;
      width: 100%;
    }
  }
</style>