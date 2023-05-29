<template>
  <view>
    <view v-for="(groupItem,groupIndex) in videosGroup" :key="groupIndex">
      <view class="audio-list-between" >
        <view class="audio-item" v-for="(videoItem,videoIndex) in groupItem.videos" :key="videoIndex" :style="styleSet" :data-id="videoItem.id" :data-item="videoItem" @click="playVideo">
          <view class="audio-icon m-b-20" :style="{ 'background-color': coverBackground(videoItem.cover) }">
            <image class="" :src="videoItem.cover" @error="imgerror($event, videoIndex, groupIndex)" mode="widthFix"></image>
          </view>
          <view class="audio-info">
            <view  v-if="dynamicSetting && dynamicSetting.showTitle == 1" class="C_333 clamp bold font-28 m-b-10"
              >{{videoItem.title}}</view
            >
            <view v-if="dynamicSetting && dynamicSetting.showMsg == 1" class="font-22 C_B2 clamp"
              >{{videoItem.summary}}</view
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const pageOption = Page.BasePage({
  name: "video-md",
  props: {
    moduleInfo: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    dynamicSetting() {
      console.log(this.moduleInfo)
      return this.moduleInfo.dynamicSetting || {};
    },
    videosGroup() {
      let moduleInfo = this.moduleInfo || {};
      let moduleData = moduleInfo.moduleData || {};
      return moduleData.videosGroup || [];
    },
    styleSet() {
      console.log(this.dynamicSetting.row, 3333);
      let row = this.dynamicSetting.row;
      let removeSplit = 100 - (row - 1) * 3.5;
      let width = removeSplit / row + "%";
      let style = `width:${width}`;
      return style;
    },
  },
  data() {
    return {
    };
  },
  onReady() {
    this.dynamicSetting.row = 2;
  },
  methods: {
    playVideo({currentTarget}) {
      // console.log(currentTarget.dataset.item,321)
      let id = currentTarget.dataset.id; 
      let item = currentTarget.dataset.item; 
      item = encodeURIComponent(JSON.stringify(item))
      this.jumpAction(`/pages/video-detail/video-detail?id=${id}&item=${item}`);
    },
     coverBackground(coverUrl) {
      if (coverUrl == "" || coverUrl == "errorCover") {
        return "#EFEFEF";
      } else {
        return "transparent";
      }
    },
    imgerror(e, img_index, index) {
      var _this = this;
      var imgChildList = _this.videosGroup[index].video;
      if (imgChildList.length > 0) {
        console.log(imgChildList, img_index);
        imgChildList[img_index].cover = "errorCover";
      }
      this.$forceUpdate();
    },
  },
});
export default pageOption;
</script>

<style lang="less" scoped>
.audio-list-between {
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
  width: 100%;
  .audio-item {
    // 根据后端传入一行多少个改变width
    margin-bottom: 30rpx;
    .audio-icon {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 75%;
      overflow: hidden;
      border-radius: 12rpx;
      image {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
      }
    }
    .audio-info {
      width: 100%;
    }
  }
}
</style>