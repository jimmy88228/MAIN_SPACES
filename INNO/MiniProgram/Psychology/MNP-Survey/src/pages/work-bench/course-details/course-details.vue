<template>
  <view>
    <template v-if="showLoading">
      <view class="loading-view flex-c-c">
        <loading-view></loading-view>
      </view>
    </template>
    <template v-else>
      <page-nav :isTransparent="true" :full="true">
        <view slot="title">课程目录</view>
      </page-nav>

      <template v-if="showCourse">
        <view class="bg-top">
          <view class="course-title">
            <view class="font-32 C_fff bold m-b-25">{{formatDetail.activityName||''}}</view>
            <template v-if="formatDetail.limitTime == 1">
              <view class="course-time" v-if="formatDetail.joinState == 0">课程开始时间 {{formatDetail.initStartTime}}</view>
              <view class="course-time" v-if="formatDetail.joinState == 1">课程结束时间 {{formatDetail.initEndTime}}</view>
            </template>
            <view class="course-progress m-b-20">
              <view class="course-progress-precent" :style="{width:(formatDetail.learningPrecent || 0) +'%'}"></view>
            </view>
            <view class="font-22 C_fff m-b-20 opa-70">
              已学{{formatDetail.hadLearnCount||0}}/{{formatDetail.totalCount||0}}节
            </view>
          </view>
        </view>
        <!-- <scroll-view :scroll-into-view="'ids'+scrollIds" class="course-scroll-view" scroll-y> -->
        <view class="p-t-40">
          <courseModule :scroll-height="scrollHeight" :scroll-into-view="'ids'+scrollIds" @clickItem="clickItem"
            :courseDetail="courseDetail" ref="course"></courseModule>
        </view>
        <!-- </scroll-view> -->
      </template>
      <template v-else>
        <view class="has-no-data flex-c-c flex-col">
          <image :src="requireStatic('/course-video/course-disable.png')" mode="aspectFit" />
          <view class="font-28 C_7f">访问的课程已结束</view>
          <view class="back-button C_7f flex-c-c font-28" @click="backAction('/pages/startup/startup')">返回</view>
        </view>
      </template>
    </template>
  </view>
</template>

