<template>
  <div class="page-editor-right-side">
    <div class="side-content">
      <Tabs class="side-tabs" v-model="currTabName" type="card" :animated="false">

        <TabPane class="side-tabs-pane bg-page" v-bar name="CURR_COMPONENT" label="组件">
          <div>
            <!--组件表单池-->
            <div class="select-tip text-c" v-if="!compInfo || !compInfo.module_type">请选择预览区功能模块进行编辑！</div>
            <!--广告图片表单-->
            <imageAdForm v-if=" compInfo.module_type == 'IMAGE-AD' " :compInfo="compInfo" :pageInfo="pageInfo"></imageAdForm>
            <!--视频模块-->
            <videoMdForm v-if=" compInfo.module_type == 'VIDEO-MD' " :compInfo="compInfo"></videoMdForm>
            <!--音频模块-->
            <audioMdForm v-if=" compInfo.module_type == 'AUDIO-MD' " :compInfo="compInfo"></audioMdForm>
            <!--文章模块-->
            <articleMdForm v-if=" compInfo.module_type == 'ARTICLE-MD' " :compInfo="compInfo"></articleMdForm>

            <carouselMdForm v-if=" compInfo.module_type == 'BROADCAST-MD' " :compInfo="compInfo" :pageInfo="pageInfo"></carouselMdForm>
            
            <!--个人中心 -- 头部-->
            <userHeaderForm v-else-if=" compInfo.module_type == 'USER-HEADER' " :compInfo="compInfo"></userHeaderForm>
            <!--个人中心 -- 功能服务-->
            <userServiceForm v-else-if=" compInfo.module_type == 'USER-SERVICE' " :compInfo="compInfo"></userServiceForm>

            <!--组件备注功能-->
            <commonRemarkForm v-if="compInfo.module_type" :compInfo="compInfo"></commonRemarkForm>
            <!--功能背景设置组件-->
            <backgroundForm v-if="compInfo.module_type" :compInfo="compInfo"></backgroundForm>
          </div>
        </TabPane>

        <TabPane class="side-tabs-pane bg-page" v-bar name="COMPONENTS" label="组件管理">
          <pageSettingComp :compList="compList" :commonInfo="commonInfo"></pageSettingComp>
        </TabPane>
        <TabPane class="side-tabs-pane bg-page" v-bar name="PAGE" label="页面设置">
          <div>
            <!--页面设置表单-->
            <pageSettingForm ref="pageSettingFormRef" :pageInfo="pageInfo" :catList="catList"></pageSettingForm>
            <!--微信分享设置-->
            <pageSettingWeixin v-if="canWeixin" :pageInfo="pageInfo"></pageSettingWeixin>
            <!--页面背景设置-->
            <pageSettingBackground :pageInfo="pageInfo"></pageSettingBackground>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import pageSettingForm from "./widgets/page-setting-form";
import pageSettingBackground from "./widgets/page-setting-background";
import pageSettingWeixin from "./widgets/page-setting-weixin";
import imageAdForm from "./widgets/image-ad/image-ad-form";
import videoMdForm from "./widgets/video-md/video-md-form";
import audioMdForm from "./widgets/audio-md/audio-md-form";
import articleMdForm from "./widgets/article-md/article-md-form";
import pageSettingComp from "./widgets/page-setting-comp";
import userHeaderForm from "./widgets/user-center/user-header-form.vue";
import userServiceForm from "./widgets/user-center/user-service-form.vue";
import backgroundForm from "./widgets/background-form";
import commonRemarkForm from "./widgets/common-remark-form";
import carouselMdForm from "./widgets/carousel-md/carousel-md-form.vue";
export default {
  name: "editorRightSide",
  components: {
    draggable,
    pageSettingForm,
    pageSettingBackground,
    pageSettingWeixin,
    pageSettingComp,
    backgroundForm,
    commonRemarkForm,
    imageAdForm,
    videoMdForm,
    audioMdForm,
    articleMdForm,
    userHeaderForm,
    userServiceForm,
    carouselMdForm
  },
  props: {
    compList: {
      type: Array,
      default() {
        return [];
      },
    },
    commonInfo: {
      type: Object,
      default: () => {},
    },
    pageInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    canWeixin: {
      type: Boolean,
      default: false,
    },
    catList: {
      type: Array,
      default: () => [],
    },
    // 当前编辑器是否作为内嵌编辑器使用
    pageType: {
      type: String,
      default: "NONE",
    },
  },
  data() {
    return {
      dataList: [],
      componentsList: {},
      // 当前选中的tab
      currTabName: "CURR_COMPONENT",

      // 当前选中的组件code
      currSelectCode: "",
      drag: false,

      // 虚拟滚动条
      scrollOptions: {
        mode: "native",
        bar: {
          keepShow: false,
          background: "#c8c8c8",
          size: "3px",
        },
        // 滚动轨道
        rail: {
          size: "3px",
        },
        scrollPanel: {
          scrollingX: false,
        },
      },
      compInfo: {},
      currSelectIndex: 0,
    };
  },

  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    }, 
  },
  methods: {
    currentTab(name, handler = {}){
      if(name != this.currTabName){
        this.currTabName = name;
      }
      if(name == 'PAGE' && handler.isCheck){
        this.$refs["pageSettingFormRef"] && this.$refs["pageSettingFormRef"].checkValidate();
      }
    }
  },
  watch: {
    'commonInfo.curIndex': {
      handler(nV){
        this.compInfo = this.compList[nV] || {};
      },
      immediante: true,
      deep: true
    }
  },
  mounted() {},
};
</script>

<style lang="less">
.page-editor-right-side {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .side-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    /*iview tab样式重写*/
    .side-tabs {
      width: 100%;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .ivu-tabs-bar {
        flex-shrink: 0;
        border: none;
      }
      .ivu-tabs-content {
        flex: 1;
        height: 100%;
        // border-left: 1px solid #dcdee2;
        overflow: hidden;
        .side-tabs-pane {
          padding: 16px 30px 16px 16px;
          height: 100%;
          overflow: hidden;
          .select-tip {
            display: block;
            margin: 200px 0px;
            color: #b2b2b2;
          }
        }
      }
    }
  }

  .clear-all {
    float: right;
    height: 30px;
    line-height: 30px;
    margin-right: 10px;
    cursor: pointer;
  }
  .ghost {
    opacity: 0.5;
  }
}
</style>
