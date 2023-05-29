<template>
  <view>
    <!-- <ori-popup @touchmove.stop.prevent="disabledScroll" @change="popupChange" ref="popup" type="bottom"
      :is-mask-click="true" :mask-background-color="'rgba(0,0,0,0)'" @close="close" :safe-area="false">
      <template v-slot:content>
        <view class="popup-content" :style="{height:`calc(${popupHeight}px - 500rpx)`}">
          <view class="popup-title flex-b-c">
            <view class="bold font-28">课程目录</view>
            <image @click="hideBench" :src="requireStatic('/course-video/close_popup.png')" mode="aspectFit" />
          </view> -->
    <scroll-view :scroll-with-animation="true" :scroll-anchoring="true" :scroll-into-view="scrollIntoView" class="course-scroll-view"
      :style="{height:`${scrollHeight}px`,'overflow-anchor':'auto'}" scroll-y>
      <view class="course-scroll-view-inset">
        <uni-collapse :accordion="true" @change="changeItem">
          <uni-collapse-item :id="'ids'+chaptersItem.id" :open="chaptersItem.open"
            v-for="(chaptersItem,chaptersIndex) in courseDetail.chaptersList" class="m-b-20" :show-arrow="false"
            :border="false" :title-border="'none'" :key="chaptersIndex">
            <template v-slot:title>
              <view class="collapse-item-custom">
                <view class="course-scroll-view-title-group flex-b-c">
                  <view class="course-scroll-view-title font-26 C_333 bold">
                    {{chaptersIndex+1+'.' + chaptersItem.chapterName}}</view>
                  <template v-if="chaptersItem.hadLearnCount != chaptersItem.totalCount">
                    <view class="course-scroll-view-v`alue font-22 C_333">
                      待完成{{chaptersItem.hadLearnCount}}/{{chaptersItem.totalCount}}节</view>
                  </template>
                  <template v-else>
                    <view class="course-scroll-view-value font-22 C_333 opa-30">已完成</view>
                  </template>
                  <image :class="chaptersItem.open?'image-act':''" :src="requireStatic('/course-video/arrow.png')"
                    mode="aspectFit" />
                </view>
              </view>
            </template>
            <view class="sItem-style" v-for="(sItem,sIndex) in chaptersItem.subsections" :key="sIndex">
              <template v-if="sItem.subsectionType == 'group'">
                <view class="course-scroll-view-haschild">
                  <view class="course-scroll-view-child-title font-24 m-r-15 p-t-32">
                    {{sItem.classI+'.' + sItem.subsectionName}}
                  </view>
                  <view class="course-scroll-view-child flex-s-c" :data-chapters-index="chaptersIndex"
                    :data-s-index="sIndex" :data-c-index="cIndex" :data-item="cItem" @click="clickItem"
                    v-for="(cItem,cIndex) in sItem.contentList" :key="cIndex">
                    <view class="course-scroll-view-child-title font-24 m-r-15"
                      :style="lightId == cItem.id ? 'color:#52B200':''" :class="cItem.isFinish == 1 ? ' C_B2':''">
                      {{cItem.contentName}}</view>
                    <view v-if="cItem.contentType == 'video'" class="course-scroll-view-child-tips">视频</view>
                    <view v-else-if="cItem.contentType == 'audio'" class="course-scroll-view-child-tips">音频</view>
                    <view v-else-if="cItem.contentType == 'exam'" class="course-scroll-view-child-tips">测验</view>
                    <image v-if="cItem.needlock" :src="requireStatic('/course-video/lock.png')" mode="aspectFit" />
                  </view>
                </view>
              </template>
              <template>
                <view :data-chapters-index="chaptersIndex" :data-s-index="sIndex" :data-item="sItem" @click="clickItem">
                  <template v-if="sItem.contentType == 'video'">
                    <view class="course-scroll-view-child flex-s-c">
                      <view class="course-scroll-view-child-title font-24 m-r-15"
                        :style="lightId == sItem.id ? 'color:#52B200':''" :class="sItem.isFinish == 1 ? ' C_B2':''">
                        {{sItem.contentName}}</view>
                      <view class="course-scroll-view-child-tips">视频</view>
                      <image v-if="sItem.needlock" :src="requireStatic('/course-video/lock.png')" mode="aspectFit" />
                    </view>
                  </template>
                  <template v-if="sItem.contentType == 'audio'">
                    <view class="course-scroll-view-child flex-s-c">
                      <view class="course-scroll-view-child-title font-24 m-r-15"
                        :style="lightId == sItem.id ? 'color:#52B200':''" :class="sItem.isFinish == 1 ? ' C_B2':''">
                        {{sItem.contentName}}</view>
                      <view class="course-scroll-view-child-tips">音频</view>
                      <image v-if="sItem.needlock" :src="requireStatic('/course-video/lock.png')" mode="aspectFit" />
                    </view>
                  </template>
                  <template v-else-if="sItem.contentType == 'exam'">
                    <view class="course-scroll-view-child flex-s-c">
                      <view class="course-scroll-view-child-title font-24 m-r-15"
                        :style="lightId == sItem.id ? 'color:#52B200':''" :class="sItem.isFinish == 1 ? ' C_B2':''">
                        {{sItem.contentName}}</view>
                      <view class="course-scroll-view-child-tips">测验</view>
                      <image v-if="sItem.needlock" :src="requireStatic('/course-video/lock.png')" mode="aspectFit" />
                    </view>
                  </template>
                </view>
              </template>
            </view>
          </uni-collapse-item>
        </uni-collapse>
      </view>
    </scroll-view>
    <!-- </view>
      </template>
    </ori-popup> -->
  </view>
