<template>
  <view class="frame-box">
    <!-- #ifdef H5 -->
    <view class="h5-box flex-c-s">
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
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifdef MP -->
    <slot name="body"></slot>
    <!-- #endif -->
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
        console.log('studentInfo',app.IM.authUserInfo);
        return app.IM.authUserInfo||{}
      }
    },
    methods: {
      logout() {
        app.LM.logout();
        app.LM.logout('bsnUserToken');
        uni.reLaunch({
          url:`/pages/startup/startup?id=${app.PM.getParams('initId')||0}`
        })
      }
    },
  })
  export default  pageOption
</script>

<style lang="scss" scoped>
@media screen and (max-width: $small-screen) {  
  .login-logo {
    width: 90rpx!important;
    height: 90rpx!important;
  }

  .item{
    justify-content: start!important;
  }

  .frame-box{ 
    .box{
      max-width: 690rpx !important; 
      min-width: 400rpx !important;  
    }
  }
}
.frame-box{
  .h5-box{
    background-color: #F0F6EE;
    height: 100vh;
    overflow: scroll;
  }
  .box{
    max-width: 1600rpx; 
    min-width: 1200rpx; 
    height: 100%;
    .header{
      background: #fff;
      border-radius: 12rpx;
      padding:0 15rpx;
      box-sizing: border-box;
      margin-bottom: 30rpx;
      margin-top: 30rpx;
    }
    .login-logo{
      width: 120rpx;
      height: 120rpx;
      // margin-right: 25px;
    }
    .body{
      position: relative;
      background: #fff;
      overflow-y: scroll;
      overflow-x: hidden;
      border-radius: 20rpx;
      margin-bottom: 30rpx;
      text-align: justify;
      word-break: break-all;
    }
    .msg{
      padding-right: 200rpx;
      box-sizing: border-box;
    }
    .item{ 
      position: relative;
      padding: 0 20rpx;
      padding-left: 30rpx;
      box-sizing: border-box;
      flex-wrap: wrap; 
      line-height: 40rpx;
      &::after{
        content: "";
        width: 1px;
        height: 34rpx;
        background: #979797;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      .content {
        word-break: break-all;
        font-family: PingFangSC-Medium;
      }

      &:last-child { 
        &::after{
          display: none; 
        } 
      }
    }
    .left-box{
      position: relative;
      &::after{
        content: "";
        width: 1px;
        height: 70rpx;
        background: #979797;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .right-box{
      .item{ 
        &::after{
          display: none;
        }
      }
    }
    .logout{
      width: 160rpx;
      height: 72rpx;
      background: #FAFAFA;
      border-radius: 12rpx;
    }
  } 
}
</style>