<script>
	import LoadingView from '@/components/css3/loading/loading.vue';
  import courseModule from "@//components/course-module/course-module"
  import courseManage from "@/common/manager/course-manage.js";
  import SMH from "@/common/helper/show-msg-handler.js";

  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        options: {},
        courseDetail: {},
        scrollIds: 0,
        scrollHeight: 0,
        showLoading: true
      };
    },
    onLoad(options) {
      this.options = options || {};
    },
    components: {
      courseModule,
      LoadingView
    },
    onShow() {
      this.$nextTick(() => {
        this.courseDetail = courseManage.courseList || {};
        this.scrollIds = courseManage.scrollIds || 0;
      })
    },
    onUnload() {
      courseManage.initCourse()
    },
    onReady() {
      this.loadDetail()
    },
    computed: {
      caculateScrollHeight() {
        let topHeight = app.SIH.getConvert(500, "PX")
        let topPaddingHeight = app.SIH.getConvert(40, "PX")
        this.scrollHeight = app.SIH.screenHeight - topHeight - topPaddingHeight
        console.log(this.scrollHeight, "topHeight")
      },
      formatDetail() {
        let courseDetail = this.courseDetail;
        let learningPrecent = Math.floor((courseDetail.hadLearnCount / courseDetail.totalCount) * 100);
        let initEndTime = "";
        let initStartTime= ""
        if (courseDetail.limitTime) {
          if(courseDetail.endTime.slice(11) == "00:00:00"){
            initEndTime = courseDetail.endTime.slice(0,10);
          }else{
            initEndTime = courseDetail.endTime.slice(0,16);
          }
          if(courseDetail.startTime.slice(11) == "00:00:00"){
            initStartTime = courseDetail.startTime.slice(0,10);
          }else{
            initStartTime = courseDetail.startTime.slice(0,16);
          }
        }
        let formatDetail = {
          ...courseDetail,
          learningPrecent,
          initStartTime,
          initEndTime
        }
        return formatDetail
      },
      showCourse() {
        let courseDetail = this.courseDetail;
        let showCourse = true
        if (courseDetail.id) {
          if (courseDetail.joinState == 2) {
            showCourse = false
          }
        } else {
          showCourse = false
        }
        return showCourse
      }
    },
    methods: {
      loadDetail() {
        return courseManage.getCourseList(this.options.courseActivityId).then(res => {
          console.log(res, "appres")
          this.$nextTick(() => {
            this.courseDetail = res
          })
        }).finally(() => {
          setTimeout(() => {
            this.showLoading = false
          }, 300);
        })
      },
      clickItem(e) {
        console.log(e, "点击事件")
        if (this.courseDetail.joinState == 0 && this.courseDetail.limitTime == 1) {
          SMH.showToast({
            title: "该课程活动尚未开始"
          })
          return
        }
        let clickItem = e.clickItem;
        let contentId = clickItem.id;
        let courseId = this.courseDetail.id;
        let activityId = this.options.courseActivityId;
        if (clickItem.contentType == 'audio') {
          let formData = {
            activityId,
            contentId,
            courseId: courseId,
            isCard: 1,
            viewTime: 0
          }
          if (!clickItem.isFinish) {
            courseManage.punchCard(formData)
          }
          this.jumpAction(
            `/pages/work-bench/course-audio/course-audio?id=${clickItem.relateId}&courseId=${courseId}`
          )

        } else if (clickItem.contentType == 'video') {
          this.jumpAction(
            `/pages/work-bench/course-video/course-video?activityId=${activityId}&courseId=${courseId}&contentId=${contentId}&cIndex=${e.cIndex}&sIndex=${e.sIndex}&chaptersIndex=${e.chaptersIndex}`
          )
        } else if (clickItem.contentType == 'exam') {
          if (!clickItem.isFinish) {
            this.jumpAction(
              `/pages/activities/exam/answer/answer?activityId=${activityId}&contentId=${contentId}&courseId=${courseId}&modelId=${clickItem.relateId}`
            )
          } else {
            this.jumpAction(
              `/pages/activities/exam/answer/exam-record?activityId=${activityId||0}&contentId=${contentId||0}&courseId=${courseId||0}&modelId=${clickItem.relateId||0}`
            )
          }
        }
      }
    }
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .loading-view {
    width: 100%;
    height: 100vh;
  }

  .bg-top {
    width: 100%;
    height: 500rpx;
    position: relative;
    background: linear-gradient(180deg, rgba($color: #70E8A9, $alpha: 0.72) 0%, rgba($color: #018D8B, $alpha: 0.72) 100%);

    .course-title {
      position: absolute;
      bottom: 0rpx;
      left: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0 44rpx 30rpx 44rpx;

      .course-time {
        font-size: 22rpx;
        color: #1E766D;
        line-height: 30rpx;
        margin-bottom: 38rpx;
      }

      .course-progress {
        width: 100%;
        height: 6rpx;
        background: rgba($color: #FFFFFF, $alpha: 0.4);
        border-radius: 3rpx;

        .course-progress-precent {
          background: #7AED6F;
          border-radius: 3rpx;
          height: 100%;
          width: 0%;
          transition: 1s all ease-in-out;
        }
      }
    }
  }

  .course-scroll-view {
    box-sizing: border-box;
    height: calc(100vh - 500rpx);
    width: 100%;
    padding-bottom: constant(safe-area-inset-bottom);
    /* 兼容 iOS < 11.2 */
    padding-bottom: env(safe-area-inset-bottom);
    /* 兼容 iOS >= 11.2 */
  }

  .has-no-data {
    width: 100%;
    min-height: 100vh;

    &>image {
      height: 200rpx;
      width: 200rpx;
      margin-bottom: 60rpx;
    }

    .back-button {
      margin-top: 44rpx;
      width: 145rpx;
      height: 68rpx;
      background: rgba($color: #D8D8D8, $alpha: 0.15);
      border-radius: 34rpx;
    }
  }
</style>