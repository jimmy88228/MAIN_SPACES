<template>
  <view class="reserve-supervise-list" :style="isEmpty ? 'background-color: #fff;' : ''">
    <page-nav>
      <template slot="title">
        <view>预约督导</view>
      </template>
    </page-nav>
    <template v-if="!isEmpty">
      <view class="reserve-list">
        <view v-for="(pageItem,pageIndex) in reserveList" :key="pageIndex">
          <view class="reserve-item" v-for="(item,i) in pageItem" :key="i" @click="showInfo(pageIndex, i)">
            <view class="flex-b-c m-b-40">
              <view>
                <view class="font-20 C_8E m-b-15">{{formatDate(item.createTime,'createTime')}}</view>
                <view class="bold C_333 font-30">预约督导师</view>
              </view>
              <view class="status flex-c-c" v-if="item.state == 0">待处理</view>
              <view class="status status-finish flex-c-c" v-else>已完成</view>
            </view>
            <view class="reserve-info-item flex">
              <view>咨询方向</view>
              <view class="clamp C_333 font-26">{{item.directionConsultation}}</view>
            </view>
            <view class="reserve-info-item flex" v-if="item.description">
              <view>备注</view>
              <view class="clamp2 C_333 font-26">{{item.description}}</view>
            </view>
            <view class="reserve-success flex" v-if="item.state == 1">
              <image :src="staticAddress+informationIcon" mode="widthFix" />
              <view>
                <view class="bold C_333 m-b-15">预约成功</view>
                <view class="flex font-26">
                  <view class="C_7f f-shrink-0 m-r-10 m-b-15" style="width:105rpx">预约日期</view>
                  <view class="C_333">{{formatDate(item.consultDate,'consultDate')}}</view>
                </view>
                <view class="flex font-26">
                  <view class="C_7f f-shrink-0 m-r-10 m-b-15" style="width:105rpx">督导方式</view>
                  <view class="C_333">{{item.confirmSuperviseWay}}</view>
                </view>
                <view class="flex font-26">
                  <view class="C_7f f-shrink-0 m-r-10 m-b-15" style="width:105rpx">督导师</view>
                  <view class="C_333">{{item.supervisor}}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <empty>暂无预约督导哦~</empty>
    </template>
    <view class="reserve-botton flex-c-c font-30" @click="reserve">
      预约督导师
    </view>
    <ori-popup @touchmove.stop.prevent="disabledScroll" ref="popup" type="bottom" :is-mask-click="true"
      :safe-area="false">
      <template v-slot:content>
        <view class="popup-content">
          <image class="close-icon" :src="closeIcon" mode="widthFix" @click="closePupup" />
          <view class="font-24 popup-title flex-s-c m-b-32">
            <view class="m-r-20 C_8E">
              {{ reserveList[selectIndex.pageIndex] && reserveList[selectIndex.pageIndex][selectIndex.itemIndex] && formatDate(reserveList[selectIndex.pageIndex][selectIndex.itemIndex].createTime,'createTime') || "" }}
            </view>
            <view class="C_333 bold popup-consultant-name clamp">预约督导师</view>
            <view class="status-popup status-padding"
              v-if="reserveList[selectIndex.pageIndex]&&reserveList[selectIndex.pageIndex][selectIndex.itemIndex].state == 0">
              待处理</view>
            <view class="status-popup status-success" v-else>已完成</view>
          </view>

          <view>
            <template
              v-if="reserveList[selectIndex.pageIndex] && reserveList[selectIndex.pageIndex][selectIndex.itemIndex].description">
              <scroll-view :scroll-y="true" class="scroll-view-info">
                <text
                  class="font-26 C_8E">{{ reserveList[selectIndex.pageIndex] && reserveList[selectIndex.pageIndex][selectIndex.itemIndex].description}}</text>
              </scroll-view>
            </template>
            <template v-else>
              <view class="empty-list">
                <image class="empty-icon" :src="staticAddress+emptyIcon" mode="widthFix" />
                <view class="C_B2 font-32">该预约没有备注哦~</view>
              </view>
            </template>
          </view>
        </view>
      </template>
    </ori-popup>
  </view>
</template>

