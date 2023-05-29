<template>
  <view :class="!isEmpty ? 'bg_f7' : 'bg_fff'">
    <view class="tutor-page">
      <page-nav>
        <template slot="title"> 选择心理导师 </template>
      </page-nav>
      <view v-if="!isEmpty">
        <view v-for="(pageItem, pageIndex) in tutorList" :key="pageIndex">
          <view class="tutor-item" v-for="(item, index) in pageItem" :key="index" @click="consult"
            :data-consultant-id="item.consultantId">
            <view class="flex-b-c">
              <image class="avatar m-r-25" :src="item.profilePicture" mode="aspectFill" />
              <view class="flex1 clamp">
                <view class="m-b-20 tutor-info">
                  <view class="font-28 bold m-r-15">{{ item.name?item.name:"" }}</view>
                  <view class="font-22 C_7f p-t-10">{{ item.qualification?item.qualification:"" }}</view>
                </view>
                <view class="flex-b-c user-exp">
                  <view class="inline-block">
                    <view class="exp-item">
                      <view class="flex-s-c">
                        <image :src="staticAddress+timeIcon" mode="widthFix" />
                        <view class="C_885200 bold">{{caculateExpTime(item.experienceHour) || 0}}时数</view>
                        <view class="C_7f">经验</view>
                      </view>
                      <view class="split" v-if="item.experienceYear"></view>
                      <view class="C_885200 bold" v-if="item.experienceYear">从业{{item.experienceYear || 0}}年</view>
                    </view>
                  </view>
                  <view class="address flex-s-c" v-if="item.address">
                    <image :src="staticAddress+addressIcon" mode="widthFix" />
                    <view class="C_7f font-22 clamp">{{item.address}}</view>
                  </view>
                </view>
              </view>
            </view>
            <view class="flex f-wrap good-at" v-if="item.fields && item.fields.length>0">
              <view class="good-at-item" v-for="(goodAtITem, goodAtIndex) in item.fields" :key="goodAtIndex">
                {{ goodAtITem }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="absolute empty" v-else>
        <image :src="staticAddress+emptyIcon" class="empty-icon" mode="scaleToFill" />
        <view class="C_B2 font-32">暂无可以咨询的导师哦~</view>
      </view>
    </view>
  </view>
</template>

<script>
  import UniApi from "@/common/support/tools/uni-api-promise";
  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        isEmpty: false,
        pageIndex: 0,
        pageSize: app.Conf.PAGE_SIZE,
        hasMore: true,
        timeIcon: "/time.png",
        addressIcon: "/address.png",
        emptyIcon: "/list-empty.png",
        tutorList: [],
      };
    },
    onReady() {
      this.init();
    },
    methods: {
      init() {
        this.tutorList = [];
        this.pageIndex = 0;
        this.hasMore = true;
        this.isEmpty = false;
        this.loadData();
      },
      loadData() {
        let pageIndex = this.pageIndex ? this.pageIndex + 1 : 1;
        return this.$Http(this.$Apis.selectConsultantByPage, {
            data: {
              pageIndex,
              pageSize: this.pageSize,
            },
          })
          .then((res) => {
            if (res.code == 1) {
              let data = res.data || {};
              this.pageIndex = pageIndex;
              let currPage = pageIndex - 1 ? pageIndex - 1 : 0;
              this.tutorList[currPage] = data.list || [];
              this.hasMore = this.pageIndex * this.pageSize < data.totalCount;
              this.setEmpty(this.tutorList);
              UniApi.stopPullDownRefresh();
            }
            return res;
          })
          .catch(() => {
            this.setEmpty(this.tutorList);
          });
      },
      jump({
        currentTarget
      }) {
        this.jumpAction(dataset.url);
      },
      setEmpty(data) {
        if (data instanceof Array) {
          if (data.length == 0 || !data[0] || (data[0] && data[0].length == 0)) {
            this.isEmpty = true;
          } else {
            this.isEmpty = false;
          }
        } else {
          this.isEmpty = false;
        }
      },
      caculateExpTime(expTime) {
        let time = expTime > 999999 ? '999999+' : expTime
        return time
      },
      consult({
        currentTarget
      }) {
        let dataset = currentTarget.dataset || {};
        this.jumpAction(
          `/pages/psychology/resume/resume?consultantId=${dataset.consultantId}`
        );
      },
    },
    onReachBottom() {
      console.log("到达底部");
      if (this.hasMore) {
        this.loadData();
      }
    },
    onUnload() {},
    onShow() {},
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .tutor-page {
    padding: 18rpx 21rpx 64rpx 21rpx;
    min-height: 100vh;
    box-sizing: border-box;
    width: 100%;

    .tutor-item {
      border-radius: 17rpx;
      background: #ffffff;
      margin-top: 20rpx;

      &>view:first-child {
        padding: 20rpx 32rpx 20rpx 22rpx;
      }

      .avatar {
        flex-shrink: 0;
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        background-color: #efefef;
      }

      .tutor-info {
        &>view {
          display: inline-block;
          max-width: 50%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }

      .user-exp {

        .exp-item {
          display: flex;
          background: #FEF8E5;
          border-radius: 8rpx;
          font-size: 22rpx;
          padding: 10rpx 10rpx;

          image {
            flex-shrink: 0;
            width: 21rpx;
            height: 21rpx;
            margin-right: 10rpx;
          }

          .split {
            transform: translateY(50%);
            height: 18rpx;
            width: 2rpx;
            margin-left: 15rpx;
            margin-right: 15rpx;
            background-color: #B8AC7F;
          }
        }

        .address {
          max-width: 180rpx;

          image {
            flex-shrink: 0;
            width: 17rpx;
            height: 23rpx;
            margin-right: 12rpx;
          }
        }
      }

      .good-at {
        border-top: 2rpx solid #EFEFEF;
        padding-bottom: 23rpx;
        margin: 0 24rpx;

        .good-at-item {
          margin: 18rpx 8rpx 0rpx 0rpx;
          padding: 7rpx 12rpx;
          color: rgba($color: $uni-main-color, $alpha: 0.8);
          margin-right: 8rpx;
          font-size: 22rpx;
          background: #F4F4F4;
          border-radius: 6rpx;
        }
      }


      .consult {
        padding: 11rpx 24rpx;
        background: #f2fbff;
        border-radius: 10rpx;
        font-size: 26rpx;
        color: #008acb;
        font-weight: bold;
        flex-shrink: 0;
      }
    }
  }

  // 暂无数据
  .empty {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    .empty-icon {
      width: 254rpx;
      height: 254rpx;
      margin-bottom: 47rpx;
      margin: 0 auto;
    }
  }
</style>