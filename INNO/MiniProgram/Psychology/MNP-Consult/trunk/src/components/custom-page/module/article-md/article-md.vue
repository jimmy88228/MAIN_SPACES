<template>
  <view>
    <view v-for="(groupItem, groupIndex) in articlesGroup" :key="groupIndex">
      <view class="article-list-between" v-if="dynamicSetting.type == 'row'">
        <view
          class="article-item"
          v-for="(articleItem, articleIndex) in groupItem.articles"
          :key="articleIndex"
          :style="styleSet"
          :data-id="articleItem.id"
          @click="articleDetail"
        >
          <view class="article-icon m-b-20" :style="{'background-color':coverBackground(articleItem.cover)}">
            <image
              class=""
              :src="articleItem.cover"
              @error="imgerror($event, articleIndex, groupIndex)"
              mode="widthFix"
            ></image>
          </view>
          <view class="article-info clamp">
            <view
              class="C_333 clamp bold font-28 m-b-20 clamp"
              v-if="dynamicSetting.showTitle"
              >{{ articleItem.title }}</view
            >
            <view class="font-22 C_B2 clamp" v-if="dynamicSetting.showMsg">{{
              articleItem.summary
            }}</view>
          </view>
        </view>
      </view>

      <view class="article-list-column" v-else>
        <view
          class="article-item"
          v-for="(articleItem, articleIndex) in groupItem.articles"
          :key="articleIndex"
          :data-id="articleItem.id"
          @click="articleDetail"
        >
          <image
            :src="articleItem.cover"
            :style="{'background-color':coverBackground(articleItem.cover)}"
            @error="imgerror($event, articleIndex, groupIndex)"
            mode="aspectFill"
          />
          <view class="article-info clamp">
            <view
              class="C_333 clamp bold font-28 m-b-20"
              v-if="dynamicSetting.showTitle"
              >{{ articleItem.title }}</view
            >
            <view class="font-22 C_B2 clamp" v-if="dynamicSetting.showMsg">{{
              articleItem.summary
            }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const pageOption = Page.BasePage({
  name: "article-md",
  props: {
    moduleInfo: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    dynamicSetting() {
      return this.moduleInfo.dynamicSetting || {};
    },
    articlesGroup() {
      let moduleInfo = this.moduleInfo || {};
      let moduleData = moduleInfo.moduleData || {};
      return moduleData.articlesGroup || [];
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
    articleDetail({ currentTarget }) {
      let id = currentTarget.dataset.id;
      console.log(currentTarget)
      this.jumpAction(`/pages/article-detail/article-detail?id=${id}`);
    },
    coverBackground(coverUrl){
      if(coverUrl == "" || coverUrl == "errorCover"){
        return "#EFEFEF"
      }else{
        return "transparent"
      }
    },
    imgerror(e, img_index, index) {
      var _this = this;
      var imgChildList = _this.articlesGroup[index].articles;
      if (imgChildList.length > 0) {
        console.log(imgChildList,img_index)
        imgChildList[img_index].cover = "errorCover";
      }
      this.$forceUpdate();
    },
  },
});
export default pageOption;
</script>

<style lang="less" scoped>
.article-list-between {
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
  width: 100%;
  .article-item {
    // 后端传回来的row进行计算获得
    // width: 47%;
    margin-bottom: 26rpx;
    .article-icon {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 75%;
      overflow: hidden;
      image {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
      }
    }
    .article-info {
      width: 100%;
    }
  }
}
.article-list-column {
  width: 100%;
  .article-item {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    width: 100%;
    image {
      flex-shrink: 0;
      width: 220rpx;
      height: 166rpx;
      margin-right: 20rpx;
    }
    .article-info {
      flex: 1;
    }
  }
}
</style>