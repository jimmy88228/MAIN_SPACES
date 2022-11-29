<template>
    <hold-layout :isFull="true" class="resource-page-layout">
      <!-- <searchForm :searchForm="searchForm" @search="loadData()"></searchForm> -->
      <Table ref="myTable" class="grey-table full-table"  :columns="columns" :data="list" border :loading="tableLoading">
        <template slot="customer" slot-scope="{ row }">
          <div class="detail-item">
            <div class="detail-img">
              <img :src="row.customer_logo" />
            </div>
            <div class="detail-info text-flow">
              <div>
                <p class="detail-name text-flow">{{row.target_name}}</p>
                <p class="detail-desc text-flow" v-if="row.target_name != row.customer_name && row.customer_name" :title="row.customer_name">{{row.customer_name}}</p>
              </div>
            </div>
          </div>
        </template>
        <template slot="handle" slot-scope="{ row }">
          <div class="flex-c-c">
            <div class="operate-area">
              <a class="operate" v-hasAction="true" @click="checkResource(row)">资源管理</a>
              <!-- <a class="operate" v-hasAction="true">删除</a> -->
            </div>
            <div class="operate-area">
              <a class="operate" v-hasAction="true" @click="setConfig(row)">功能配置</a>
            </div>
            <div class="operate-area">
              <a class="operate" v-hasAction="true" @click="setBase(row)">基础设置</a>
            </div>
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
      searchForm: {
        //is_all
        searchq: "", 
        customer_ids: "",  //多主体下的组织
        customer_id: "" , //单主体下的所有组织 
        getMultimediaNumber: 1  //是否获取组织下的多媒体及心理咨询师 数量
      },
    };
  },
  methods: {
    onLoadData(page, extraData) {
      return this.$MainApi
        .getTargetList({
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
    checkResource(row) {
      this.$router.push({
        name: "resourceManageDetail",
        query: {
          id: row.target_id,
          name: row.target_name
        }
      });
    },
    setConfig(row){
      this.$router.push({
        name: "functionConfig",
        query: {
          customer_id: row.customer_id,
          customer_name: row.customer_name,
          target_id: row.target_id,
        }
      });
    },
    setBase(row){
      this.$router.push({
        name: "baseConfig",
        query: {
          customer_id: row.customer_id,  
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
.resource-page-layout {
  .detail-item {
    display: flex;
    align-items: center;
    padding: 10px 0px;
    .detail-img {
      flex-shrink: 0;
      // padding: 10px;
      width: 40px;
      height: 40px;
      box-sizing: unset;
      background: #efefef;
      border-radius: 2px;
      overflow: hidden;
      margin-right: 14px;
      position:relative;
      img {
        width: 100%;
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%, -50%);
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
      }
      .detail-desc {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #7F7F7F;
        line-height: 17px;
        margin-top: 6px;
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