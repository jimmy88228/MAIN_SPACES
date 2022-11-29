<template>
    <hold-layout class="resource-page-layout" :isFull="true">
      <!-- <searchForm :searchForm="searchForm" @search="loadData()"></searchForm> -->
      <Table ref="myTable" class="grey-table full-table" :columns="columns" :data="list" border :loading="tableLoading" @on-selection-change="selectDataEvent">
        <template slot="customer" slot-scope="{ row }">
          <div class="detail-item">
            <div class="detail-img">
              <img src="" />
            </div>
            <div class="detail-info text-flow">
              <div>
                <p class="detail-name text-flow">海关心理健康平台</p>
                <p class="detail-desc text-flow" title="">海关心理健康平台/南沙海关/海关心理健康平台/南沙海关/海关心理健康平台/南沙海关/海关心理健康平台/南沙海关</p>
              </div>
              <!-- <div class="detail-time">上传时间：2022年06月18日 12:00</div> -->
            </div>
          </div>
        </template>
        <template slot="handle" slot-scope="{ row }">
          <div class="operate-area">
            <a class="operate" v-hasAction="true" @click="checkResource">资源管理</a>
            <!-- <a class="operate" v-hasAction="true">删除</a> -->
          </div>
        </template>
      </Table>
      <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
// import searchForm from "./search-form";
import mixins from "./mixins";

export default {
  name: "resourceManageIndex",
  mixins: [ListMixin, mixins],
  components: {  },
  data() {
    return {
      searchForm: {},
    };
  },
  methods: {
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
          console.log("列表", res);
          if (res.code) {
            let data = res.data || {};
            this.data = {
              total: data.total,
              list: data.items,
            };
          }
        });
    },
    checkResource(row) {
      this.$router.push({
        name: "resourceManageDetail",
      });
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.resource-page-layout {
  .detail-item {
    display: flex;
    align-items: center;
    padding: 10px 0px;
    .detail-img {
      flex-shrink: 0;
      padding: 10px;
      width: 40px;
      height: 40px;
      box-sizing: unset;
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
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #171717;
        line-height: 22px;
        margin-bottom: 6px;
      }
      .detail-desc {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #7F7F7F;
        line-height: 17px;
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
// @import "~@/assets/css/variables.less";
// .video-page-layout{
//   .ivu-table-header th{
//     background-color: @title-bg-color;
//   }
// }
</style>