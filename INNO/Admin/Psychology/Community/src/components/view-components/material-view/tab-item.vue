<template>
  <div class="tab-item-area">
    <hold-layout :isFullHeight="true" layout-content-custom-style="display: flex;">
      <div class="content-box flex1" :class="{'classify':isShowClassify,'tipsBox':isShowTipsBox||isShowSourceBox}">
        <div class="filter-box" v-if="isShowClassify || isShowTipsBox || isShowSourceBox">
          <div class="flex-b-c" v-if="isShowTipsBox">
            <div class="tips-box flex-s-c">
              <Checkbox v-if="isMulti" v-model="selectAll" @on-change="onCheckChange" :disabled="isDisabledAll">
                <span style="font-size:16px;">全选</span>
              </Checkbox>
              <span class="p-l-10 m-r-5">{{curItem.nickName||""}}</span>
              <span class="type-num">{{list.length}}</span>
              <span class="m-r-5">已选</span>
              <span class="type-num">{{chooseData.length}}</span>
              <a @click="onCheckChange(false)" v-if="chooseData.length>0 && !isDisabledAll">取消选择</a>
            </div>
            <div class="search-box">
              <rewrite-search v-model="searchVal" @search="search" placeholder="请输入关键词"></rewrite-search>
            </div>
          </div>
          <div class="flex-e-c" >
            <template v-if="isShowSourceBox">
              <div class="source-tip">来源</div>
              <div class="source-box flex-s-c">
                <Select v-model="curSourceId" class="base-320" @on-change="sourceOnChange">
                    <Option :value="0">全部</Option>
                    <Option v-for="item in sourceList" :key="item.supplierId" :value="item.supplierId">{{item.supplierName || ''}}</Option>
                </Select>
              </div>
            </template>
          </div>
        </div>
        <materialList :list="list" :chooseData="chooseData" :ids="ids" :disabledIds="disabledIds" @selectItem="selectItem" :type="curItem.type" :fromType="fromType"></materialList>
        <Spin size="large" fix v-if="spinShow"></Spin>
      </div>
      <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    </hold-layout>
  </div>
</template>

