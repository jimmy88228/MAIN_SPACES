<template>
  <div class="overview-detail-area">
    <div class="overview-detail" :class="{'data-cockipit-theme': isDataCockpit}">
      <div class="overview-operates text-r p-b-10" v-if="_structureType == 'edu_school' && !isDataCockpit">
        <Button @click="exportData" type="primary" >导出数据</Button>
      </div>
      <div class="overview-operates text-r p-b-10" v-if="_structureType == 'edu_school' && !isDataCockpit">
        <div class="flex-s-c">
          <Button @click="exportGroup" type="primary" class="m-r-20" v-if="activityInfo.handle && activityInfo.handle.report_export">生成团报</Button>
          <Button @click="exportData" type="primary" >导出数据</Button>
        </div>
      </div>
      <div class="activity-overview-top">
        <div class="activity-overview-info" v-if="!!activityInfo">
          <div class="activity-name">
            {{ (activityInfo.info && activityInfo.info.activity_name) || "————" }}
          </div> 
          <div class="model-name fs-14">
            <div class="f-shrink-0">使用量表：</div>
            <div class="model-name-list">
              <div class="model-name-item m-r-5" v-for="(item,index) in modelNameArr" :key="index">{{item.name}}</div>
            </div>
          </div>
          <div class="activity-time fs-14">
            <template v-if="activityInfo.info && (activityInfo.info.start_time || activityInfo.info.end_time)">
              {{
                (formatDate(activityInfo.info.start_time)) ||
                "XXXX-XX-XX"
              }}
              -
              {{
                (formatDate(activityInfo.info.end_time)) ||
                "XXXX-XX-XX"
              }}
            </template>
          </div>
        </div>
        <div class="count-item" @click="viewDetails({}, -1)">
          <div class="count-icon">
            <img src="@/assets/images/ought_member.png" class="" alt="" />
          </div>
          <div class="count-title">活动应参与总人数</div>
          <div class="count">{{ activityInfo.has_all_join_member || 0 }}</div>
          <div class="more flex-s-c" v-if="!isDataCockpit">查看&nbsp;<span class="arrow-radius" style="position:unset;"></span></div>
        </div>
        <div class="count-item" @click="viewDetails({}, 1)">
          <div class="count-icon">
            <img src="@/assets/images/join_member.png" class="" alt="" />
          </div>
          <div class="count-title">活动提交总人数</div>
          <div class="count">{{ activityInfo.join_member || 0 }}</div>
          <div class="more flex-s-c" v-if="!isDataCockpit">查看&nbsp;<span class="arrow-radius" style="position:unset;"></span></div>
        </div>
        <div class="count-item" @click="viewWarn">
          <div class="count-icon">
            <img src="@/assets/images/to_audit.png" class="" alt="" />
          </div>
          <div class="count-title">待审核预警人员</div>
          <div class="count">{{ activityInfo.to_audit || 0 }}</div>
          <div class="more flex-s-c" v-if="!isDataCockpit">查看&nbsp;<span class="arrow-radius" style="position:unset;"></span></div>
        </div>
        <Spin class="overview-spin" fix v-if="pageLoad"></Spin>
      </div>
      <div class="activity-overview-bottom">
        <div class="organizational-profile m-b-20 m-t-20 fs-16">组织概况</div>
        <div class="table-out-style">
          <Table
            ref="myTable"
            :columns="columns"
            :data="list"
            :loading="tableLoading"
            :height="list.length < 6 ? 300 : ''"
          >
            <template slot-scope="{ row, index }" slot="structure_name">
              <div class="operate-area">
                <p class="operate-line">
                  <Tooltip :content="row.structure_name + ((row.get_edu_class && row.get_edu_class.campus) ? '[' + row.get_edu_class.campus + ']' : '')"  placement="right-start">
                    {{ row.structure_name }} <span v-if="row.get_edu_class && row.get_edu_class.campus">[{{row.get_edu_class.campus}}]</span>
                  </Tooltip>
                </p>
              </div>
            </template>
            <template slot-scope="{ row, index }" slot="ought_member">
              <a @click="viewDetails(row, -1)">{{row.ought_member}}</a>
            </template>
            <template slot-scope="{ row, index }" slot="structure_record_count">
              <div class="operate-area inline-b" style="cursor:pointer;" @click="viewDetails(row, 1)">
                <p class="operate-line">
                  <Progress
                    style="width: 60px; margin-right: 11px"
                    :percent="
                      caculateProgress(
                        row.structure_record_count,
                        row.ought_member
                      )
                    "
                    status="active"
                    hide-info
                    :stroke-color="isDataCockpit ? ['#31A828', '#00CC28'] : ['#108ee9', '#56A3CB']"
                  /><a>{{ row.structure_record_count }}</a>
                </p>
              </div>
            </template>
            <template slot-scope="{ row, index }" slot="audit_member">
              <a @click="viewDetails(row, 0)">{{row.audit_member}}</a>
            </template>
            <template slot-scope="{ row, index }" slot="warn_record_count">
              <a @click="viewWarn(row)">{{row.warn_record_count}}</a>
            </template>
            <template slot-scope="{ row, index }" slot="handle">
              <div class="operate-area">
                <p class="operate-line">
                  <a
                    class="operate"
                    @click="viewDetails(row)"
                    >查看明细</a
                  >
                </p>
              </div>
            </template>
          </Table>
          <rewrite-page
            :transfer="false"
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
            placement="top"
          ></rewrite-page>
        </div>
      </div>
    </div>
    <exportSurvey ref="exportSurveyRef" :activityId="pageQuery.activityId" :schoolId="pageQuery.schoolId" :modelData="modelNameArr"></exportSurvey>
    <mpNotice :ref="'notice' + item" v-for="item in jobIdCol" :key="item"></mpNotice>
  </div>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
