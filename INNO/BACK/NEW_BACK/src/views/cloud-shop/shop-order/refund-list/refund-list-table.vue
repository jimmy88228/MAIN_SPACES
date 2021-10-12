<template>
	<div class="refund-list-table">
    <Table ref="myTable" :columns="tableColums" :data="tableData" :span-method="handleSpan" disabled-hover>
      <template slot-scope="{ row }" slot="orderInfo">
        <div class="header_inline">
          <span class="header_item">退款单号:{{row.refund_sn}}</span>
          <span class="header_item">关联订单号:<a @click="handleGoOrderInfo(row.order_id)">{{row.order_sn}}</a></span>
        </div>
      </template>
    </Table>
    <div class="list_page" v-show="pageTotal">
      <Page
        :total="pageTotal"
        :page-size="pageSize"
        :current="currentPage"
        :page-size-opts="pageSizeOpts"
        @on-change="changePage"
        @on-page-size-change="ps => handlePageSize(ps)"
        show-total
        show-elevator
        show-sizer></Page>
    </div>
	</div>
</template>

<script>
import PageHelper from '@/libs/page-helper.js';
import Mixin from './mixin.js';

export default {
  mixins: [PageHelper, Mixin],
  data () {
    return {
      returnOrderList: {
        'all': 0,
        'wait-confirm': 1,
        'wait-sum': 2,
        'sumed': 3,
      },
      condition: {
        search_type: 'refund_sn',
        keywords: '',
        startTime: '',
        endTime: '',
        add_time: [],
        store_id: 0,
        confirm_status: 0
      }
    }
  },
  methods: {
   handleSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return [1, 6];
      } else if (columnIndex > 1) {
        return [0, 0];
      }
    },
    onLoadData (page, data) {
      this.$store.commit('setLoading', true);
      let params = Object.assign({}, data, this.condition, {
        confirm_status: this.returnOrderList[this.$route.query.act]
      });
      return this.$ajax.post(this.$api.ShopOrderRefundInfoList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.statusList = res.data && res.data.status;
        }
        this.$store.commit('setLoading', false);
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    handleExport () {
      this.$Modal.confirm({
        title: '操作提示',
        content: `确定进行导出操作`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.$store.commit('setLoading', true);
          return this.$ajax.post(this.$api.ShopOrderRefundExport, this.condition)
          .then(response => {
            const res = response.data;
            if (res.code) {
              this.$refs.myTable.exportCsv({
                filename: '退款单数据',
                columns: res.data.columns,
                data: res.data.items
              });
            }
            this.$store.commit('setLoading', false);
          });
        }
      });
    },
    handleGoOrderInfo (id) {
      let routeUrl = this.$router.resolve({
        name: 'shop-order-info',
        params: {
          sn: id
        }
      });
      window.open(routeUrl.href, '_blank');
    }
  }
}
</script>
<style lang="less">
.refund-list-table{
  .header_inline{
    white-space: pre-wrap;
    .header_item{
      margin-right: 30px;
    }
  }
}
</style>
