<template>
  <div class="material-box" :class="{'left': isShowTabs && !isLimitTab}">
    <div class="tabs" v-if="isShowTabs && !isLimitTab">
      <div class="tab-item pointer flex-c-c" :class="{'active':tabKey == item.key}" v-for="item in tabsView" :key="item.id" @click="changeTabs(item.key)">
        {{item.name}}
      </div>
    </div>
    <div class="content-box flex1" >
      <Tabs :value="tabKey" @on-click="changeTabs">
        <TabPane v-for="(item, index) in tabsView" :key="item.key" :label="item.name" :name="item.key">
          <contentView 
          :ref="'resource-' + item.key" 
          :type="item.key"
          :typeStr="item.tip"
          :isMulti="isMulti"
          :chooseData="selectData[item.key] || []"
          :isShowClassify="isShowClassify"
          :isShowTipsBox="isShowTipsBox"></contentView>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import contentView from "@/components/view-components/material-view/view/content-view.vue";
  export default {
    mixins:[],
    components: {
      contentView
    },
    props: {
      //VIEW组件
      isLimitTab: Boolean, // 是否限制展示tab
      type: { //video,audio,article,psychic
        type: String,
        default: ""
      },
      isShowTabs:{
        type: Boolean,
        default: false
      },
      isShowClassify:{
        type: Boolean,
        default: false
      },
      fromType:{ //distribute,content,material
        type: String,
        default: "" 
      },
      isMulti: {
        type: Boolean,
        default: ()=>true
      },
      selectData: {
        type:Object,
        default:function(){
          return {}
        }
      },
      extraParams:{
        type:Object,
        default:function(){
          return {}
        }
      },
      tabList: Array
    },
    data() {
      return {
        tabKey: "video",
        curListId:0,
        selectAll:false,
        
      }
    },
    computed:{
      tabsView(){ // 筛选tabs
        let tabList = this.tabList || [];
        let tabsView = [];
        if(this.isLimitTab){
          tabList.map((item)=>{
            if(item.key == this.type){
              tabsView.push(item);
              return;
            }
          })
        } else {
          tabsView = tabList;
        }
        return tabsView;
      },
      isShowTipsBox(){
        return this.isMulti && (!this.fromType || this.fromType=='distribute' || this.fromType=='material')
      },
    },
    methods: {
      changeTabs(name){
        this.tabKey = name || this.type;
        this.loadData(name);
      },
      loadData(name){
        if(!name) name = this.type;
        let extraParams = this.extraParams || {};
        // if(!extraParams.target_id) return;
        this.$refs["resource-" + name] && this.$refs["resource-" + name][0].getData({
          distribute: extraParams.target_id || 0,
          target_id: extraParams.target_id || 0
        });
      }
    },
    watch:{
      type: {
        // 通过传进来的type，确定tab切换的内容
        handler:function(nV){
          let tabKey = "";
          this.tabsView.map((item)=>{
            if(item.key == nV){
              tabKey = nV;
              return;
            }
          })
          if(!tabKey){
            tabKey = this.tabsView[0].key;
          }
          this.tabKey = tabKey;
        },
        immediate: true
      }
    },
  }
</script>

<style lang="less" scoped>
.material-box{
  position: relative;
  width: 100%;
  color: #7f7f7f;
  font-size: 16px; 
  &.left{
    flex-direction: row;
    padding-left: 132px;
    .tabs{
      position: absolute;
      top:0px;
      left:0px;
      width:132px;
      border-right: 1px solid #EFEFEF;
      height: 100%;
      display: block;
      flex-shrink: 0;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 20px;
    }
    .tab-item{
      text-align: center;
      padding-right: 0;
      height: 44px;
    }
    .tab-item.active{
      color:#008ACB;
    }
  }
  .content-box{
    position: relative;
    // padding-right: 20px;
    display: flex;
    flex-direction: column;
    height:100%;
    // &.classify{
    //   padding-top: 44px;
    //   &.tipsBox{
    //     padding-top:114px;
    //   };
    // }
    // &.tipsBox{
    //   padding-top:70px;
    // }; 
  }
}
</style>
<style lang="less">
  .material-box{
    .content-box{
      .ivu-tabs{
        width:100%;
        height:100%;
        display: flex;
        flex-direction: column;
        .ivu-tabs-bar{
          display: none;
        }
        .ivu-tabs-content{
          flex: 1;
          height:100%;
        }
      }
    }
  }
</style>