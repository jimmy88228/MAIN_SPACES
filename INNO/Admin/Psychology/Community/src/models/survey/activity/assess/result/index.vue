<template>
  <hold-layout :isFull="true">
    <div class="init-title">
      {{activityInfo.activityName || ""}}
    </div>
    <searchForm :searchForm="searchForm" @search="loadData()" :structureArr="structureArr" @exportHandle="exportHandle"></searchForm>
    <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading"  @on-sort-change="sortChange">
      <template slot="member_name" slot-scope="{ row }">
          <p class="p-t-5 p-b-5">{{ row.member_name || "--"}}</p>
      </template>
      <template slot="structure_name" slot-scope="{ row }">
        {{row.structure_name || '--'}}
      </template>
      <template slot="state_str" slot-scope="{ row }">
        {{(row.state_str || '--')}}
      </template>
      <template slot="create_time" slot-scope="{ row }">
          <p class="p-t-5 p-b-5">{{row.record_create_time || "--"}}</p>
      </template>
      <template slot="complete_time" slot-scope="{ row }">
          <p class="p-t-5 p-b-5">{{row.record_complete_time || '--'}}</p>
      </template>
      <template slot="handle" slot-scope="{ row }">
          <div class="operate-area">
            <a class="operate" @click="report(row)" v-hasAction="[(row.handle && row.handle.report)]" >报告</a>
            <a class="operate" @click="answer(row)" v-hasAction="[(row.handle && row.handle.answer)]" >答案</a>
            <a class="operate " :class="{'invalid': row.warning_number > 0}" @click="resetResult(row)" v-if="row.handle.reset || (!row.handle.reset && row.warning_number > 0 && row.record_id)">重测</a>
          </div>
      </template>
    </Table>
    <rewrite-page
    slot="footer"
    :total="total"
    :current="page"
    :page-size="pageSize"
    :page-size-opts="pageSizeOpts"
    @on-change="e=>loadData(e)"
    @on-page-size-change="handlePageSizeChange"
    show-sizer
    show-elevator
    show-total
    transfer
    ></rewrite-page>
    <!--异步处理导出excel组件-->
    <mpNotice :ref="'notice' + item" v-for="item in jobIdCol" :key="item"></mpNotice>
  </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form.vue";
import mixins from "./mixins";
import mpNotice from "@/components/main-components/mq-notice/mq-notice";
export default {
  name: "assessResult",
  mixins: [ListMixin, mixins],
  components: { searchForm, mpNotice },
  data(){
    return {
      jobIdCol: [],
      searchForm: {
          activityid: 0,
          searchq: "",
          state: -2,
          field: "",
          fieldBy: "desc",
          structure_id:0,
          prent_structure_ids:[],
      },
      activityInfo: {},
      structureArr:[],
      structureName:'',
      is_view: 1
    }
  },
  computed:{
    isUnkown(){
      return this.is_view == 2;
    }
  },
  methods:{
    initData(){
      let state = this.pageQuery.state;
      if(!isNaN(parseInt(state))){
        this.searchForm.state = parseInt(state);
      }
      this.searchForm.activityid = Number(this.pageQuery.activityId);
      this.searchForm.structure_id = Number(this.pageQuery.structureId) || 0;
      let prentStructureIds = this.pageQuery.prentStructureIds;
      if(!(prentStructureIds instanceof Array)){
        prentStructureIds = prentStructureIds ? [prentStructureIds] : []
      }
      this.searchForm.prent_structure_ids = prentStructureIds;
      this.structureName = this.pageQuery.structureName || ''
    },
    onLoadData(page, extraData) {
      // let type = this.pageQuery.type;
      // this.is_view = this.pageQuery.is_view;
      // is_view == 2时跳转未知组织人员列表
      // let req = this.is_view == 2 ? "unknownStructureList" : "appraisalScheduleResult";
      let req = "appraisalScheduleResult"
      return this.$MainApi[req]({
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
              this.activityInfo.activityName = data.activityName
              this.data = {
                  total: data.total,
                  list: data.items,
              };
          }
      });
    },
    sortChange(a, b, type){
      let detail = a || {}
      if(detail.key){
        this.searchForm.field = detail.order == "normal" ? "" : (detail.key || "");
        this.searchForm.fieldBy = detail.order == "normal" ? "desc" : (detail.order || "desc");
        this.searchForm.fieldBy = this.searchForm.fieldBy.toUpperCase();
        this.loadData();
      }
    },
    report(row){
      this.$UIModule({
          mode: "clause-view",
          success: () => {
              this.$router.push({
                name: "assessReport",
                query: {
                  type: this.pageQuery.type,
                  modelId: Number(row.model_id) || 0,
                  recordId: row.id || row.record_id,
                  userId: Number(row.user_id)
                }
              })
          }
      })
      
    },
    answer(row){
      this.$UIModule({
          mode: "clause-view",
          success: () => {
              this.$router.push({
                name: "assessAnswer",
                query: {
                  modelName: this.pageQuery.modelName,
                  type: this.pageQuery.type,
                  modelId: Number(row.model_id) || 0,
                  recordId: row.id || row.record_id,
                }
              })
          }
      })
    },
    resetResult(row){
      if(!row.record_id){ return; }
      if(row.warning_number > 0){
        this.$Message.warning("预警记录已审核通过，不能重测");
        return;
      }
      this.$Modal.confirm({
        title: "提示",
        render: (h, params)=>{
          return h('div',{
            class: "text-c"
          },[
            h('div', {
              style: {
                padding: "10px 0px 5px 0px",
                fontSize: "16px"
              }
            }, "是否需要重新测评？"),
            h('p',{
              class: "notice",
              style: {
                fontSize: "12px"
              }
            },'(重新测试将会清除上次的测评记录)')
          ])
        },
        onOk:()=>{
          this.resetResultReq(row);
        }
      })
    },
    resetResultReq(row){
      let req = 'appraisalActivityResetResult';
          return this.$MainApi[req]({
              data: {
                  record_id: row.record_id
              },
              other: {
                isShowLoad: true,
                isMsg: true
              }
          })
          .then((res) => {
              if (res.code) {
                  this.handleUpdate();
              }
          });
    },
    exportHandle(){
      let req = 'appraisalActivityResultExport'
      return this.$MainApi[req]({
          data: {
            ...this.searchForm
          },
          other: {
            isErrorMsg: true
          }
      })
      .then((res) => {
          if (res.code) {
              let data = res.data;
              if (data) {
                  this.jobIdCol.push(data);
                  this.$nextTick(() => {
                      this.$refs[`notice${data}`][0].showNotice(data);
                  });
              }
              return data || {};
          }
      });
    }
  },
  mounted() {
    this.initData();
    this.loadData();
  },
}
</script>

<style lang="less" scoped>
  .init-title{
    font-size: 22px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #171717;
    line-height: 30px;
    margin-bottom: 23px;
    padding-left: 20px;
  }
</style>