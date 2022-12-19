<template>
  <view class="frame-box" :class="[platform]">
    <loading-box :showPage="showPage" :isShowLoad="isShowLoad">
      <!-- #ifdef H5 -->
      <view class="H5-box H5 flex-s-s flex-col">
        <view class="header flex-b-c" v-if="isShowH5Header">
          <view class="msg flex1 flex-s-c" :class="[isMobile?'font-18':'font-24']"
            :style="screenWidth <= 960?'padding-right:0;':''">
            <image class="login-logo" :src="studentInfo.schoolLogo || ''" mode="aspectFit"></image>
            <template v-if="screenWidth > 960">
              <view v-for="(item) in msgList" :key="item.key" class="flex-c-c item flex1">
                <view class="C_7f p-r-10 p-t-5">{{item.title || ""}}</view>
                <view class="content font-30 p-r-10 bold">{{studentInfo[item.key] || ""}}</view>
              </view>
            </template>
            <template v-if="screenWidth <= 960">
              <view class="left-box">
                <view class="flex-c-c item flex1">
                  <view class="C_7f p-r-10">姓名</view>
                  <view class="content bold ">{{studentInfo.name || ""}}</view>
                </view>
              </view>
              <view class="right-box">
                <template v-for="(item,index) in msgList">
                  <view :key="item.key" v-if="index != 0" class="flex-c-c item flex1">
                    <view class="C_7f p-r-10">{{item.title || ""}}</view>
                    <view class="content bold ">{{studentInfo[item.key] || ""}}</view>
                  </view>
                </template>
              </view>
            </template>
          </view>
          <button class="logout C_7f flex-c-c" :class="[isMobile?'font-18':'font-24']" @click="logout">退出登录</button>
        </view>
        <view class="body flex1">
          <slot name="body"></slot>
        </view>
        <view class="footer">
          <slot name="footer"></slot>
        </view>
      </view>
      <!-- #endif -->

      <!-- #ifdef MP -->
      <view class="MP-box MP">
        <view class="body">
          <slot name="body"></slot>
        </view>
        <view class="footer">
          <slot name="footer"></slot>
        </view>
      </view>
      <!-- #endif -->
    </loading-box>

    <view class="common-box" :class="[platform]">
      <slot name="common"></slot>
    </view>
  </view>
</template>

<script>
  import StorageH from "@/common/helper/storage-handler.js";
  import utils from '@/common/support/utils.js';
  const app = getApp();
  const pageOption = Page.BaseComp({
    props: {
      isShowH5Header: {
        type: Boolean,
        default: true
      },
      isShowLoad: {
        type: Boolean,
        default: false
      },
      showPage: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        msgList: [{
            title: "姓名",
            key: "name"
          }, {
            title: "学号",
            key: "studentNumber"
          },
          {
            title: "班级",
            key: "classFullName"
          }
        ],
        screenWidth: 0,
        initScreenWidth: 0,
      }
    },
    mounted() {
      console.log(StorageH.get('CUSTOMER_INFO'), "获取图片")
      // #ifdef H5
      this.watchScreen()
      //#endif 
    },
    computed: {
      studentInfo() {
        return app.IM.bsnUserInfo || {}
      },
    },
    methods: {
      logout() {
        app.LM.logout().logout('bsnUserToken');
        // let startUpUrlParams = utils.paramsByJson(app.PM.getParams('startUp')||{});
        this.reLaunchAction(
          `/pages/startup/startup?id=${app.PM.getParams('initId')||0}&schoolId=${app.PM.getParams('schoolId')||0}&campusId=${app.PM.getParams('campusId')||0}&classId=${app.PM.getParams('classId')||0}`
        )
      },
      // H5监听屏幕的宽度
      watchScreen() {
        this.screenWidth = document.body.clientWidth
        this.initScreenWidth = document.body.clientWidth
        window.onresize = () => {
          //屏幕尺寸变化
          return (() => {
            this.screenWidth = document.body.clientWidth
          })()
        }
      }
    },
    watch: {
      // #ifdef H5
      screenWidth: {
        handler(nV, oV) {
          if (this.initScreenWidth < 580 && nV > 580) {
            location.reload();
          }
        },
        iddmatiate: true
      }
      //#endif 
    }
  })
  export default pageOption
</script>

<style lang="scss" scoped>
  @import "./H5.scss"
</style>