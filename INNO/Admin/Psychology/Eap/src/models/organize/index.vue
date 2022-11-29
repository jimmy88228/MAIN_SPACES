<template>
  <hold-layout>
    <div class="organize-index-area">
      <searchForm :searchForm="searchForm" @search="onSearch" @create="createOrganize" @removeIds="batchRemoveItem()"></searchForm>
      <div class="tree-table">
        <div class="tree-table-tr tree-table-header">
          <div class="tree-table-td tree-t-l">组织名称</div>
          <div class="tree-table-td tree-t-l-m">组织ID</div>
          <div class="tree-table-td tree-t-m">组织人数</div>
          <div class="tree-table-td tree-t-r">操作</div>
        </div>
        <div v-show="!showSearchResult">
            <Tree class="tree-table-cont" :data="c_organizeList" :multiple="true" :expand-node="true" :show-checkbox="true" @on-check-change="toggleCheck" ></Tree>
        </div>
        <div v-show="showSearchResult" class="search-area">
            <div class="search-item tree-table-tr" :title="item._parentName.join('/') + '/' + item.title" v-for="(item) in c_searchData" :key="item.id">
                <div class="tree-table-td tree-t-l">
                    <Checkbox :value="ids.indexOf(item.id) != -1" @on-change="(state)=>_searchTreeCheck(state, item)" class="flex-s-c" style="width:100%;">
                    <span class="text-flow p-l-10">{{item.title}}</span>
                    </Checkbox>
                </div>
                <div class="tree-table-td tree-t-l-m">
                    {{item.id}}
                </div>
                <div class="tree-table-td tree-t-m">
                    {{item.getson_count}}
                </div>
                <div class="tree-table-td tree-t-r">
                    <div class="operate-area">
                        <a class="operate" v-if="item.id > 0" @click="editOrganize(item)" v-hasAction="'structure_structure_update'">编辑</a>
                        <a class="operate" @click="editOrganize(item, 'group')" v-hasAction="'structure_structure_add'">增加小组</a>
                    </div>
                </div>
            </div>
            <div class="empty-area" v-if="!c_searchData || c_searchData.length == 0">暂无匹配数据</div>
        </div>
      </div>
    </div>
    <editOrganize ref="editOrganizeRef" :title="editTitle" @success="onLoadData"></editOrganize>
  </hold-layout>
</template>

<script>
import searchForm from "./search-form.vue";
import commMixins from "@/components/view-components/organize-view/comm-mixins.js";
import renderMixins from "./render-mixins.js";
import editOrganize from "@/components/UI-components/module/edit-organize/index.vue";
export default {
  name: "organizeIndex",
  components: {
    searchForm,
    editOrganize,
  },
  mixins: [renderMixins, commMixins],
  data() {
    return {
      searchForm: {
        ids: 0,
        searchq: ""
      },
      searchq: "",
      editTitle: "",
      showSearchResult:false
    };
  },
  
  methods: {
    onLoadData() {
      this.$store.commit("setPageLoading", true);
      this.searchForm.ids = this._mainId;
      return this.$MainApi
        .getStructureListByIDS({
          data: {
            ...this.searchForm,
          },
          other: {
            isErrorMsg: true
          }
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || {};
            let items = [data];
            let { _treeData } = this._initTreeData(items, [], { expandHold: true });
            this.c_organizeList = _treeData;
            if(this.searchq){
              this.onSearch(this.searchq);
            }
          }
        }).finally(()=>{
            this.$store.commit("setPageLoading", false);
        })
    },
    toggleCheck(data, row) {
      this.c_checkData = data || [];
      this._handleTreeData(
        this.c_organizeList,
        "checked",
        row
      );
    },
    createOrganize(detail) {
      if (detail.isBatch) {
        this.$UIModule({
          mode: "batch-import",
          options: {
            canCreate: { upload: true, download: true },
            uploadUrl: "structureBatchImport",
            downloadUrl: "structureDownloadBatchTpl",
          },
          success: () => {
            this.onLoadData();
          },
        });
      } else {
        this.editOrganize(null);
      }
    },
    editOrganize(item, type) {
      item = item || {};
      let organizeInfo = {};
      if(type == 'group'){
          organizeInfo.pid = item.id,
          organizeInfo.parentIds = [...item._parentIds, Number(item.id)];
      } else {
          
          organizeInfo = {
            ...item,
            parentIds: item._parentIds
          }
      }
      this.editTitle = organizeInfo.id ? "编辑组织" : "创建组织";
      this.$refs["editOrganizeRef"] &&
        this.$refs["editOrganizeRef"].showModal(organizeInfo);
    },

    //删除功能暂时不做
    removeItem(id, index) {
      this.batchRemoveActReq([id]).then(() => {
        this.delItem(index);
      });
    },
    batchRemoveItem() {
      this.batchRemoveActReq(this.ids).then(() => {
        this.delItems(this.ids);
      });
    },
    batchRemoveActReq(ids) {
      if (ids.length == 0 || !ids[0]) {
        this.$Message.warning("请勾选删除项！");
        return Promise.reject();
      }
      this.tableLoading = true;
      return this.$MainApi
        .structureDelete({
          data: {
            ids: ids,
          },
        })
        .then((res) => {
          if (res.code) {
            this.$Message.success(res.message || "删除成功");
            return Promise.resolve();
          } else {
            this.$Message.warning(res.message || "删除失败");
            return Promise.reject();
          }
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    onSearch(data){
      this.searchq = data;
      this.showSearchResult = !!data
      this._searchTreeHandle(data);
    },
  },
  mounted() {
    this.onLoadData();
  },
};
</script>

<style lang="less">
@import "~@/assets/css/variables.less";
.organize-index-area {
  @tr-height: 83px;
  .tree-table {
    width: 100%;
    .tree-table-tr {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0px 10px;
      border-bottom: 1px solid #efefef;
      height: @tr-height;
      background-color: #fff;
      transition: background .35s;
    }
    .tree-table-tr:hover{
        background-color:#E9F3FD;
    }
    .tree-table-tr.tree-table-header {
      height: 48px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #b2b2b2;
      background: none;
    }
    .tree-table-td {
      padding: 0px 10px;
    }
    .tree-t-l {
      width: 60%;
      min-width: 300px;
    }
    .tree-t-l-m{
      flex: 1;
      min-width: 70px;
    }
    .tree-t-m {
      flex: 1;
      min-width: 100px;
    }
    .tree-t-r {
      width: 162px;
      text-align: left;
      flex-shrink: 0;
    }
  }
  /* tree */
  .tree-table-cont {
    ul {
      padding: 0px;
      li {
        position: relative;
        margin: 0px;
        padding-left: 35px;
        .ivu-checkbox-wrapper {
          position: absolute;
          top: 0px;
          left: 20px;
          width: 20px;
          height: @tr-height;
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
          top: calc((@tr-height - 20px) / 2);
          left: 5px;
        }
        .ivu-tree-title {
          flex: 1;
          display: block;
          line-height: 28px;
          width: 100%;
          background: none;
        }
      }
    }
    .ivu-tree-empty{
        padding: 100px 0px;
        text-align: center;
        color: @invalid-color;
    }
  }
}
</style>