<script>
  import oriPopup from "@/components/ori-comps/popup/ori-popup";

  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        informationIcon: "/information.png",
        emptyIcon: "/list-empty.png",
        reserveList: [],
        // 分页
        isEmpty: false,
        pageIndex: 0,
        pageSize: app.Conf.PAGE_SIZE,
        hasMore: true,
        selectIndex: {
          pageIndex: 0,
          itemIndex: 0,
        },
      }
    },
    components: {
      oriPopup
    },
    onShow() {
      if (this.clickPage) this.pageIndex = this.clickPage - 1 || 0;
      this.loadData();
    },
    // onShareAppMessage(e){},
    methods: {
      disabledScroll() {
        return false
      },
      initList() {
        this.reserveList = [];
        this.pageIndex = 0;
        this.hasMore = true;
        this.isEmpty = false;
        this.loadData();
      },
      loadData() {
        let pageIndex = this.pageIndex ? this.pageIndex + 1 : 1;
        this.$Http(this.$Apis.selectSupervisorAppointmentByPage, {
          data: {
            pageIndex: pageIndex,
            pageSize: this.pageSize
          },
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data || {};
            data.list.forEach(item=>{
              item.description = item.description.trim()
            })
            this.pageIndex = pageIndex;
            let currPage = pageIndex - 1 ? pageIndex - 1 : 0;
            this.reserveList[currPage] = data.list || [];
            this.hasMore = this.pageIndex * this.pageSize < data.totalCount;
            this.setEmpty(this.reserveList);
          }
          return res;
        });
      },
      formatDate(date, dateType) {
        if (dateType == "createTime") {
          return date.slice(0, 16)
        }
        if (dateType == "consultDate") {
          let Year = `${date.slice(0,4)}年`;
          let Month = `${date[5] == '0'?date.slice(6,7):date.slice(5,7)}月`;
          let Date = `${date[8] == '0'?date.slice(9,10):date.slice(8,10)}日`
          return Year + Month + Date
        }
      },
      reserve() {
        this.clickPage = this.pageIndex
        this.jumpAction("/pages/work-bench/reserve-supervise/reserve-supervise")
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
      showInfo(pageIndex, itemIndex) {
        this.selectIndex = {
          pageIndex,
          itemIndex,
        };
        let ref = "popup";
        this.$refs[ref].show();
        console.log(pageIndex, itemIndex);
      },
      closePupup() {
        let ref = "popup";
        this.$refs[ref].dismiss();
      },
    },
    onReachBottom() {
      if (this.hasMore) {
        this.loadData();
      }
    },
    onReady() {

    }
  })
  export default pageOption
</script>

<style lang="scss" scoped>
  .reserve-supervise-list {
    min-height: 100vh;
    background-color: #F7F7F7;

    .reserve-list {
      padding: 25rpx 25rpx 150rpx;

      .reserve-item {
        background: #FFFFFF;
        border-radius: 12rpx;
        padding: 30rpx;
        margin-bottom: 22rpx;

        .status {
          width: 98rpx;
          height: 36rpx;
          background: #F9FFF9;
          border-radius: 18rpx;
          border: 2rpx solid #D7F3D7;
          font-size: 22rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #1EA511;
        }

        .status-finish {
          background: #F8F8F8 !important;
          border: 1px solid #EFEFEF !important;
          color: #B2B2B2 !important;
        }

        .reserve-info-item {
          margin-bottom: 30rpx;

          &>view:first-child {
            margin-right: 26rpx;
            width: 105rpx;
            flex-shrink: 0;
            font-size: 26rpx;
            color: #7F7F7F;
          }
        }

        .reserve-success {
          padding: 30rpx 40rpx;
          background-color: rgba($color: #9DD6F0, $alpha: 0.1);
          border-radius: 6rpx;

          &>image {
            width: 69rpx;
            height: 69rpx;
            border-radius: 6rpx;
            margin-right: 35rpx;
          }
        }
      }
    }
  }

  .reserve-botton {
    position: fixed;
    bottom: 30rpx;
    right: 25rpx;
    width: 288rpx;
    height: 100rpx;
    background: $uni-main-color;
    color: #FFFFFF;
    border-radius: 50px;
  }

  .status-padding {
    border-color: #6bd361;
    background: #efffee;
    color: #21b014;
  }

  .status-success {
    border-color: #efefef;
    background: #f8f8f8;
    color: #b2b2b2;
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
      width: 34rpx;
      height: 34rpx;
    }

    .popup-consultant-name {
      max-width: 230rpx;
    }

    .status-popup {
      display: inline-block;
      margin-left: 20rpx;
      padding: 5rpx 13rpx;
      border-radius: 33rpx;
      border-width: 2rpx;
      border-style: solid;
    }

    .scroll-view-info {
      height: 550rpx;
      width: 100%;
      line-height: 50rpx;
    }
  }
  .empty-list {
    height: 550rpx;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .empty-icon {
      width: 254rpx;
      height: 254rpx;
      margin-bottom: 47rpx;
      margin: 0 auto;
    }
  }
</style>