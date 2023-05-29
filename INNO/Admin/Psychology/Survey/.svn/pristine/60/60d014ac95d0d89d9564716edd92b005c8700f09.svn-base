<template>
  <div class="class-organize-area">
    <div class="organize-cont">
      <rewrite-area v-if="isShowSearch">
        <Input v-model="searchq" prefix="ios-search" placeholder="搜索班级" style="width: 100%;" clearable @on-change="search" />
      </rewrite-area>
      <div class="organize-tree-area">
        <div class="tree-area" v-bar>
          <div style="padding-right: 10px;">
            <div v-show="!searchq">
              <Tree :data="c_organizeList" :multiple="multiple" :expand-node="expandNode" :select-node="selectNode"  :check-strictly="true"  @on-select-change="toggleSelect"></Tree>
            </div>
            <div v-show="searchq" class="search-area">
              <div class="search-item flex-s-c" :class="[searchClick?'searchClick':'', searchClick && (searchSelectId == item.id) ? 'selected':'']" :title="item._parentName.join('/') + '/' + item.title" v-for="(item) in c_searchData" :key="item.id">
                <img v-if="searchClick" :src="searchSelectId == item.id ? item.selectIcon : item.icon" alt="" class="img-orgn">
                <div @click="searchClick ? toggleSelectClick(item) : ''">
                  <Checkbox 
                  :value="ids.indexOf(Number(item.id)) != -1" 
                  :disabled="setSearchCheckboxDisable(item)"
                  @on-change="(state)=>_searchTreeCheck(state, item)" 
                  class="flex-s-c checkBox" 
                  style="width:100%;">
                    <span class="text-flow p-l-10">{{item.title}}</span>
                    <span class="is-graduate" v-if="item.class_state == 2">已毕业</span>
                  </Checkbox>
                </div>
              </div>
              <div class="empty-area" v-if="!c_searchData || c_searchData.length == 0">暂无匹配数据</div>
            </div>
          </div>
        </div>
      </div>
      <Spin fix v-show="loading"></Spin>
    </div>
  </div>
</template>

<script>
import commMixins from "./comm-mixins.js";
import renderMixins from "./render-mixins.js";
import organizeDef from "@/assets/images/organize.def.png";
export default {
  name: "organize",
  mixins: [renderMixins, commMixins],
  components: {
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
    isShowAllBtn: Boolean
  },
  data() {
    return {
      searchq: "",
      loading: false,
      searchSelectId: -1,
      organizeDef,
    };
  },
  computed: {
    limitMain(){
      if(typeof(this.isLImitMain) == 'boolean'){
        return this.isLImitMain;
      } else {
        return false
      }
    }
  },
  methods: {
    showModal(params = {}){
      let { selectData, extra } = params;
      this.getData(selectData, extra)
    },
    getData(selectData, extra) {
      this.c_checkData = selectData || [];
      this.loading = true;
      let reqParams = extra.reqParams || {}
      return this.$MainApi.getStructureData({
          data: reqParams,
          other: {
            isErrorMsg: true
          }
      }).then((res)=>{
        if(res.code){
          let data = res.data || {};
          let organizaData = [data];
          let {
            _treeData,
            _selectData
          } = this._initTreeData(organizaData, [], extra);
          this.c_organizeList = _treeData;
          this.c_checkData = _selectData;
        }
      }).finally(()=>{
        this.loading = false;
      })
    },
    // 控制搜索checkbox是否可操作
    setSearchCheckboxDisable(item){
      let selectIndex = this.ids.indexOf(Number(item.id));
      let c_checkData = this.c_checkData || [];
      if(item.disabled){
        return true;
      }
      if(this.limitMain && item.type == 'school'){
        return true;
      }
      if(item.class_state == 2 && !item.checked){
        return true;
      }
      if(selectIndex != -1){
        let checkItem = c_checkData[selectIndex] || {};
        if((this.isRelation && checkItem.pChecked)){
          return true;
        }
      }
    },
    search(e){
      let value = e.target.value;
      this._searchTreeHandle(value);
    },
    toggleCheck(state, row) {
      this._handleTreeData(
        this.c_organizeList,
        "checked",
        row
      );
    },
    toggleSelect(data, row){
      this.searchSelectId = row.id;
      this.$emit("on-select-change", { data, row })
    },
    toggleSelectClick(item){
      this.searchSelectId = item.id;
      this.$emit("on-select-change", { data:[item], row:item })
    },
    removeSelect(index) {
      let selectItem = { ...this.c_checkData[index] };
      selectItem.checked = false;
      this._handleTreeData(
        this.c_organizeList,
        "checked",
        selectItem
      );
    },
    addOrganize(){
      this.$refs["editOrganizeRef"] && this.$refs["editOrganizeRef"].showModal();
    },
    // confirm(){
    //   this.$emit("on-change", this.c_checkData);
    // }
  },
  watch:{
    c_checkData: {
      handler(nV) {
        this.$emit("on-change", nV);
      },
      immediate: true,
      deep: true,
    },
  }
};
</script>

<style lang="less">
.class-organize-area{
  width:100%;
  height:100%;
}
.organize-cont {
  display: flex;
  flex-direction: column;
  position: relative;
  width:100%;
  height:100%;
  .organize-tree-area {
    flex: 1;
    height:100%;
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
.is-graduate{
  color: #AEAEAE;
  background-color: #FBFBFB;
  display: inline-block;
  padding: 1px 5px;
  border-radius: 3px;
  margin-left: 5px;
  line-height: 20px;
}
</style>