<template>
  <div class="organize-cont">
    <rewrite-area v-if="isShowSearch">
      <Input v-model="searchq" prefix="ios-search" placeholder="搜索组织" style="width: 100%;" clearable @on-change="search" />
    </rewrite-area>
    <div class="organize-tree-area">
      <div class="tree-area" v-bar>
        <div style="padding-right: 10px;">
          <div v-show="!searchq">
            <!-- :show-checkbox="showCheckbox" -->
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
                </Checkbox>
              </div>
            </div>
            <div class="empty-area" v-if="!c_searchData || c_searchData.length == 0">暂无匹配数据</div>
          </div>
        </div>
      </div>
    </div>
    <div class="organize-footer" v-if="isShowAdd">
      <Button class="footer-btn" @click="addOrganize" v-hasAction="'structure_member_add'">新增组织</Button>
    </div>
    <Spin fix v-show="loading"></Spin>
    <editOrganize v-if="isShowAdd" ref="editOrganizeRef" :organizeReqData="{ type: type }" title="新增组织" @success="getData"></editOrganize>
  </div>
</template>

<script>
import commMixins from "./comm-mixins.js";
import renderMixins from "./render-mixins.js";
import editOrganize from "@/components/UI-components/module/edit-organize/index.vue";
import OrgnHandle from "@/helper/handler/organize-handler.js";
import organizeDef from "@/assets/images/organize.def.png";
export default {
  name: "organize",
  mixins: [renderMixins, commMixins],
  components: {
    editOrganize
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
      organizeDef
    };
  },
  computed: {
    limitMain(){
      if(typeof(this.isLImitMain) == 'boolean'){
        return this.isLImitMain;
      } else {
        return this._isSuperIds == 1;
      }
    }
  },
  methods: {  
    getData(selectData, extra = {}) {
      this.c_checkData = selectData || [];
      this.loading = true;
      return OrgnHandle.getData(this.type).then(res=>{
        let organizationItems = res.organizationItems||[];
        let {
          _treeData,
          _selectData
        } = this._initTreeData(organizationItems, [], extra);
        this.c_organizeList = _treeData;
        this.c_checkData = _selectData;
        console.log('getDatagetData',{c_organizeList:this.c_organizeList,c_checkData:this.c_checkData})
        return res
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
      }else if(selectIndex != -1){
        let checkItem = c_checkData[selectIndex] || {};
        // disabled失效; 存在关联isRelation，父元素已选pChecked; 限制主体
        if((this.isRelation && checkItem.pChecked) || (this.limitMain && item.id == '0' && !item.checked)){
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    search(e){
      let value = e.target.value;
      this._searchTreeHandle(value);
      // 搜索中，选择了某项，回到tree状，同步给tree选项
      // if(!value && (this.searchSelectId || this.searchSelectId == 0)){
      //   this._handleTreeData(this.c_organizeList,
      //   "selected",
      //   {
      //     id: this.searchSelectId,
      //   });
      // }
    },
    toggleCheck(state, row) {
      this.$set(row, 'limitMain', this.limitMain)
      this._handleTreeData(
        this.c_organizeList,
        "checked",
        row
      );
      console.log('c_organizeList',this.c_organizeList)
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
      selectItem.limitMain = this.limitMain;
      this._handleTreeData(
        this.c_organizeList,
        "checked",
        selectItem,
        0,
        {
          isShowLevel: this.isShowLevel
        }
      );
    },
    addOrganize(){
      this.$refs["editOrganizeRef"] && this.$refs["editOrganizeRef"].showModal();
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