<script>
import materialList from "@/components/view-components/material-view/material-list.vue"
import HoldLayout from '../layout/hold-layout.vue';
import ListMixin from "@/helper/mixin/list-mixin";
import utils from "@/helper/utils/index.js";
  export default {
    components: {
      materialList,
      HoldLayout,
    },
    mixins:[ListMixin],
    data() {
      return {
        spinShow:false,
        selectAll:false,
        sourceList:[],
        curSourceId:-1,
        allData:[],
        totalCount:0,
        searchVal:"", 
      }
    },
    props: {
      chooseData: {
        type: Array,
        default: function () {
          return []
        }
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
      extraParams:{
        type:Object,
        default:function(){
          return {}
        }
      },
      curItem:{
        type:Object,
        default:function () {
          return {}
        }
      }
    }, 
    computed:{
      isShowTipsBox(){
        return !this.fromType || this.fromType=='distribute' || this.fromType=='material' || this.fromType=='customPages'
      },
      isShowSourceBox(){
        return this.fromType=='contentRepository';
      },
      ids(){
        let chooseData = this.chooseData || [];
        let ids = [];
        for(let i = 0; i < chooseData.length; i++){
          let id = chooseData[i].id;
          id && ids.push(id)
        }
        return ids;
      },
      disabledIds(){
        let chooseData = this.chooseData || [];
        let disabledIds = [];
        for(let i = 0; i < chooseData.length; i++){
          let item = chooseData[i] || {};
          item._disabled && disabledIds.push(item.id)
        }
        return disabledIds;
      },
      isDisabledAll(){
        return this.disabledIds.length >= this.totalCount
      }
    },
    methods: {
      selectItem(index,item) {
        if(item.isDistribute == 1 || this.isShowSourceBox)return;
        let bool = !!!item._selected;
        this.$set(this.list[index],'_selected',bool);
        if(bool){
          this.selectAll = this.list.every(item=>item._selected);
          if(!this.isMulti){
            this.list.forEach(item=>{item._selected = false})
            for(let i = this.chooseData.length;i>0;i--){
              this.chooseData.splice(i-1,1);
            }
          }
          this.chooseData.push({
            ...item,
            id:item.id,
            title:item.title,
            cover:item.cover,
            summary:item.summary,
            duration:item.duration,
            duration_str:item.duration_str,
            _selected:item._selected,
          });
        }else{
          this.selectAll = false;
          this.chooseData.splice(this.chooseData.findIndex(cur_item=>cur_item.id == item.id),1);
        }
        this.$set(this.list[index],'_selected',bool);
      },
      init(){
        if(this.isShowSourceBox){
          if(!this.sourceList || this.sourceList.length == 0){
            this.curSourceId = 0;
            return this.$MainApi.contentSourceList({
              data:{
                type:this.curItem.id || 0, 
              },
              other: {
                isErrorMsg: true
              }
            }).then(res=>{
              if(res.code){
                this.sourceList = res.data||[];
              }
              return res
            }).catch(e=>{
              return Promise.resolve();
            })
          }else{
            return Promise.resolve();
          }
        }else{
          return Promise.resolve();
        }
      },
      tapLoadData(){
        if(!this.inited){
          this.loadData();
        }
      },
      chooseAllData(){
        return new Promise((rs,rj)=>{
          if(this.allData.length>0){
            rs(this.allData)
          }else{
            this.onLoadData(1,{page:1,pageSize:this.totalCount},true).then(allData=>{
              this.allData = allData || [];
              rs(this.allData)
            })
          }
        }).then(allData=>{
          let ids = this.chooseData.map(item=>item.id);
          this.list.forEach(item=>{
            item._selected = true;
          })
          allData && allData.forEach(item=>{
            if(!ids.includes(item.id)){
              this.chooseData.push({
                ...item,
                id:item.id,
                title:item.title,
                cover:item.cover,
                summary:item.summary,
                duration:item.duration,
                duration_str:item.duration_str,
                _selected:true,
              })
            }
          });
        })
      },
      onLoadData(page,extraData,isGetAllData=false){
        return this.init().then(()=>{
          this.inited = true;
          this.spinShow = true;
          let extraParams = this.extraParams || {};
          let curItem = this.curItem;
          let reqName = extraParams.reqName || curItem.reqName;
          return this.$MainApi[reqName]({
            data:{
              type:curItem.id || 0,
              source_id:this.curSourceId||0,
              ...extraData,
              ...(this.extraParams||{}),
              searchq: this.searchVal
            },
            other: {
              isErrorMsg: true
            }
          }).then(res=>{
            let list = [];
             try {
              if(res.code){
                let data = res.data||{};
                let s_num = 0;
                list = data.list||[];
                list = list.map(item=>{
                    item = Object.assign({},
                    {...item},
                    {...this.mapItem(curItem.type,item)}
                  );
                  item._selected && s_num++;
                  return item
                })
                if(!isGetAllData){
                  this.data = {
                    list,
                    total:data.totalCount
                  }
                  this.totalCount = data.totalCount||0;
                  this.selectAll = s_num == this.list.length;
                }
              }
            } catch (error) {}
            return list;
          }).catch(e=>{
            this.inited = false;
          }).finally(()=>{
            this.spinShow = false;
          })
        });
      },
      mapItem(type,item){
        let result = {};
        let ids = this.chooseData.map(item=>item.id);
        switch (type){
          case 'tasteTest':
            result = {
              title: item.name,
              cover: item.coverPic,
              _selected:ids.includes(item[`${type}Id`]||item.id||0),
            }
            break; 
          case 'course':
            result = {
              id: item.id,
              _selected:ids.includes(item.id),
              title: item.courseName,
              cover:item.coverPic||item.cover||""
            }
            break; 
          default:
            result = { 
              id:item[`${type}Id`]||0,
              title:item[`${type}Title`]||"",
              cover:item[`${type}CoverPic`]||"",
              summary:item[`${type}Description`]||"",
              duration:item[`${type}TimeLength`]||0,
              duration_str:this.getDurationStr(item[`${type}TimeLength`]||0),
              _selected:ids.includes(item[`${type}Id`]),
            }
            break;
        }
        console.log('result',result)
        return result
      },
      getDurationStr(time){
        let arr = utils.transTime(time) || [];
        return arr && arr[0] == '00' ? arr.slice(1).join(':') : arr.join(':');
      },
      search(e){
        this.searchVal = e;
        this.loadData(1);
      },
      getData(){
        return this.chooseData
      },
      onCheckChange(bool){
        if(bool){
          this.chooseAllData();
        }else{
          let selectedData = this.$root.selectedData||{};
          for(let item in selectedData){
            // selectedData[item] = [];
            let arr = selectedData[item]||[];
            for(let i = arr.length-1;i>=0;i--){
              console.log('arr[i]',i,arr[i])
              if(arr[i]._disabled){
                continue;
              }else{
                arr.splice(i,1);
              }
            }
          }
          this.list.forEach(item=>{item._selected = false})
        }
        this.selectAll = !!bool;
      },
      sourceOnChange(){
        this.loadData(1);
      },
      setSelectAll(state){
        if(typeof(state) == 'boolean'){
          this.selectAll = state
        } else {
          this.selectAll = this.ids.length >= this.totalCount
        }
        
      }
    }
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
  color: #4d4444;
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
      padding-right: 0;
      padding-left: 10px;
      margin-left: 0px;
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
  .content-box{
    position: relative;
    margin-left: 30px;
    // padding-right: 20px;
    height: 100%;
    &.classify{
      padding-top: 44px;
      &.tipsBox{
        padding-top:114px;
      };
    }
    &.tipsBox{
      padding-top:70px;
    }; 
    // padding-bottom: 80px;
  }
  .filter-box{
    position:absolute;
    top: 0;
    right: 0;
    width: 100%;
    // padding-left: 40px;
  }
  .search-box{
    width:260px;
  }
  .classify-box{
    min-height: 50px;
  }
  .classify-item{
    min-width: 40px;
    min-height: 44px;
    padding: 0 20px;
    color: #333;
    border-radius: 4px;
    &.active{
      background: #F2FBFF;
      color: #008ACB;
    }
  }
  .tips-box,.source-box{
    min-height: 50px;
    margin: 10px 0;
  }
  .source-box{
    width: 165px;
  }
  .source-tip{
    margin-right:15px;
    font-size: 14px;
    color: #8e8e8e;
  }
  .type-num{
    color: #333;
    margin-right: 22px;
  }
}
.tab-item-area{
  flex: 1;
  overflow: hidden;
}
</style>