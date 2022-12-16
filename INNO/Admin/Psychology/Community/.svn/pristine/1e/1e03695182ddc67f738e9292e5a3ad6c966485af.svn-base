<template>
  <hold-layout :isFull="true" class="subscribe-page-layout">
    <searchForm :searchForm="searchForm" @search="loadData()"></searchForm>
    <Table class="no-remove full-table" ref="myTable" :columns="columns" :data="list" border :loading="tableLoading" @on-selection-change="selectDataEvent">
      <template slot="request" slot-scope="{ row }">
        <div class="request">
          <p class="request-name m-b-5">{{row.petitioner || '--'}}</p>
          <p class="request-name">{{row.petitionerPhone}}</p>
        </div>
      </template>
      <template slot="refer" slot-scope="{ row }">
        <div class="refer">
          <p class="refer-name m-b-5">{{row.type == 'self' ? '本人' : (row.name || '--')}}</p>
          <p class="refer-name" v-if="row.mobilePhone && row.type != 'self'">{{row.mobilePhone}}</p>
        </div>
      </template>
      <template slot="pay_type" slot-scope="{ row }">
        {{ (row.payType == 'self' ? '自费' : '报销')}}
      </template>
      <template slot="consult_result_str" slot-scope="{ row }">
        {{row.consultResultStr}}
      </template>
      
      <template slot="handle" slot-scope="{ row }">
        <div class="operate-area">
          <a class="operate" v-hasAction="true" @click="checkSubscribe(row)">查看</a>
          <a class="operate" v-hasAction="[(row.handle && row.handle.dispose)]" @click="setHandle(row)">设为已处理</a>
        </div>
      </template>

    </Table>
    <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    <checkSubscribe ref="checkSubscribeRef" title="预约信息" @handle="setHandle"></checkSubscribe>
  </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form";
import mixins from "./mixins";
import checkSubscribe from "./check-subscribe/index.vue";
export default {
  name: "gaugeIndex",
  mixins: [ListMixin, mixins],
  components: { searchForm, checkSubscribe },
  data() {
    return {
      searchForm: {
        petitioner: "",
        customer_id: 0,
        consultant_id: 0,
        payType: "all",
        consultation_result: -1,
      },
      selectData: [],
    };
  },
  methods: {
    selectDataEvent(selectData) {
      this.selectData = selectData || [];
    },
    onLoadData(page, extraData) {
      return this.$MainApi
        .reservationList({
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
            let list = data.list || [];
            this.data = {
              total: data.totalCount,
              list: list,
            };
          }
        });
    },
    checkSubscribe(row) {
      this.$refs["checkSubscribeRef"] &&
        this.$refs["checkSubscribeRef"].showDrawer({
          appointment_id: row.appointmentId
        });
    },
    setHandle(row) {
      this.$refs["handleSubscribeRef"] && this.$refs["handleSubscribeRef"].showModal({ subscribeInfo: row })
    },
    handleSuccess(detail){
      this.$refs["checkSubscribeRef"] && this.$refs["checkSubscribeRef"].getView(detail.appointment_id);
      this.handleUpdate();
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.subscribe-page-layout {
  .consult {
    .consult-img {
      width: 44px;
      height: 44px;
      position: relative;
      margin-right: 10px;
      background-color: #f2f2f2;
      overflow: hidden;
      img {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .target {
      .target-name {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #171717;
        line-height: 22px;
        margin-bottom: 6px;
      }
      .target-customer {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #7f7f7f;
        line-height: 17px;
      }
    }
}
</style>