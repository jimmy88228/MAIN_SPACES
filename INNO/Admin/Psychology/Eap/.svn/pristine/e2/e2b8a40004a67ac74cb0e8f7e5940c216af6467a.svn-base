<template>
  <div>
    <div class="overview-detail">
      <div class="overview-operates text-r p-b-10" >
        <Button @click="exportData" type="primary" >导出数据</Button>
      </div>
      <div class="activity-overview-top">
        <div class="activity-overview-info" v-if="!!activityInfo">
          <div class="activity-name">
            {{ (activityInfo.info && activityInfo.info.activity_name) || "————" }}
          </div>
          <div class="model-name fs-14 flex">
            <div class="f-shrink-0">使用量表：</div>
            <div class="model-name-list">
              <div v-for="(item,index) in modelNameArr" :key="index">{{item.name}}</div>
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
          <div class="more flex-s-c">查看&nbsp;<span class="arrow-radius" style="position:unset;"></span></div>
        </div>
        <div class="count-item" @click="viewDetails({}, 1)">
          <div class="count-icon">
            <img src="@/assets/images/join_member.png" class="" alt="" />
          </div>
          <div class="count-title">活动总提交人数</div>
          <div class="count">{{ activityInfo.join_member || 0 }}</div>
          <div class="more flex-s-c">查看&nbsp;<span class="arrow-radius" style="position:unset;"></span></div>
        </div>
        <div class="count-item" @click="viewWarn">
          <div class="count-icon">
            <img src="@/assets/images/to_audit.png" class="" alt="" />
          </div>
          <div class="count-title">待审核预警人员</div>
          <div class="count">{{ activityInfo.to_audit || 0 }}</div>
          <div class="more flex-s-c">查看&nbsp;<span class="arrow-radius" style="position:unset;"></span></div>
        </div>
        <Spin fix v-if="pageLoad"></Spin>
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
                  <Tooltip :content="row.prent_structure_name"  placement="right-start">
                    {{ row.structure_name }}
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
                    :stroke-color="['#108ee9', '#56A3CB']"
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
                    @click="viewDetails(row, -1)"
                    v-hasAction="'structure_structure_view'"
                    >查看明细</a
                  >
                </p>
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
        </div>
      </div>
    </div>
    <exportSurvey ref="exportSurveyRef" :activityId="pageQuery.activityId"  :modelData="modelNameArr"></exportSurvey>
  </div>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
import exportSurvey from "../components/export-survey.vue";
export default {
  name: "assessOverview",
  mixins: [mixins, ListMixin],
  components: { exportSurvey },
  data() {
    return {
      joinMemberIcon: require("@/assets/images/join_member.png"),
      toAuditIcon: require("@/assets/images/to_audit.png"),
      activityId: 0,
      activityInfo: {},
      pageLoad: true,
    };
  },
  computed: {
    modelNameArr() { 
      return this.activityInfo.info &&  this.activityInfo.info && this.activityInfo.info.model_data||[]
    }
  },
  mounted() {
    this.activityId = Number(this.pageQuery.activityId) || 0;
    this.init();
  },
  methods: {
    init() {
      this.loadActivityInfo();
      this.loadData();
    },
    loadActivityInfo() {
      return this.$MainApi
        .appraisalScheduleInfo({
          data: {
            activityid: this.activityId,
          },
          other: {
            isErrorMsg: true
          }
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
      return this.$MainApi
        .appraisalScheduleList({
          data: {
            activityid: this.activityId,
            ...extraData,
          },
          other: {
            isErrorMsg: true
          }
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
      let activityInfo = this.activityInfo || {};
      let query = {
        activityId: this.activityId || "",
        structureId: row.structure_id || "",
        structureName: row.structure_name || "",
        activityName: activityInfo.info && activityInfo.info.activity_name || "",
        modelName: activityInfo.info && activityInfo.info.model_name || "",
        is_view: row.is_view,
        prentStructureIds: row.prent_structure_ids || [],
      }
      query.state = isNaN(parseInt(state)) ? -1 : state
      this.$router.push({
        name: "assessResult",
        query: query
      });
    },
    viewWarn(row){
      let activityInfo = this.activityInfo || {};
      let query = {
        activityId: this.activityId || "",
        structureId: row.structure_id || "",
        structureName: row.structure_name || "",
        activityName: activityInfo.info && activityInfo.info.activity_name || "",
        prentStructureIds: row.prent_structure_ids || [],
        type: this.pageQuery.type,
      };
      this.$router.push({
        name: "assessEarlyWarnExamine",
        query: {
          ...query,
          state: 0
        },
      });
    },
    exportData(){
      this.$refs["exportSurveyRef"] && this.$refs["exportSurveyRef"].showModal();
    }
  },
};
</script>

<style lang="less" scoped>
.overview-detail{
  position:relative;
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