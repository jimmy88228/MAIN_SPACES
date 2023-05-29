<template>
  <view>
    <!-- <cover-view> -->
      <view class="tab-bar-hold" :class="{'ac-tab-bar-hold': selectedKey == 'platformIndex' && showSXIndex == 1}" v-if="holdTabbar"></view>
      <cover-view class="tab-bar">
        <cover-view class="tab-bar-cont">
          <cover-view class="tab-bar-bg-area">
            <cover-view class="tab-bar-bg"></cover-view>
          </cover-view>
          <cover-view v-for="(item,index) in tabBarList" :key="index" class="tab-bar-item"
            :class="{'select-center-item': (item.key == 'platformIndex' && selectedKey == item.key && showSXIndex == 1)}" :data-path="item.pagePath"
            :data-index="index" @click="switchTab">
            <template v-if="item.key == 'platformIndex'">
              <!--大图-->
              <template v-if="showSXIndex == 1">
                <cover-view class="select-center" v-if="selectedKey == item.key">
                  <cover-image class="image-center" :src="centerSelectIcon"></cover-image>
                </cover-view>
                <template v-else>
                  <cover-image class="tab-item-image" :src="centerIcon"></cover-image>
                  <cover-view class="tab-item-txt" :style="{color: color}">{{item.text}}</cover-view>
                </template>
              </template>
              <template v-else><!--小图-->
                <cover-image class="tab-item-image" :src="selectedKey == item.key ? centerSelectIcon : item.homePath"></cover-image>
                <cover-view class="tab-item-txt" :style="{color: selectedKey == item.key ? selectedColor : color}">{{item.text}}</cover-view>
              </template>
            </template>
            <template v-else>
              <cover-image class="tab-item-image" :src="selectedKey == item.key ? item.selectedIconPath : item.iconPath">
              </cover-image>
              <cover-view class="tab-item-txt" :style="{color: selectedKey == item.key ? selectedColor : color}">{{item.text}}
              </cover-view>
            </template>
          </cover-view>
        </cover-view>
      </cover-view>
    <!-- </cover-view> -->
  </view>
</template>

<script>
  const app = getApp();
  const pageOption = Page.BaseComp({
    name: "cu-tabbar",
    props: {
      showSXIndex: {
        type: String,
        default: ""
      },
      selectedKey: {
        type: String,
        default: "index"
      },
      holdTabbar: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      centerIcon() {
        return this.platformData.tabLogo || ""
      },
      centerSelectIcon() {
        return this.platformData.smallLogo || ""
      },
      tabBarList(){
        let showSXIndex = this.showSXIndex; // 为1显示供应商首页，非则不展示
        let tabbarData = this.tabbarData || [];
        let tabBarList = [];
        for(let i = 0; i < tabbarData.length; i++){
          let item = tabbarData[i] || {};
          if(item.key == "platformIndex"){
            item.text = showSXIndex == 1 ? '测评' : '首页'
          }
          if(showSXIndex == 1 || (showSXIndex != 1 && item.key != 'index')){
            tabBarList.push(item);
          }
        }
        return tabBarList;
      }
    },
    data() {
      return {
        color: "#b6b6b6",
        selectedColor: "#427EB4",
        tabbarData: [{
            "pagePath": "/pages/index/index",
            "iconPath": "/static/images/tabbar/Homes.png",
            "selectedIconPath": "/static/images/tabbar/getHomes.png",
            "key": "index",
            "text": "上馨心理"
          }, {
            "pagePath": "/pages/platform-index/platform-index",
            "homePath": "/static/images/tabbar/home.png",
            "iconPath": "static/images/tabbar/Report.png",
            "selectedIconPath": "/static/images/tabbar/getReport.png",
            "key": "platformIndex",
            "text": "测评"
          },
          {
            "pagePath": "/pages/user/user",
            "iconPath": "/static/images/tabbar/Users.png",
            "selectedIconPath": "/static/images/tabbar/getUsers.png",
            "key": "userCenter",
            "text": "我的"
          }
        ],
        platformData: {}
      };
    },
    methods: {
      switchTab(e) {
        const data = e.currentTarget.dataset
        const url = data.path
        uni.switchTab({
          url
        })
      },
      getCenterImg() {
        return this._checkLogin().then(() => {
          this.platformData = app.PLM.platformInfo;
          return this.platformData.smallLogo
        })
      },
      init() {
        this.getCenterImg();
      }
    },
    watch: {}
  });
  export default pageOption;
</script>

<style lang="scss">
  .tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: calc(150rpx + env(safe-area-inset-bottom));
    z-index: 999;
  }

  .tab-bar-hold {
    //tab空白占位
    width: 100%;
    height: calc(110rpx + env(safe-area-inset-bottom));

    &.ac-tab-bar-hold {
      //selected==1的空白占位
      height: calc(150rpx + env(safe-area-inset-bottom));
    }
  }

  .tab-bar-cont {
    width: 100%;
    height: 100%;
    display: flex;
    padding-bottom: env(safe-area-inset-bottom);
    position: relative;
  }

  .tab-bar-bg-area {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-top: 40rpx; // 需要和内容一致

    .tab-bar-bg {
      background-color: #fff;
      width: 100%;
      height: 100%;
    }
  }

  .tab-bar-item {
    height: 100%;
    flex: 1;
    text-align: center;
    display: flex;
    padding-top: 40rpx; // 需要和上面背景一致
    justify-content: center;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
    z-index: 2;
  }

  .tab-item-bg {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: #fff;
  }

  .tab-item-image {
    width: 48rpx;
    height: 48rpx;
    margin-bottom: 9rpx;
  }

  .tab-item-txt {
    font-size: 20rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #DDDDDD;
    line-height: 25rpx;
  }

  .select-center-item {
    padding-top: 0px;
  }

  .select-center {
    position: absolute;
    top: 1px;
    left: 50%;
    transform: translateX(-50%);
    width: 110rpx;
    height: 110rpx;
    padding: 15rpx;
    border-radius: 50%;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;

    .image-center {
      width: 110rpx;
      height: 110rpx;
      border-radius: 50%;
      background-color: #dfdfdf;
    }
  }
</style>