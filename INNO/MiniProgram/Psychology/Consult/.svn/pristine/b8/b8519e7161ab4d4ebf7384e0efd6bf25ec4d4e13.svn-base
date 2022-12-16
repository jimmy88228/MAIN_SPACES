<template>
  <view>
    <view class="tutor-resume-page">
      <page-nav></page-nav>
      <view class="user-avatar-info-area" @click="previewImage" :style="{'top':navplace+'px'}">
        <view class="user-avatar-info" :style="{ 'background-image': `url(${tutorInfo.profilePicture})` }">
        </view>
        <image class="user-avatar" :src="tutorInfo.profilePicture" mode="scaleToFill" />
      </view>
      <view class="user-info" :style="{'min-height': `calc(100vh - 421rpx - ${navplace}px)`}" v-if="!!tutorInfo">
        <view class="user-info-top">
          <view class="m-b-40 flex-s-c flex-wrap">
            <view class="font-38 bold m-r-20 clamp" style="max-width:50%;">{{ tutorInfo.name?tutorInfo.name:"" }}</view>
            <view class="font-24 C_7f p-t-15 clamp">{{ tutorInfo.qualification?tutorInfo.qualification:"" }}</view>
          </view>
          <view class="flex-b-c user-exp">
            <view class="inline-block">
              <view class="exp-item">
                <view class="flex-s-c">
                  <image :src="staticAddress+timeIcon" mode="widthFix" />
                  <view class="C_885200 bold">{{caculateExpTime(tutorInfo.experienceHour) || 0}}时数</view>
                  <view class="C_7f">经验</view>
                </view>
                <view class="split" v-if="tutorInfo.experienceYear"></view>
                <view class="C_885200 bold" v-if="tutorInfo.experienceYear">从业{{tutorInfo.experienceYear || 0}}年</view>
              </view>
            </view>
            <view class="address flex-s-c" v-if="tutorInfo.address">
              <image :src="staticAddress+addressIcon" mode="widthFix" />
              <view class="C_7f font-24 clamp">{{tutorInfo.address}}</view>
            </view>
          </view>
          <!-- <view class="m-r-25 C_B2 m-b-20">擅长领域</view> -->
          <view class="flex f-wrap good-at" v-if="tutorInfo.fields && tutorInfo.fields.length>0">
            <view class="good-at-item" v-for="(item, i) in tutorInfo.fields" :key="i">
              {{ item }}
            </view>
          </view>
        </view>
        <view class="split"></view>
        <view class="user-info-bottom">
          <view class="user-info-item" v-for="(detailItem,detailIndex) in tutorInfo.detailList" :key="detailIndex">
            <view class="user-info-title C_7f font-26"> {{detailItem.title?detailItem.title:""}} </view>
            <view class="user-info-detail C_50 font-26">
              <text user-select>
                {{ detailItem.info?detailItem.info:"" }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom-area flex flex-c-c">
      <view class="bottom-button flex flex-c-c C_fff font-30 bold" @click="reserve">预约咨询</view>
    </view>
  </view>
</template>

<script>
  import SIH from "@/common/helper/sys-infos-handler"

  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        timeIcon: "/time.png",
        addressIcon: "/address.png",
        options: {},
        value: "",
        tutorInfo: {},
        navplace: SIH.navPlace
      };
    },
    onLoad(options) {
      this.options = options;
    },
    onReady() {
      this.loadData();
    },
    methods: {
      loadData() {
        this.$Http(this.$Apis.getConsultantById, {
          data: {
            id: this.options.consultantId || 0,
          },
        }).then((res) => {
          let data = res.data;
          let detailList = []
          data.detailList.forEach((item, i) => {
            if (item.info) detailList.push(item)
          })
          data.detailList = detailList;
          this.tutorInfo = res.data
        });
      },
      reserve() {
        let consultantId = this.options.consultantId;
        this.jumpAction(`/pages/psychology/reserve/reserve?consultantId=${consultantId}`);
      },
      previewImage() {
        let imageList = []
        imageList.push(this.tutorInfo.profilePicture)
        uni.previewImage({
          urls: imageList,
          longPressActions: {
            itemList: ['发送给朋友', '保存图片', '收藏']
          }
        });
      },
      caculateExpTime(expTime) {
        let time = expTime > 999999 ? '999999+' : expTime
        return time
      }
    },
    onUnload() {},
    onShow() {},
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .tutor-resume-page {
    width: 100%;
    min-height: 100vh;
    position: relative;

    .user-avatar-info-area {
      position: sticky;

      .user-avatar-info {
        width: 100%;
        height: 421rpx;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        background-color: #EFEFEF;
        position: fixed;
        filter: blur(100px);
        z-index: -1;
      }

      .user-avatar {
        margin: 0 auto;
        background-color: #EFEFEF;
        width: 400rpx;
        height: 400rpx;
      }
    }

    .user-info {
      position: relative;
      width: 100%;
      background: #ffffff;
      border-radius: 21rpx 21rpx 0 0;

      .user-info-top {
        padding: 40rpx;
      }

      .user-exp {
        padding-bottom: 27rpx;

        .exp-item {
          display: flex;
          background: linear-gradient(270deg, rgba($color: #FFE31F, $alpha: 0.1) 0%, rgba($color: #F1B400, $alpha: 0.1) 100%);
          border-radius: 8rpx;
          font-size: 24rpx;
          padding: 20rpx;

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
            margin-left: 25rpx;
            margin-right: 25rpx;
            background-color: #B8AC7F;
          }
        }

        .address {
          max-width: 200rpx;

          image {
            flex-shrink: 0;
            width: 17rpx;
            height: 23rpx;
            margin-right: 12rpx;
          }
        }
      }


      .good-at {
        padding-top: 10rpx;
        border-top: 2rpx solid rgba($color: #979797, $alpha: 0.3);

        .good-at-item {
          margin: 18rpx 8rpx 0rpx 0rpx;
          padding: 5rpx 12rpx;
          color: #6186D0;
          margin-right: 8rpx;
          font-size: 22rpx;
          background: #F4F4F4;
          border-radius: 6rpx;
        }
      }

      .split {
        height: 20rpx;
        width: 100%;
        background: #f8f8f8;
      }

      .user-info-bottom {
        padding-bottom: 240rpx;


        .user-info-item {
          position: relative;
          padding-top: 43rpx;

          .user-info-title {
            border-left: 8rpx solid #008acb;
            padding-left: 47rpx;
          }

          .user-info-detail {
            width: 645rpx;
            margin: 30rpx auto 0;
            line-height: 52rpx;
            padding-bottom: 30rpx;
            border-bottom: 2rpx solid #dddddd;
          }

          
        }
        .user-info-item:last-child{
          .user-info-detail {
            border-bottom: none;
          }
        }


      }

    }
  }

  .bottom-area {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    width: 750rpx;
    height: 140rpx;
    background: #ffffff;
    box-sizing: border-box;

    .bottom-button {
      width: 660rpx;
      height: 100rpx;
      background: #06509b;
      border-radius: 16rpx;
    }
  }
</style>