</template>

<script>
  import SMH from "@/common/helper/show-msg-handler.js"
  import courseManage from "@/common/manager/course-manage.js";

  const app = getApp();
  const pageOption = Page.BasePage({
    props: {
      activityId:{
        type: Number,
        default: 0
      },
      courseDetail: {
        type: Object,
        default: {}
      },
      "scroll-into-view": {
        type: String,
        default: ''
      },
      scrollHeight: {
        type: Number,
        default: 0
      },
      lightId: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {};
    },
    computed: {
      ids() {
        let scrollIntoView = this.scrollIntoView;
        console.log(scrollIntoView, "scroll-into-view");
        return scrollIntoView
      },
    },
    methods: {
      // caculatePopupHeight() {
      //   this.popupHeight = app.SIH.screenHeight - app.SIH.navPlace
      // },
      changeItem(e) {
        console.log(e)
        let chaptersList = JSON.parse(JSON.stringify(this.courseDetail.chaptersList))
        for (let i = 0; i < chaptersList.length; i++) {
          chaptersList[i].open = false
          // e.forEach(item => {
          if (e || e === 0) {
            chaptersList[e].open = true
          }
          // })
        }
        this.$set(this.courseDetail, "chaptersList", chaptersList)
        courseManage.changeOpenTap(e)
      },
      clickItem({
        currentTarget
      }) {
        let clickItem = currentTarget.dataset.item;
        if (clickItem.needlock) {
          SMH.showToast({
            title: '请按顺序解锁课题噢'
          })
          return
        }
        if(!courseManage.recordId){
          courseManage.getRecordId(this.activityId)
        }
        console.log("currentTarget", currentTarget);
        let chaptersIndex = String(currentTarget.dataset.chaptersIndex) || "";
        let sIndex = String(currentTarget.dataset.sIndex) || "";
        let cIndex = currentTarget.dataset.cIndex;
        let chaptersList = this.courseDetail.chaptersList;
        let object = {
          clickItem,
          chaptersIndex,
          sIndex,
          cIndex
        }
        courseManage.setScrollIds(chaptersList[chaptersIndex].id)
        this.$emit("clickItem", object)
      },

    },
    onShow() {

    },
  });
  export default pageOption;
</script>

<style lang="scss">
  .course-scroll-view-inset {
    padding: 0 40rpx 40rpx;

    .sItem-style {
      border-bottom: 1px solid #EFEFEF;
    }

    .sItem-style:last-child {
      border-bottom: none;
    }

    .collapse-item-custom {
      // padding: 32rpx 35rpx;

      border-radius: 6rpx;
      background: #F8F8F8;

      .course-scroll-view-title-group {
        padding: 32rpx 70rpx 32rpx 35rpx;
        position: relative;

        .course-scroll-view-title {
          max-width: 300rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .course-scroll-view-value {}

        &>image {
          position: absolute;
          top: 46rpx;
          right: 32rpx;
          width: 26rpx;
          height: 13rpx;
          transition: 0.3s all;
        }

        .image-act {
          transform: rotate(180deg);
        }
      }

    }

    .course-scroll-view-haschild {
      padding: 0rpx 0rpx 0rpx 35rpx;
    }


    .course-scroll-view-child {
      padding: 32rpx 35rpx;
      border-bottom: 1px solid #EFEFEF;
      position: relative;

      .course-scroll-view-child-title {
        max-width: 400rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .course-scroll-view-child-tips {
        flex-shrink: 0;
        padding: 0 6rpx;
        font-size: 18rpx;
        color: #52B200;
        background: rgba($color: #E2EDCF, $alpha: 0.67);
        line-height: 25rpx;
      }

      &>image {
        position: absolute;
        width: 24rpx;
        height: 28rpx;
        right: 18rpx;
        top: 50%;
        opacity: 0.2;
        transform: translateY(-50%);
      }
    }

    .course-scroll-view-child:last-child {
      border-bottom: none;
    }
  }
</style>