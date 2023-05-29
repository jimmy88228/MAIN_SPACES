<template>
  <view class="user-header header flex-s-c relative">
    <auth-button class="avatar-wrapper" open-type="chooseAvatar" @authed="onChooseAvatar">
      <!-- <image v-if="userInfo.profilePicture" class="avatar" :src="userInfo.profilePicture"></image> -->
			<oriImage v-if="userInfo.profilePicture" class="avatar" :src="userInfo.profilePicture"/>
      <view v-else class="avatar-txt"> 点击授权头像 </view>
    </auth-button>
    <!-- <auth-button class="avatar-wrapper" open-type="getUserInfo" @authed="onChooseAvatar">
      <image v-if="userInfo.profilePicture" class="avatar" :src="userInfo.profilePicture"></image>
      <view v-else class="avatar-txt"> 点击授权头像 </view>
    </auth-button> -->
    <view class="name">{{ userInfo.realName || "" }}</view>
  </view>
</template>

<script>
import oriImage from "@/components/ori-comps/image/ori-image"
  const app = getApp();
  const pageOption = Page.BasePage({
    components:{
      oriImage
    },
    name: "user-header",
    props: {
      userInfo: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {
        imgUser: "",
      };
    },
    mounted() {},
    methods: {
      onChooseAvatar(e) {
        // let page = getCurrentPages().slice(-1)[0] || {};
        // console.log("page", page)
        this.$EventBus.$emit("onChooseAvatar", e)
        // let key = `authUserInfo.profilePicture`

        // page.setData({
        // 	[key]: 23123
        // })
        // this.$emit("onChooseAvatar",e)
      },
    },
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .user-header {
    padding: 64rpx;

    .avatar-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 120rpx;
      height: 120rpx;
      padding: 0px !important;
      border-radius: 50%;
      margin-right: 30rpx;
      background-color: #dfdfdf;
      overflow: hidden;
      flex-shrink: 0;

      .avatar {
        // ios不兼容100%
        // width: 100%;
        // height: 100%;

        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        display: block;
      }

      .avatar-txt {
        color: #b2b2b2;
        font-size: 20rpx;
      }
    }

    .name {
      font-size: 38rpx;
    }

    .switch-box {
      padding: 12rpx 15rpx 12rpx 22rpx;
      background: #ed9712;
      border-radius: 25rpx 0 0 25rpx;
      right: 0;
      top: 50%;
      transform: translateY(-50%);

      .icon-switch {
        width: 22rpx;
        height: 22rpx;
        margin-right: 12rpx;
      }
    }
  }
</style>