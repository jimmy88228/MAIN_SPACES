<template>
  <leftRightLayout class="page-lrlayout" :isShowTitle="true">
    <div slot="header-r">
      <rewrite-search :isOpacotyBg="true" v-model="searchForm.searchq" @search="loadData" placeholder="请输入音频名称"></rewrite-search>
    </div>
    <groupView slot="left"></groupView>
    <hold-layout slot="right" class="audio-page-layout">
      <!-- <searchForm :searchForm="searchForm" @search="loadData()"></searchForm> -->
      <Table ref="myTable" :columns="columns" :data="list" border :loading="tableLoading" @on-selection-change="selectDataEvent">
        <template slot="detail" slot-scope="{ row }">
          <div class="detail-item">
            <div class="detail-img">
              <img src="" />
            </div>
            <div class="detail-info text-flow">
              <div>
                <p class="detail-name text-flow">音频名称音频名称音频名称音频名称</p>
                <p class="detail-desc">20:12</p>
              </div>
              <div class="detail-time">上传时间：2022年06月18日 12:00</div>
            </div>
          </div>
        </template>
        <template slot="handle" slot-scope="{ row }">
          <div class="operate-area">
            <a class="operate-btn" v-hasAction="true" @click="changeGroup">换组</a>
            <a class="operate-btn" v-hasAction="true" @click="goEdit(row)">编辑</a>

            <!-- <a class="operate" v-hasAction="true">删除</a> -->
          </div>
        </template>

      </Table>
      <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
      <changeGroup ref="changeGroupRef"></changeGroup>
    </hold-layout>
  </leftRightLayout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form";
import mixins from "./mixins";
// import lrLayout from "@/models/components/layout/lr-layout/lr-layout";
import leftRightLayout from "@/components/view-components/layout/left-right-layout.vue"
import groupView from "@/models/platform/components/group-view";
import changeGroup from "../../components/change-group/index.vue";

export default {
  name: "gaugeIndex",
  mixins: [ListMixin, mixins],
  components: { leftRightLayout, groupView, searchForm, changeGroup },
  data() {
    return {
      searchForm: {
        searchq: "",
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
    onLoadData(page, extraData) {
      return this.$MainApi
        .inventoryList({
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
            this.data = {
              total: data.total,
              list: data.items,
            };
          }
        });
    },
    changeGroupEvent() {
      this.$refs["changeGroupRef"] && this.$refs["changeGroupRef"].showModal();
    },
    goAdd() {
      this.$router.push({
        name: "audioManageAdd",
      });
    },
    goEdit(row) {
      this.$router.push({
        name: "audioManageDetail",
      });
    },
    changeGroup(id) {
      if (!id) {
        this.$Message.warning("无效ID");
        return Promise.reject();
      }
      this.$refs["changeGroupRef"] && this.$refs["changeGroupRef"].showModal();
    },
    batchChangeGroup() {
      if(this.ids.length == 0){
        this.$Message.warning("请选择换组视频！");
        return Promise.reject();
      }
      this.$refs["changeGroupRef"] && this.$refs["changeGroupRef"].showModal();
    },
    changeGroupReq(ids) {
      if (!ids[0] || ids.length == 0) {
        this.$Message.warning("请选择删除项！");
        return Promise.reject();
      }
      return this.$MainApi
        .studentBatchRemove({
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
      width: 80px;
      height: 80px;
      background: #efefef;
      border-radius: 2px;
      overflow: hidden;
      margin-right: 14px;
      img {
        width: 100%;
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
.audio-page-layout{
  .ivu-table-header th{
    background-color: @title-bg-color;
  }
}
</style>