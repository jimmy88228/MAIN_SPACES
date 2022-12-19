<template>
  <view class="user-header header flex-s-c relative">
    <!-- <image class='img-user' :src="imgUser" mode="aspectFit" /> -->
    <!-- <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
		  <image v-if="imgUser" class="avatar" :src="imgUser"></image>
			<view v-else class="avatar-txt"> 点击授权头像 </view>
		</button> -->
    <auth-button class="avatar-wrapper" open-type="getUserInfo" @authed="onChooseAvatar">
      <image v-if="userInfo.profilePicture" class="avatar" :src="userInfo.profilePicture"></image>
      <view v-else class="avatar-txt"> 点击授权头像 </view>
    </auth-button>
    <view>
      <view class="name m-b-10">{{ userInfo.realName || "" }}</view>
      <view class="change-platform flex-s-c" @click="loadPlatFormList">
        <image class="platform-logo" :src="platformInfo.smallLogo" mode="scaleToFill" />
        <view class="font-20 C_333">{{platformInfo.customerName || ''}}</view>
        <image v-if="watchPlatformCount>1" class="platform-change-logo m-l-15" :src="staticAddress+'/change-grey.png'" mode="scaleToFill" />
      </view>
    </view>
    <platform-select :platformSaveInfo="platformInfo" ref="pls" :safeArea="TabbarSafeArea" @selected="selectPlatform"
      :formData="{mobilePhone:userInfo.mobilePhone}">
    </platform-select>

  </view>
</template>

<script>
  import platformSelect from "@/components/platform-select/platform-select"
import { mapGetters } from "vuex";

  const app = getApp();
  const pageOption = Page.BasePage({
    name: "user-header",
    props: {
      userInfo: {
        type: Object,
        default: () => {
          return {}
        },
      },
      platformInfo: {
        type: Object,
        default: () => {
          return {}
        }
      },
      safeArea: {
        type: Number,
        default: 0
      },
    },
    data() {
      console.log("user-header", this.$root);
      return {
        imgUser: "",
        platformData: "",
        rootPageState: this.$root.pageState,
      };
    },
    components: {
      platformSelect
    },
    computed:{
      ...mapGetters([
        "watchPlatformCount"
      ])
    },
    watch: {
      userInfo: {
        handler(newVal, oldVal) {
          console.log(newVal, "获得的数据")
        },
        immediate: true
      },
      '$root.pageState': {
        handler(newVal, oldVal) {
          console.log(newVal, "rootPageState")
        },
        immediate: true
      },
      watchPlatformCount:{
        handler(newVal,oldVal){
          console.log(newVal,"当前主体数量")
        },
        immediate:true
      }
    },
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
      loadPlatFormList() {
        if(this.watchPlatformCount>1) this.$refs.pls.loadData()
      },
      setPhoneNumber() {
        return this.$Http(this.$Apis.setPhoneNumber, {
          data: {
            sessionId: app.LM.sessionId
          }
        })
      },
      selectPlatform(e) {
        console.log(e, "选择的平台")
        console.log(this.platformInfo, "当前")
        let holdSessionId = app.LM.sessionId;

        if (e.appCode == this.platformInfo.appCode) {
          return
        } else {
          app.SMH.showLoading();
          this.setPhoneNumber().then(res => {
            app.PLM.savePlatformInfo(e)
            // 重新登录
            return this._checkLogin(null, false).then((isLogin) => {
              if (isLogin) {
                this.$emit("changedPlatform")
              } else {
                if (res.code) {
                  // return;
                  return this.register(holdSessionId).then(() => {
                    return this._checkLogin(null, false).then(() => {
                      this.$emit("changedPlatform")
                    })
                  }).catch(() => {
                    console.log(err)
                  })
                }
              }
            })
          }).catch(()=>{

          })

        }
      },
      register(holdSessionId) {

        let api = this.$Apis.register;

        return this.$Http(api, {
            data: {
              ...this.userInfo,
              sessionId: holdSessionId
            },
            other: {
              isShowLoad: true,
            },
          })
          .then((res) => {
            if (res.code == 1) {

              return res;
            }
            return Promise.reject(res);
          })
          .catch((e) => {
            return Promise.reject(e);
          });
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
        width: 100%;
        height: 100%;
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

    .change-platform {
      background: #F8F8F8;
      border-radius: 20rpx;
      padding: 6rpx 15rpx;

      .platform-logo {
        width: 24rpx;
        height: 24rpx;
        border-radius: 50%;
        margin-right: 7rpx;
      }

      .platform-change-logo {
        width: 21rpx;
        height: 17rpx;
      }
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