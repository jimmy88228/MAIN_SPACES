<template>
    <hold-layout class="resource-page-layout" :isFull="true">
      <searchForm :searchForm="searchForm" @search="loadData()" @add="addPsychiatrist()"></searchForm>
      <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading" @on-selection-change="selectDataEvent">
        <template slot="psychiatrist" slot-scope="{ row }">
          <div class="detail-item">
            <div class="detail-img">
              <img :src="row.profilePicture" />
            </div>
            <div class="detail-info text-flow">
              <div>
                <p class="detail-name text-flow">{{row.name}}</p>
              </div>
            </div>
          </div>
        </template>
        <template slot="state" slot-scope="{ row }"> 
          <div>
            <i-switch :value="row.supplierId" :true-value="1" :false-value="0" @on-change="switchChange"></i-switch>
          </div>
        </template>
        <template slot="fields" slot-scope="{ row }">
          <div>
            <span v-for="(item, index) in row.fields" :key="index">{{index!=0?',':''}}{{item}}</span>
          </div>
        </template>
        <template slot="handle" slot-scope="{ row }">
          <div class="operate-area">
            <a class="operate" v-hasAction="true" @click="editPsychiatrist(row)">详情</a>
            <!-- <a class="operate" v-hasAction="true">删除</a> -->
          </div>
        </template>
      </Table>
      <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form";
import mixins from "./mixins";

export default {
  name: "resourceManageIndex",
  mixins: [ListMixin, mixins],
  components: { searchForm },
  data() {
    return {
      searchForm: { searchq: "",source_id:0 },
      selectData: []
    };
  },
  computed: {
    ids() {
      let selectData = this.selectData || [];
      let ids = [];
      if (selectData instanceof Array) {
        for (let i = 0; i < selectData.length; i++) {
          if (selectData[i].consultantId) {
            ids.push(selectData[i].consultantId);
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
        .psychologicalList({
          data: {
            ...this.searchForm,
            ...extraData,
          },
          other:{
            isErrorMsg: true
          }
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || {};
            this.data = {
              total: data.totalCount,
              list: data.list,
            };
          }
        });
    },
    addPsychiatrist(){
      this.$router.push({
        name: "psychiatristAdd",
      });
    },
    editPsychiatrist(row) {
      this.$router.push({
        name: "psychiatristDetail",
        query: {
          id: row.consultantId
        }
      });
    },
    switchChange(e){
      console.log('switchChange',e);
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
      width: 44px;
      height: 44px;
      box-sizing: unset;
      background: #efefef;
      border-radius: 2px;
      overflow: hidden;
      margin-right: 14px;
      position:relative;
      img {
        position: absolute;
        top: 50%;
        left:50%;
        width: 100%;
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