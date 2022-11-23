<template>
  <view class="frame-box">
    <!-- #ifdef H5 -->
    <view class="H5-box H5 flex-c-s">
      <view class="box flex-s-s flex-col">
        <view class="header flex-b-c">
          <view class="msg flex1 flex-s-c" :class="[isMobile?'font-18':'font-24']" :style="isMobile?'padding-right:0;':''">
            <image class="login-logo" :src="staticAddress+'/logo.png'" mode="aspectFit"></image>
            <template v-if="!isMobile">
              <view v-for="(item) in msgList" :key="item.key" class="flex-c-c item flex1" >
                <view class="C_7f p-r-10">{{item.title || ""}}</view>
                <view class="content C_7f p-r-10">{{studentInfo[item.key] || ""}}</view>
              </view>
            </template>
            <template v-if="isMobile">
              <view class="left-box"> 
                <view class="flex-c-c item flex1">
                  <view class="C_7f p-r-10">姓名</view>
                  <view class="content C_7f ">{{studentInfo.name || ""}}</view>
                </view>
              </view>
              <view class="right-box"> 
                <template v-for="(item,index) in msgList" >
                  <view :key="item.key" v-if="index != 0" class="flex-c-c item flex1">
                    <view class="C_7f p-r-10">{{item.title || ""}}</view>
                    <view class="content C_7f ">{{studentInfo[item.key] || ""}}</view>
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

    <view class="common-box" :class="[platform]">
      <slot name="common"></slot>
    </view>
  </view>
</template>

<script>
	const app = getApp();
  const pageOption = Page.BaseComp({
    data() {
      return {
				msgList: [
          {
						title: "姓名",
						key: "name"
					},{
						title: "学号",
						key: "studentNumber"
					},
					{
						title: "班级",
						key: "classFullName"
					}
				],
      }
    },
    computed: { 
      studentInfo() {
        return app.IM.authUserInfo||{}
      }
    },
    methods: {
      logout() {
        app.LM.logout().logout('bsnUserToken');
        uni.reLaunch({
          url:`/pages/startup/startup?id=${app.PM.getParams('initId')||0}`
        })
      }
    },
  })
  export default  pageOption
</script>

<style lang="scss" scoped>
@import "./H5.scss"
</style>