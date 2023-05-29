<template>
  <div class="organize-cont">
    <rewrite-area v-if="isShowSearch">
      <Input v-model="searchq" prefix="ios-search" placeholder="搜索组织" style="width: 100%;" clearable @on-change="search" />
    </rewrite-area>
    <div class="organize-tree-area">
      <div class="tree-area" v-bar>
        <div style="padding-right: 10px;">
          <div>
            <levelTree :data="levelData" :searchq="searchq" :selected="c_checkData" :selectedIds="c_checkId" @chooseLevel="chooseLevel" @chooseStructure="chooseStructure"></levelTree>
          </div>
        </div>
      </div>
    </div>
    <Spin fix v-show="loading"></Spin>
    <!-- <editOrganize v-if="isShowAdd" ref="editOrganizeRef" :organizeReqData="{ type: type }" title="新增组织" @success="getData"></editOrganize> -->
  </div>
</template>

<script>
import editOrganize from "@/components/UI-components/module/edit-organize/index.vue";
import OrgnHandle from "@/helper/handler/organize-handler.js";
import levelTree from "./components/level-tree.vue";
import strH  from "@/helper/utils/string-util.js";
export default {
  name: "organize",
  components: {
    editOrganize,
    levelTree
  },
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    expandNode: {
      type: Boolean,
      default: true,
    },
    selectNode: {
      type: Boolean,
      default: true,
    },
    showCheckbox: {
      type: Boolean,
      default: true,
    },
    isRelation: { // true 则存在勾选父，子不可取消，不勾选父则子项自由选择
      type: Boolean,
      default: false
    },
    type: String | Number, //请求数据： 1.代表获取全部组织架构，2.获取管理员有权限的组织架构
    isModal:{
      type: Boolean,
      default: false
    },
    isShowAdd:{
      type: Boolean,
      default: true
    },
    searchClick:{
      type: Boolean,
      default: false
    },
    isShowSearch:{
      type: Boolean,
      default: true
    },
    isLImitMain: { // 手动限制选择主体
      type: Boolean | String,
      default: ""
    },
    isHideMainCheck: Boolean,
    isShowAllBtn: Boolean,
    isOnlyCanSel:Boolean,
    onlyCanSelArr:Array,
    isShowLevel: Boolean
  },
  data() {
    return {
      searchq: "",
      loading: false,
      searchSelectId: -1,
      levelData: {},
      c_searchData: [],
      c_checkData: []
    };
  },
  computed: {
    c_checkId(){
      let c_checkData = this.c_checkData || [];
      let c_checkId = [];
      for(let i = 0; i < c_checkData.length; i++){
        if(c_checkData[i].id || c_checkData[i].id === 0){
          c_checkId.push(c_checkData[i].id)
        }
      }
      return c_checkId;
    }
  },
  methods: {  
    getData(selectData, extra = {}) {
      this.c_checkData = selectData || [];
      this.loading = true;
      return OrgnHandle.getData(this.type).then(res=>{
        let organizationItems = res.organizationItems||[];
        let treeData = this.initTreeData(organizationItems) || {};
        this.levelData = treeData.levelData || {};
        console.log("levelData", treeData.levelData);
        return res
      }).finally(()=>{
        this.loading = false;
      })
    },
    initTreeData(data, parents = [], parentName = [], level = 0, levelData = {}){
      for(let i = 0; i < data.length; i++){
        let item = data[i] || {};
        item._parents = parents;
        item._parentName = parentName;
        item.level = level;
        let levelName = strH.sectionToChinese(level) || "";
        item.levelName = levelName;
        let title = item.structure_name || item.title || ""; 
        item.title = title;
        item.searchKey = title + '(' + levelName + ')'
        // 倒叙
        try {
            item.reversePName = parentName.join("/").split('').reverse().join('').split('/');
            item.reverseTitle = title.split('').reverse().join('');
          } catch (error) {}
        if(!levelData[level]){
          levelData[level] = {
            level: level,
            levelName: levelName,
            data: []
          };
        }
        let _item = { ...item }
        delete _item.children;
        levelData[level].data.push(_item);
        if(item.children && item.children.length){
          let _parents = [...parents, item.id];
          let _parentName = [...parentName, item.structure_name];
          let _children = item.children || [];
          this.initTreeData(_children, _parents, _parentName, level + 1, levelData)
        }
      }
      return {
        levelData
      }
    },
    chooseLevel(detail){
      let levelData = this.levelData || {};
      let data = levelData[parseInt(detail.level)] && levelData[parseInt(detail.level)].data;
      if(data){
        for(let i = 0; i < data.length; i++){
          let item = data[i] || {}
          detail.item = item;
          this.chooseStructure(detail);
        }
      }
    },
    chooseStructure(detail){
      let item = detail.item || {};
      if(item.id){
        let index = this.c_checkId.indexOf(item.id);
        if(detail.state && index == -1){
          this.c_checkData.push(item);
        }
        if(!detail.state && index != -1){
          this.c_checkData.splice(index, 1);
        }
      }
    },
    removeSelect(index){
      this.c_checkData.splice(index, 1);
    },
    search(){
      
    }
  },
  watch: {
    c_checkData: {
      handler(nV) {
        this.$emit("on-change", nV);
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="less">
.organize-cont {
  display: flex;
  flex-direction: column;
  position: relative;
  width:100%;
  height:100%;
  .organize-tree-area {
    flex: 1;
    overflow: hidden;
    .tree-area {
      width: 100%;
      height: 100%;
    }
    .ivu-tree {
      ul {
        li {
          position: relative;
          .ivu-checkbox-wrapper {
            position: absolute;
            top: 0px;
            left: 20px;
            width: 20px;
            height: 28px;
            margin: 0px;
            .ivu-checkbox {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
          .ivu-tree-arrow {
            position: absolute;
            top: 3px;
            left: 5px;
            // display: none;
          }
          .ivu-tree-title {
            flex: 1;
            display: block;
            line-height: 28px;
            width: 100%;
          }
        }
      }
      .ivu-tree-empty {
        padding: 70px 0px;
        text-align: center;
        color: #b2b2b2;
      }
    }
  }
  //
  .search-area {
    .search-item {
      padding: 3px;
      margin-bottom: 5px;
    }
    .search-item:hover {
      background-color: #e9f3fd;
    }
    .search-item.selected{
      background-color: #e9f3fd;
      color:#0083CE;
    }
    .img-orgn{
      margin-right:8px ;
      width: 17px;
      height: 17px;
    }
    .checkBox{
      line-height: 40px;
    }
    .searchClick{
      padding-left: 15px;
      .ivu-checkbox{
        display: none;
      }
    }
    .search-icon{
      width: 16px;
      height: 16px;
      margin-right: 5px;
      display: block;
    }
  }
  .organize-footer{
    position: sticky;
    width:100%;
    left: 0px;
    bottom: 0px;
    padding: 10px;
    background-color: #fff;
    .footer-btn{
      width:100%;
      height: 30px;
    }
  }
}
</style>