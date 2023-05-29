<template>
  <hold-layout :isFull="true" :style="activityInfo.activityName ? 'margin-top: -15px' : ''">
    <div class="activity-name">{{activityInfo.activityName}}</div>
    <searchForm :searchForm="searchForm" @search="loadData()" @exportHandle="exportHandle"></searchForm>
    <rewrite-table ref="myTable" class="full-table" :columns="columns" :data="list" :loading="tableLoading"  @on-sort-change="sortChange">
      <template slot="create_time" slot-scope="{ row }" >
          <p class="p-t-5 p-b-5">{{row.record_create_time || "--"}}</p>
      </template>
      <template slot="complete_time" slot-scope="{ row }">
          <p class="p-t-5 p-b-5">{{row.record_complete_time || '--'}}</p>
      </template>
      <template slot="class_name" slot-scope="{ row }">
          <p class="p-t-5 p-b-5">{{row.old_class_name}}</p>
          <p class="p-t-5 p-b-5 new-class w-nowrap" v-if="row.student_state_str">{{row.student_state_str}}</p>
      </template>
      <template slot="handle" slot-scope="{ row }">
          <div class="operate-area text-r">
            <a class="operate" @click="report(row)" v-hasAction="[row.handle && row.handle.report]" >报告</a>
            <a class="operate" @click="answer(row)" v-hasAction="[row.handle && row.handle.answer]">答案</a>
            <a class="operate " :class="{'invalid': row.warning_number > 0}" @click="resetResult(row)" v-if="row.handle.reset || (!row.handle.reset && row.warning_number > 0 && row.record_id)">重测</a>
          </div>
      </template>
    </rewrite-table>
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
          class_id: 0,
          activityid: 0,
          searchq: "",
          state: "",
          school_id: 0,
          campus_id: 0,
          grade_id: 0,
          field: "", // record_create_time, record_complete_time
          fieldBy: "desc"
      },
      // inited:false,
      activityInfo: {}
    }
  },
  methods:{
    initData(){
      let state = this.pageQuery.state;
      if(!isNaN(parseInt(state))){
        this.searchForm.state = parseInt(state);
      }
      this.searchForm.activityid = Number(this.pageQuery.activityId);
      if(Number(this.pageQuery.schoolId)) {this.searchForm.school_id = Number(this.pageQuery.schoolId) || 0;}
      this.searchForm.campus_id = Number(this.pageQuery.campusId) || 0;
      this.searchForm.class_id = Number(this.pageQuery.gradeId) || 0;
      this.searchForm.grade_id = Number(this.pageQuery.gradeId) || 0;
    },
    onLoadData(page, extraData) {
      let type = this.pageQuery.type;
      // if(!this.inited){
        // this.searchForm.activityid = Number(this.pageQuery.activityId);
        // if(Number(this.pageQuery.schoolId)) {this.searchForm.school_id = Number(this.pageQuery.schoolId) || 0;}
        // this.searchForm.campus_id = Number(this.pageQuery.campusId) || 0;
        // this.searchForm.class_id = Number(this.pageQuery.gradeId) || 0;
        // this.searchForm.grade_id = Number(this.pageQuery.gradeId) || 0;
        // this.inited = true;
      // }
      let req = type == 'task' ? 'assessmentTaskResult' : 'appraisalScheduleResult';
      return this.$MainApi[req]({
          data: {
              ...this.searchForm,
              ...extraData,
          },
      })
      .then((res) => {
          if (res.code) {
              let data = res.data || {};
              this.activityInfo.activityName = data.activity_name;
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
              name: this.pageQuery.type == 'task' ? "assessTaskReport" : "assessReport",
              query: {
                type: this.pageQuery.type,
                modelId: Number(row.model_id),
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
              name: this.pageQuery.type == 'task' ? "assessTaskAnswer" : "assessAnswer",
              query: {
                modelName: this.pageQuery.modelName,
                type: this.pageQuery.type,
                modelId: Number(row.model_id),
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
      let req = this.pageQuery.type == 'task' ? 'assessmentTasksResetResult' : 'appraisalResetResult';
          return this.$MainApi[req]({
              data: {
                  record_id: row.record_id,
                  student_number: row.student_number,
                  student_name: row.student_name,
                  activity_name: this.activityInfo.activityName
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
      let req = this.pageQuery.type == 'task' ? 'assessmentTasksResultExport' : 'appraisalResultExport'
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
.activity-name{
  padding-left:10px; 
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #7F7F7F;
  line-height: 22px;
  margin-bottom: 15px;
}
.new-class{
  display: inline-block;
  margin: 5px auto;
  color:#74C444;
  background-color:#E5F9E5;
  border-radius:4px;
  padding: 3px 10px;
}
</style>