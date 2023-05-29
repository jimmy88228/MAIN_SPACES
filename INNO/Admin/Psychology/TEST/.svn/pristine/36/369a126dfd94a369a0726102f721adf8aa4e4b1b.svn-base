<template>
  <div class="editor-body" v-bar>
    <div class="editor-body-view bg-page" @click.stop="bodyTouch">
      <div class="view-header"></div>
      <div class="view-nav-box flex-c-c" v-if="pageInfo.setting && pageInfo.setting.isShowNav">
        <div class="img-home-box flex-c-c flex-col translate-y-50">
          <div class="img-home-top"></div>
          <div class="img-home-bottom"></div>
        </div>
        <div class="view-nav">{{pageInfo.layout_name||"页面名称"}}</div>
      </div>
      <div class="view-body flex flex-col" :style="getPageStyle">
        <draggable class="draggable-box flex1" :list="compList" v-bind="dragOptions" :group="{name:'itemBox'}" @start="dragStart" @end="dragEnd" @change="dragChange">
          <div class="comp-item" v-for="(item, index) in compList" :key="item.module_type + '|' + index" @click="itemChange(index, true)">
            <moduleContain :itemInfo="item" :itemIndex="index" :selected="commonInfo.curIndex == index" @remove="removeComp">
							<!--广告图-->
              <imageAdView :compInfo="item" v-if="item.module_type == 'IMAGE-AD'"></imageAdView>
              <videoMdView :compInfo="item" v-if="item.module_type == 'VIDEO-MD'"></videoMdView>
              <audioMdView :compInfo="item" v-if="item.module_type == 'AUDIO-MD'"></audioMdView>
              <articleMdView :compInfo="item" v-if="item.module_type == 'ARTICLE-MD'"></articleMdView>
              <carouselMdView :compInfo="item" v-if="item.module_type == 'BROADCAST-MD'"></carouselMdView>
							<!--个人中心 -- 头部-->
							<userHeaderView :compInfo="item" v-else-if="item.module_type == 'USER-HEADER'"></userHeaderView>
							<!--个人中心 -- 功能服务-->
							<userServiceView :compInfo="item" v-else-if="item.module_type == 'USER-SERVICE'"></userServiceView>
            </moduleContain>
          </div> 
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import moduleContain from "./component/container/module-contain";
import imageAdView from "./widgets/image-ad/image-ad-view";
import videoMdView from "./widgets/video-md/video-md-view";
import audioMdView from "./widgets/audio-md/audio-md-view";
import articleMdView from "./widgets/article-md/article-md-view";
import carouselMdView from "./widgets/carousel-md/carousel-md-view";
import userHeaderView from "./widgets/user-center/user-header-view.vue";
import userServiceView from "./widgets/user-center/user-service-view.vue";
export default {
  name: "editorBody",
  components: {
    draggable,
    moduleContain,
    imageAdView,
    videoMdView,
    audioMdView,
    articleMdView,
		userHeaderView,
		userServiceView,
    carouselMdView
  },
  props: {
    compList: {
      type: Array,
      default: () => [],
    },
		pageInfo: {
      type: Object,
      default: () => {},
    },
    pageType: {
      type: String,
      default: "NONE",
    },
    commonInfo:{
      type:Object,
      default:() => {}
    }
  },
  data() {
    return {
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
        chosenClass: "chosen",
      };
    },
    // 页面背景设置
    getPageStyle() {
			let pageInfo = this.pageInfo || {};
			let pageSetting = pageInfo.setting || {};
			let pageStyle = {}
			if(pageSetting.backgroundColor){
				pageStyle["background-color"] = pageSetting.backgroundColor;
			}
			if(pageSetting.backgroundImage){
				pageStyle["background-image"] = "url(" + pageSetting.backgroundImage + ")";
				pageStyle["background-repeat"] = "no-repeat";
				pageStyle["background-size"] = "100% auto";
				pageStyle["background-position"] = "center " + pageSetting.backgroundPosition;
			}
			return pageStyle;
    },
  },
  methods: {
    itemChange(index) {
      if (index || index == 0) {
        this.commonInfo.curIndex = index;
      }
    },
    dragChange(e) {
      if (e.added) {
        // 添加时更新选中项
        let newIndex = e.added.newIndex;
        if(this.commonInfo.curIndex < 0){
          this.commonInfo.curIndex = newIndex;
        } else if (!(this.commonInfo.curIndex < newIndex)) {
          this.commonInfo.curIndex += 1;
        }
      }
      this.bodyTouch();
    },
    dragStart(e) {
      this.itemChange(e.oldIndex);
    },
    dragEnd(e) {
      this.itemChange(e.newIndex);
    },
    // 删除组件
    removeComp(index) {
      if (this.commonInfo.curIndex == index) {
        this.commonInfo.curIndex = -1;
      }
      this.$delete(this.compList, index);
      this.$nextTick(() => {
        this.commonInfo.curIndex = index;
      });
    },
    bodyTouch(){
      this.$emit("bodyTouch");
    }
  },
  mounted() {},
};
</script>

<style lang="less">
.editor-body {
  width: 100%;
  height: 100%;
  .editor-body-view {
    width: 415px; //375+40
    padding: 20px;
    background: rgba(239, 239, 239, 0.17);
    // margin: 0 100px 0 30px;
    margin-left: 30px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: calc(100% + 0px);
    // position: relative;
    // border:1px solid #dcdee2;
    // border-top: 0px;
    .view-header {
      position: absolute;
      top: 24px;
      left: 335px;
      z-index: 15;
      background: url("@/assets/images/pages/page-header-tip.png") top center no-repeat;
      background-size: 100% auto;
      width: 80px;
      height: 30px;
      overflow: hidden;
    }
    .no-header{
      height: 0px;
    }
    .view-body {
      position: relative;
      flex: 1;
      .draggable-box {
        // min-height: calc(100vh - 300px);
      }
    }
  }
  .view-nav-box{
    position: relative;
    min-height: 44px;
    margin-top: -3px;
    padding: 0 40px;
    box-sizing: border-box;
    background: #fff;
    word-break: break-all;
  }
  .ghost {
    opacity: 0.5;
  }
  .chosen {
    background: rgba(255,255,255,0.3);
    padding: 0px;
  }
  .img-home-box{
    position: absolute;
    left: 10px;
  }
  .img-home-top{
    transform: rotate(-45deg);
    width: 12px;
    height: 12px;
    border-top: 2px solid #171717;
    border-right: 2px solid #171717;
    // border-radius: 1px;
  }
  .img-home-bottom{
    width: 12px;
    height: 10px;
    border: 2px solid #171717;
    border-top-color:transparent;
    margin-top: -5px;
    border-radius: 2px;
  }
}
</style>

