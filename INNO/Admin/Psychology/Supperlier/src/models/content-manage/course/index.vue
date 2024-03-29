<template>
  <leftRightLayout class="page-lrlayout" :isShowTitle="true">
    <div slot="header-r">
      <rewrite-search :isOpacotyBg="true" v-model="searchForm.searchq" @search="loadData()" placeholder="请输入课程名称搜索"></rewrite-search>
    </div>
    <groupView type="course" slot="left" @change="changeGroupPoint"></groupView>
    <hold-layout slot="right" class="course-page-layout">
      <Table ref="myTable" :columns="columns" :data="list" border :loading="tableLoading" @on-selection-change="selectDataEvent">
        <template slot="detail" slot-scope="{ row }">
          <div class="detail-item">
            <div class="detail-img" v-bgStyle :img="row.cover_pic">
              <!-- <img :src="row.cover_pic" /> -->
            </div>
            <div class="detail-info text-flow">
              <div>
                <p class="detail-name w-normal">{{row.course_name}}</p>
                <p class="detail-desc text-flow">课时{{row.content_count}}</p>
              </div>
              <div class="detail-time text-flow">更新时间：{{row.update_time}}</div>
            </div>
          </div>
        </template>
        <template slot="handle" slot-scope="{ row }">
          <div class="operate-area">
            <a class="operate-btn" v-hasAction="true" @click="changeGroup(row)">换组</a>
            <a class="operate-btn" v-hasAction="true" @click="goEdit(row)">编辑</a>
            <!-- <a class="operate" v-hasAction="true">删除</a> -->
          </div>
        </template>

      </Table>
      <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
      <changeGroup ref="changeGroupRef" tip="课程" 
      groupType="course-group"
      @success="changeGroupCallback"></changeGroup>
    </hold-layout>
  </leftRightLayout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
import leftRightLayout from "@/components/view-components/layout/left-right-layout.vue"
import groupView from "@/models/components/group-view";
import changeGroup from "@/models/components/change-group/index.vue";
import StringUtil from "@/helper/utils/string-util.js";
export default {
  name: "courseManageIndex",
  mixins: [ListMixin, mixins],
  components: { leftRightLayout, groupView, changeGroup },
  data() {
    return {
      searchForm: {
        group_id: 0,
        searchq: ""
      },
      selectData: [],
    };
  },
  computed: {
    ids() {
      let selectData = this.selectData || [];
      let ids = [];
      if (selectData instanceof Array) {
        for (let i = 0; i < selectData.length; i++) {
          if (selectData[i].id) {
            ids.push(selectData[i].id);
          }
        }
      }
      return ids;
    },
  },
  methods: {
    selectDataEvent(selectData) {
      this.selectData = selectData || [];
    },
    changeGroupPoint(group_id){
      this.searchForm.group_id = group_id || 0;
      this.loadData();
    },
    onLoadData(page, extraData) {
      return this.$MainApi
        .courseManagementList({
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
            this.selectData = [];
            this.data = {
              total: data.total,
              list: items,
            };
          }
        });
    },
    goAdd() {
      this.$router.push({
        name: "courseManageAdd",
      });
    },
    goEdit(row) {
      this.$router.push({
        name: "courseManageDetail",
        query: {
          id: row.id
        }
      });
    },
    goDistribute(){
      this.$UIModule({
        mode: "material-modal",
        props: {
          fromType: 'distribute',
          isShowTabs: true,
          isShowClassify: true,
          type: 'course',
          isLimitTab: true,
          cusTabList:[{
            id:5,
            key:"course",
            tip: "课程",
            name:"课程内容",
          }]
        },
        success:(data, extraData)=>{
          console.log("选择", extraData);
          if(data.course && data.course.length > 0){
            this.setResource(data.course.map(item=>item.id), extraData.target_id)
            // this.setResource(StringUtil.getArrIdsStr(data.course), extraData.target_id)
          }
        }
      })
    },
    setResource(data, target_id){
      if(!target_id) return;
      return this.$MainApi.courseManagementAllocation({
          data: {
            target_id: target_id,
            add_ids: data,
            del_ids: []
          },
        }).then((res)=>{
          if(res.code){
            this.$Message.success(res.message || '分配成功');
            return Promise.resolve();
          }
          this.$Message.warning(res.message || '分配失败');
          return Promise.reject();
        })
    },
    changeGroup(row) {
      if (!row.id) {
        this.$Message.warning("无效ID");
        return Promise.reject();
      }
      this.$refs["changeGroupRef"] && this.$refs["changeGroupRef"].showModal({
        data: row
      });
    },
    batchChangeGroup() {
      if(this.ids.length == 0){
        this.$Message.warning("请选择换组课程！");
        return Promise.reject();
      }
      this.$refs["changeGroupRef"] && this.$refs["changeGroupRef"].showModal({
        data: this.ids
      });
    },
    changeGroupCallback(detail){
      console.log("detail", detail);
      let { group_id, data } = detail;
      let ids = [];
      if(data instanceof Array){
        ids = data;
      } else if(data.id){
        ids = [data.id]
      }
      this.changeGroupReq(group_id, ids);
    },
    changeGroupReq(group_id, ids) {
      return this.$MainApi
        .courseManagementUpdateGroup({
          data: {
            group_id: group_id,
            ids: ids,
          },
        })
        .then((res) => {
          if (res.code) {
            this.$Message.success(res.message || "操作成功");
            this.handleUpdate();
            return Promise.resolve();
          } else {
            this.$Message.warning(res.message || "操作失败");
            return Promise.reject();
          }
        });
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.page-lrlayout {
  .detail-item {
    display: flex;
    padding: 10px 0px;
    .detail-img {
      flex-shrink: 0;
      width: 180px;
      height: 135px;
      background: #efefef;
      border-radius: 2px;
      overflow: hidden;
      margin-right: 14px;
      position:relative;
      img {
        width: 100%;
        position:absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .detail-info {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      .detail-name {
        font-size: 17px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 24px;
        margin-bottom:10px;
      }
      .detail-desc {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #b2b2b2;
        line-height: 20px;

      }
      .detail-time {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #8e8e8e;
        line-height: 20px;
      }
    }
  }
}
</style>
<style lang="less">
@import "~@/assets/css/variables.less";
.course-page-layout{
  .ivu-table-header th{
    background-color: @title-bg-color;
  }
}
</style>