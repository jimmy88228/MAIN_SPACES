<template>
  <div class="material-box flex1 flex flex-col" :class="{'left':isShowTabs&&isShowClassify,'onlyTabs':isShowTabs&&!isShowClassify}">
    <div class="tabs" :class="{'isBorder':this.fromType=='contentRepository'}" v-if="isShowTabs">
      <div class="tab-item pointer flex-c-c" :class="{'active':curTabIndex == index}" v-for="(item,index) in showTabList" :key="item.id" @click="onChangeTap('curTabIndex',index)">
        {{item.name}}
      </div>
    </div>
    <tab-item :ref="'tabItem'+'_'+index" :chooseData="selectedData[item.type]" v-for="(item,index) in showTabList" :key="item.id" 
      v-show="index == curTabIndex" :curItem="showTabList[index]" :extraParams="extraParams" :fromType="fromType" :isMulti="isMulti"></tab-item>
    <!-- <tab-item :ref="'tabItem'+'_'+index" :chooseData="chooseData[showTabList[index].type]" v-for="(item,index) in showTabList" :key="item.id" 
      v-show="index == curTabIndex" :curItem="showTabList[index]" :extraParams="extraParams" :fromType="fromType"></tab-item> -->
  </div>
</template>

<script>
import tabItem from './tab-item.vue';
  export default {
    components: {
      tabItem,
    },
    props: {
      type: { //video,audio,article,
        type: String,
        default: ""
      },
      showTab: {
        type: Array,
        default: ()=>{
          return []
        }
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
        default: false
      },
      classifyId:{
        type:Number,
        default:0
      },
      selectedData:{
        type:Object,
        default:()=>{return {}}
      },
      // selectedData:{
      //   type:Array,
      //   default:function(){
      //     return []
      //   }
      // },
      extraParams:{
        type:Object,
        default:function(){
          return {}
        }
      },
    },
    data() {
      return {
        curTabIndex:0,
        chooseData:{
          video:[],
          audio:[],
          article:[],
        },
        tabList: [{
            id:1,
            type:"video",
            name:"视频内容",
            nickName:"视频",
          },{
            id:2,
            type:"audio",
            name:"音频内容",
            nickName:"音频",
          },{
            id:3,
            type:"article",
            name:"文章内容",
            nickName:"文章",
          },
          {
            id:4,
            type:"course",
            name:"课程内容",
            nickName:"课程",
          },
        ],
      }
    },
    computed:{
      showTabList(){
        let showTab = this.showTab || [];
        let tabList = this.tabList || [];
        let showTabList = [];
        for(let i = 0; i < tabList.length; i++){
          let type = tabList[i].type;
          if(!showTab || showTab.length == 0  || showTab.indexOf(type) != -1){
            showTabList.push(tabList[i]);
          }
        }
        return showTabList;
      }
    },
    methods: {
      onChangeTap(curkey,index){
        this[curkey] = index;
        this.getCurRefs(`tabItem_${index}`).tapLoadData();

        // this.curSelectedData = [];
        // this.loadData();
      },
      getCurRefs(key){
        return this.$refs[key] && this.$refs[key][0] || {};
      },
      getCurType(){
        return this.showTabList[this.curTabIndex] && this.showTabList[this.curTabIndex].type || this.type || "";
      }
    },
    watch:{
      type:{
        handler(nV){
          this.curTabIndex = this.showTabList.findIndex(item=>item.type == nV);
          setTimeout(() => {
            this.getCurRefs(`tabItem_${this.curTabIndex}`).tapLoadData();
          }, 500);
        },
        immediate:true
      },
      // selectedData:{
      //   handler(nV){
      //     // this.curSelectedData = JSON.parse(JSON.stringify(nV));
      //     // this.type && (this.chooseData[this.type] = nV || []);
      //     console.log('selectData watch',nV)
      //   },
      //   immediate:true,
      //   deep:true
      // },
      // chooseData:{
      //   handler(nV){
      //     console.log('chooseData watch',nV);
      //   },
      //   immediate:true,
      //   deep:true
      // }
    },
  }
</script>
<style lang="less">
.material-box{
  .ivu-select{
    color:#221c1c
  }
}
</style>
<style lang="less" scoped>
.material-box{
  position: relative;
  width: 100%;
  color: #7f7f7f;
  font-size: 16px; 
  height: 100%;
  &.left{
    flex-direction: row;
    .tabs{
      width:132px;
      padding-left: 0px;
      margin-right: 40px;
      border-right: 1px solid #EFEFEF;
      height: 100%;
      display: block;
    }
    .tab-item{
      text-align: center;
      padding-right: 0;
      height: 44px;
    }
  }
  &.onlyTabs{
    .content-box{
      height: calc(100% - 60px);
      overflow: hidden;
      padding-right: 0;
      padding-left: 10px;
    }
  }
  .tabs{
    width: 100%;
    height: 60px;
    display: flex;
    padding-left: 10px;
    flex-shrink: 0;
    &.isBorder{
      border-bottom: 1px solid #DDDDDD;
    }
  }
  .tab-item{
    padding-right: 40px;
    height: 100%;
    &.active{
      color:#008ACB;
    }
  }
  // .content-box{
  //   position: relative;
  //   height: 100%;
  //   &.classify{
  //     padding-top: 44px;
  //     &.tipsBox{
  //       padding-top:114px;
  //     };
  //   }
  //   &.tipsBox{
  //     padding-top:70px;
  //   }; 
  // }
  // .filter-box{
  //   position:absolute;
  //   top: 0;
  //   right: 0;
  //   width: 100%;
  // }
  // .search-box{
  //   width:260px;
  // }
  // .classify-box{
  //   min-height: 50px;
  // }
  // .classify-item{
  //   min-width: 40px;
  //   min-height: 44px;
  //   padding: 0 20px;
  //   color: #333;
  //   border-radius: 4px;
  //   &.active{
  //     background: #F2FBFF;
  //     color: #008ACB;
  //   }
  // }
  // .tips-box,.source-box{
  //   min-height: 50px;
  //   margin: 10px 0;
  // }
  // .source-box{
  //   width: 165px;
  // }
  // .source-tip{
  //   margin-right:15px;
  //   font-size: 14px;
  //   color: #8e8e8e;
  // }
  // .type-num{
  //   color: #333;
  //   margin-right: 22px;
  // }
}
</style>