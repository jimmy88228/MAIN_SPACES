<template>
  <view class="service-box">
    <view class="service-item flex-s-c" @click="jump(item.code)" v-for="(item, index) in serviceList" :key="index"
      v-if="item.is_enable == 1" :alt="item.type_name">
      <!-- <image class="icon" :src="item.icon || imgPath[item.code]" mode="aspectFit" /> -->
      <oriImage :showLoading="false" customStyle="margin: 0 64rpx;width: 55rpx; height: 55rpx;" :src="item.icon || imgPath[item.code]" mode="aspectFit" />
      <view class="title">{{ item.name }}</view>
      <view class="arrow"></view>
    </view>
    <view class="service-item flex-s-c" @click="logOut">
      <oriImage :showLoading="false" customStyle="margin: 0 64rpx;width: 55rpx; height: 55rpx;" :src="requireStatic(imgPath['LOG-OUT'])" mode="aspectFit" />
      <!-- <image class="icon" :src="requireStatic(imgPath['LOG-OUT'])" mode="aspectFit" /> -->
      <view class="title">退出登录</view>
      <view class="arrow"></view>
    </view>
  </view>
</template>

<script>
  import oriImage from "@/components/ori-comps/image/ori-image"
  const pageOption = Page.BasePage({
    name: "user-service",
    components: {
      oriImage,
    },
    props: {
      moduleInfo: {
        type: Object,
        default: () => {},
      },
      isCommissioner: {
        type: Boolean,
        default: false,
      },
      userInfo: {
        type: Object,
        default: () => {},
      }
    },
    computed: {
      serviceList() {
        let moduleInfo = this.moduleInfo || {};
        let moduleData = moduleInfo.moduleData || {};
        moduleData.serviceList.forEach((item,i)=>{
          if(item.code == 'COURSE-TASK' && this.userInfo.isTest == 1){
            item.is_enable = 0
          }
          if(item.code == 'BIND-INFO' && this.userInfo.loginConfig == 'password'){
            item.is_enable = 0
          }
        })
            console.log(moduleData.serviceList,"serviceItem")
        return moduleData.serviceList || [];
      },
    },
    watch:{
      userInfo:{
        handler(nV,oV){
          console.log(nV,"获取用户信息userinfo")
        
        },
        immdeiate:true
      }
    },
    data() {
      return {
        imgPath: {
          "SURVEY-RECORD": "/user-record.png",
          "BIND-INFO": "/user-msg.png",
          "LOG-OUT": "/logout.png",
        },
      };
    },
    methods: {
      jump(code) {
        console.log('jump', code);
        let url = "";
        switch (code) {
          case "SURVEY-ACTIVITY":
            url = "/pages/activities/evaluating/list/ac-list";
            break;
          case "SURVEY-RECORD":
            url = "/pages/activities/evaluating/record-list/record-list";
            break;
          case "BIND-INFO":
            url = `/pages/user-switch/user-switch?type=user`;
            break;
          case "USERINFO-EDIT":
            url = "/pages/information/information";
            break;
          case "MY-SUBSCRIBE":
            url = "/pages/psychology/my-reserve/my-reserve";
            break;
          case "COURSE-TASK":
            url = "/pages/course-list/course-list";
            break;
          default:
            break;
        }
        this.jumpAction(url);
      },
      jumpDetail(id) {
        console.log(id);
        this.jumpAction(
          `/pages/work-bench/work-bench-detail/work-bench-detail?id=${id}`
        );
      },
      logOut() {
        this._logout();
      },
    },
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .service-box {
    .service-item {
      box-sizing: border-box;
      position: relative;
      height: 140rpx;
      background-color: #fff;
      margin-bottom: 20rpx;
    }

    .service-item:last-child {
      margin-bottom: 0px;
    }

    .icon {
      margin: 0 64rpx;
      width: 55rpx;
      height: 55rpx;
    }

    .title {
      font-size: 34rpx;
    }

    .arrow {
      position: absolute;
      right: 40rpx;
      top: 50%;
      transform: translateY(-50%);
      width: 15rpx;
      height: 15rpx;
      border-right: 1px solid rgba($color: #7f7f7f, $alpha: 0.2);
      border-bottom: 1px solid rgba($color: #7f7f7f, $alpha: 0.2);
      transform: rotate(-45deg);
    }
  }
</style>