import exportSurvey from "../components/export-survey.vue";
import mpNotice from "@/components/main-components/mq-notice/mq-notice";
export default {
  name: "assessOverview",
  mixins: [mixins, ListMixin],
  components: { exportSurvey,mpNotice },
  props: {
    isModal: Boolean
  },
  data() {
    return {
      activityId: 0,
      activityInfo: {},
      pageLoad: true,
      isDataCockpit: false,
      selectData:[],
      jobIdCol: [],
      exportLoading:false,
    };
  },
  mounted() {
    // 弹框模式下不自动请求数据
    if(!this.isModal){
      this.init();
    }
  }, 
  computed: {
    modelNameArr() { 
      return this.activityInfo.info &&  this.activityInfo.info && this.activityInfo.info.model_data||[]
    },
    
  },
  methods: {
    init() {
      this.isDataCockpit = this.pageQuery.theme == 'dataCockpit';
      this.activityId = Number(this.pageQuery.activityId) || 0;
      if(this.isDataCockpit){
       this.columns = this.columns.filter((item)=>{
          return item.slot != 'handle'
        })
      }
      this.loadActivityInfo();
      this.loadData();
    },
    loadActivityInfo() {
      let type = this.pageQuery.type || "";
      let schoolId = this.pageQuery.schoolId || 0;
      let req = type == "task" ? 'assessmentTasksScheduleInfo' : 'appraisalScheduleInfo';
      let reqData = type == "task" ? {
        activityid: this.activityId,
        school_id: schoolId
      } : {
        activityid: this.activityId
      }
      this.pageLoad = true;
      return this.$MainApi[req]({
          data: reqData,
        })
        .then((res) => {
          if (res.code) {
            // 活动概况
            this.activityInfo = res.data || {};
          }
        })
        .finally(() => {
          this.pageLoad = false;
        });
    },
    onLoadData(page, extraData) {
      let type = this.pageQuery.type || "";
      let schoolId = this.pageQuery.schoolId || 0;
      let req = type == "task" ? 'assessmentTasksScheduleList' : 'appraisalScheduleList';
      let reqData = type == "task" ? {
        activityid: this.activityId,
        school_id: schoolId
      } : {
        activityid: this.activityId
      }
      return this.$MainApi[req]({
          data: {
            ...reqData,
            ...extraData
          },
        })
        .then((res) => {
          if (res.code) {
            // 组织列表
            let data = res.data || {};
            let items = data.items || [];
            this.data = {
              total: data.total,
              list: items,
            };
          }
        });
    },
    caculateProgress(count, allCount) {
      // console.log("allCount/count*100", (count / allCount) * 100);
      return allCount==0 ? 0 : (count / allCount) * 100;
    },
    formatDate(date) {
      return date.slice(0, 10);
    },
    viewDetails(row, state) {
      if(this.isDataCockpit) return;
      let activityInfo = this.activityInfo || {};
      let query = {
        activityId: this.activityId || "",
        activityName: activityInfo.info && activityInfo.info.activity_name || "",
        modelName: activityInfo.info && activityInfo.info.model_name,
        type: this.pageQuery.type
      };
      query.state = isNaN(parseInt(state)) ? -1 : state
      let type = this.pageQuery.type;
      if(type == 'task'){
        let get_edu_class = row.get_edu_class || {}
        query.schoolId = get_edu_class.school_id;
        query.campusId = get_edu_class.campus_id;
        query.gradeId = get_edu_class.class_id;
      } else {
        query.schoolId = row.id;
      }
      this.$router.push({
        name: this.pageQuery.type == 'task' ? "assessTaskResult" : "assessResult",
        query: query,
      });
    },
    viewWarn(row){
      if(this.isDataCockpit) return;
      let queryData = {};
      if(this._structureType == 'edu_school'){
        let get_edu_class = row.get_edu_class || {}
        queryData = {
          schoolId: get_edu_class.school_id,
          classId: get_edu_class.class_id,
          campusId:get_edu_class.campus_id,
        }
      } else {
        queryData = {
          schoolId: row.id,
        }
      }
      let query = {
        activityId: this.activityId || "",
        type: this.pageQuery.type,
        ...queryData
      };
      this.$router.push({
        name: this.pageQuery.type == 'task' ? "assessTasksEarlyWarnExamine" : "assessEarlyWarnExamine",
        query: {
          ...query,
          state: 0
        },
      });
    },
    exportData(){
      this.$refs["exportSurveyRef"] && this.$refs["exportSurveyRef"].showModal();
    },
    exportGroup(){ 
      this.$UIModule({
          mode:"list-modal",
          props:{
              multiple:true,
              title:"团报",
              type:"groupReport", 
              min:2,
              params:{
                activityid: this.activityId,
              }
          },
          options: this.selectData||[],
          success:(data)=>{
              console.log('selectData',data)
              this.selectData = data;
              if(this.selectData.length>0){
                this.scheduleReportExport().then(res=>{ 
                  let data = res.data;
                  if (data) {
                    this.jobIdCol.push(data);
                    this.$nextTick(() => {
                        this.$refs[`notice${data}`][0].showNotice(data);
                    });
                  }
                  return data || {};
                })
              }
          }
      });
    },
    scheduleReportExport(){
      if(this.exportLoading)return
      this.exportLoading = true;
      return this.$MainApi.scheduleReportExport({
        data: {
          activityid:this.activityId,
          grade_arr:this.selectData.map(item=>item.name)
        },
        other: {
          isErrorMsg: true
        }
      }).then(res=>{
        if(res.code){
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      }).finally(()=>{
        this.exportLoading = false;
      })
    }
  },
};
</script>

<style lang="less" scoped>
.overview-detail-area{
  display: flex;
}
.overview-detail{
  width: 0;
  flex: 1;
  position:relative;
  min-height: 100%;
  .overview-operates{
    position: absolute;
    top: 0;
    right: 0;
    transform: translateY(-100%);
  }
}
// 活动概况顶部
.activity-overview-top {
  display: flex;
  position: relative;
  width: 100%;
  & > div {
    border-radius: 6px;
    cursor: pointer;
    margin-right: 10px;
    transition: 0.2s all;
  }
  & > div:hover {
    box-shadow: 0px 0px 10px #e0e0e0;
  }
  & > div:last-child {
    margin-right: 0;
  }
  .activity-overview-info {
    width: 50%;
    background: linear-gradient(90deg, #066da9 0%, #1090d0 50%, #57b8c5 100%);
    padding: 31px 33px 27px;
    .activity-name {
      font-size: 24px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 33px;
      margin-bottom: 9px;
    }
    .model-name {
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #64bbea;
      line-height: 20px;
      margin-bottom: 70px;
    }
    .model-name-list{
      padding: 5px;
    }
    .model-name-item{
      display: inline-block;
      color: #fff;
      background: #134578;
      border-radius: 14px;
      padding: 0px 5px;
    }
    .activity-time {
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgb(179, 215, 234);
      line-height: 20px;
    }
  }
  .count-item {
    // height: 100%;
    flex: 1;
    box-sizing: border-box;
    padding: 25px 22px 35px;
    background: #ffffff;
    position: relative;
    .count-icon {
      width: 66px;
      height: 66px;
      border-radius: 50%;
      background: #d8d8d8;
      margin-bottom: 20px;
      flex-shrink: 0;
      position:relative;
      overflow: hidden;
      img{
        position:absolute;
        top: 0px;
        left:0px;
        width:100%;
        display: block;
      }
    }
    .count-title {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #b2b2b2;
      line-height: 20px;
      margin-bottom: 6px;
    }
    .count {
      font-size: 32px;
      font-family: Helvetica;
      color: #222222;
      line-height: 38px;
    }
    .more {
      position: absolute;
      right: 20px;
      bottom: 12px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #b2b2b2;
      line-height: 20px;
    }
  }
}
// 活动概况表格
.activity-overview-bottom {
  .table-out-style {
    border-radius: 6px;
    overflow: hidden;
  }
  .organizational-profile {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #515151;
    line-height: 22px;
  }
}
</style>


<!--以下为数据仓进入样式-->
<style lang="less" scoped>
.data-cockipit-theme{
  background-color: #06002A;
  .activity-overview-top{
    & > div{
      cursor: unset;
    }
    & > div:hover {
      box-shadow: unset;
    }
    .activity-overview-info {
      background: linear-gradient(121deg, #1090D0 0%, #22216C 100%);
      .model-name{
        margin-bottom: 30px;
      }
    }
    .count-item{
      background-color: #121242;
      .count-title{
        color:#605EB0;
      }
      .count{
        color:#fff;
      }
    }
  }
  .overview-spin{
    opacity: 0.9;
    background-color: #06002A;
  }
}
</style>
<style lang="less">
.data-cockipit-theme{
  .ivu-table {
    background-color: #121241;
    th{
      background-color:#121242;
      border-color:#06002B;
      color:#605EB0;
    }
    td{
      background-color:#121242;
      border: 0 none;
      color: #fff;
    }
    a{
      color: #fff;
    }
    
  }
  .ivu-table::before{
    content: "";
    display: none;
  }
  .ivu-table-wrapper{
    .ivu-spin{
      background-color: #06002A;
      opacity: 0.9;
    }
  }
  .rewrite-page{
    background-color:#121242;
    border-color:#06002B;
    color:#605EB0;
    .ivu-select-selection{
      background-color:#121242;
      color: #fff;
    }
    .rewrite-page-stay{
      background-color:#121242;
    }
    li{
      background-color:#121242;
    }
  }
  .ivu-progress-inner{
    background-color:#282460;
  }
  .ivu-select-dropdown{
    background-color:#121242;
    box-shadow: 0 1px 6px rgb(0 0 0 / 70%);
  }
  .ivu-page-options-elevator input{
    background-color:#121242;
    color: #fff;
  }
  .ivu-select-item:hover{
    color: #fff;
  }
}
</style>
