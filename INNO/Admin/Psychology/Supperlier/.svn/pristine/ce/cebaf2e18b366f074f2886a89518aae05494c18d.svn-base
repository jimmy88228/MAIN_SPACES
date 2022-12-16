<template>
  <hold-layout :isFull="true" class="gauge-index">
    <searchForm :searchForm="searchForm" @search="loadData()" @add="add" @import="importGaugeExcel()"></searchForm>
    <Table
      ref="myTable"
      class="full-table"
      :columns="columns"
      :data="list"
      border
      :loading="tableLoading"
    >
      <template slot="state" slot-scope="{ row, index }">
          <div  @click="row.publish_state == 1 ? $Message.warning('发布的量表不可关闭') : ''">
              <i-switch :disabled="row.publish_state == 1" v-model="row.publish_state" size="large" :loading="row.stateLoading" :true-value="1" :false-value="0" :before-change="()=>{return beforeChangeState(index, row)}">
                  <span slot="open" class="w-nowrap">已发布</span>
                  <span slot="close" class="w-nowrap">待发布</span>
              </i-switch>
          </div>
      </template>
      <template slot="handle" slot-scope="{ row }">
        <div class="operate-area">
          <a
            @click="edit(row.id,'gaugeEdit')"
            class="operate"
            v-hasAction="'scale_maintenance_update'"
            >内容管理</a>
            <a
            @click="edit(row.id,'resultEdit')"
            class="operate"
            v-hasAction="'scale_maintenance_update'"
            >结果管理</a>
            <!-- <a
            @click="problemsPreview(row)"
            class="operate"
            >题库总视图</a> -->
        </div>
      </template>
    </Table>
    <rewrite-page
      slot="footer"
      :total="total"
      :current="page"
      :page-size="pageSize"
      :page-size-opts="pageSizeOpts"
      @on-change="(e) => loadData(e)"
      @on-page-size-change="handlePageSizeChange"
      show-sizer
      show-elevator
      show-total
      transfer
    ></rewrite-page>
    
    <custom-modal footerHide :width="800" ref="modalId" class="hold-modal-zindex">
        <div class="form-view-box">
            <form-view ref="formView" class="box"></form-view>
            <div class="flex-e-c m-t-10">
                <Button @click="cancel" class="m-r-20">取消</Button>
                <Button @click="confirm" type="primary" class="m-r-20">确定</Button>
            </div> 
        </div>
    </custom-modal>
  </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form";
import mixins from "./mixins";
import formView from './edit-gauge/form.vue';
export default {
  name: "gaugeIndex",
  mixins: [ListMixin, mixins],
  components: { searchForm , formView},
  data() {
    return {
      searchForm: {
        searchq: "",
      },
    };
  },
  methods: {
    onLoadData(page, extraData) {
      return this.$MainApi
        .scaleList({
          data: {
            ...this.searchForm,
            ...extraData,
          },
          other: {
            isErrorMsg: true
          }
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || {};
            let items = data.items || [];
            items.map((item)=>{
              item.stateLoading = false
            })
            this.data = {
              total: data.total,
              list: data.items,
            };
          }
        });
    },
    edit(id,name) {
      this.$router.push({
        name,
        query: {
          id: id || 0,
          type:name
        },
      });
    },
    add(){
      this.$refs.modalId.show();
      this.$refs["formView"] && this.$refs["formView"].init();
    },
    importGaugeExcel(){
      this.$UIModule({
          mode: "batch-import",
          options: {
              canCreate: { upload: true, download: true },
              uploadUrl: "scaleBatchImport",
              downloadUrl: "scaleBatchImportTpl",
          },
          success: () => {
              this.loadData();
          },
      });
    },
    beforeChangeState(index, row) {
        let id = row.id || 0;
        let state  = row.publish_state || 0;
        state  = state == 1 ? 0 : 1;
        this.$set(row, "stateLoading", true);
        return new Promise((rs, rj) => {
          this.$Modal.confirm({
            title: "提示",
            content: "量表发布后，题目管理和结果管理不可再编辑！是否继续发布？",
            okText: "继续发布",
            onCancel:()=>{
              this.$set(row, "stateLoading", false);
            },
            onOk:()=>{
              this.setState(id, state)
                .then(() => {
                    this.$set(row, "stateLoading", false);
                    return rs();
                })
                .catch(() => {
                    this.$set(row, "stateLoading", false);
                    return rj();
                })
            }
          })
        });
    },
    setState(id, state) {
      if (!id) {
          this.$Message.warning("无效id");
          return Promise.reject();
      }
      return this.$MainApi.setPublishState({
          data: {
              id: id,
              publish_state : state,
          },
      })
      .then((res) => {
          if (res.code) {
              this.$Message.success(res.message || "修改成功");
              return Promise.resolve();
          } else {
              this.$Message.warning(res.message || "修改失败");
              return Promise.reject();
          }
      });
    },
    save(formData){
        return this.$MainApi.scaleDimensionAdd({
            data:{
                ...formData,
                estimated_time: parseFloat(formData.estimated_time||0),
            }
        }).then(res=>{
          if(res.code){
            this.cancel();
            this.loadData(); 
          }
          res.message && this.$Message.info(res.message);
        })
    },
    confirm(){
        this.$refs.formView.validate().then((formData)=>{
            this.save(formData);
        })
    },
    cancel(){
        this.$refs.modalId.dismiss();
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.gauge-index{
  .ivu-switch{
    width: 70px;
  }
  .ivu-switch-large.ivu-switch-checked:after{
    right: 2px;
    left: auto;
  }
}
</style>