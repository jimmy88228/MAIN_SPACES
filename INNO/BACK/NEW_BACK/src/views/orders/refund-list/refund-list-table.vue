<template>
	<div class="refund-list-table">
    <Table ref="myTable" :height="tableHeight" :columns="tableColums" :data="tableData" :span-method="handleSpan" disabled-hover @on-select-all="isCheckAll = true" @on-select-all-cancel="isCheckAll = false">
      <template slot-scope="{ row }" slot="orderInfo">
        <div class="header_inline">
          <span class="header_item">退款单号:{{row.refund_sn}}</span>
          <span class="header_item">关联订单号:<a @click="handleGoOrderInfo(row.order_id)">{{row.order_sn}}</a></span>
        </div>
      </template>
    </Table>
    <div class="list_page flex f-just-between" v-show="pageTotal">
			<div>
				<Checkbox v-model="isCheckAll" @on-change="checkAll">当页全选</Checkbox>
				<Button type="primary">批量退款</Button>
			</div>
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
      },
			isCheckAll: false
    }
  },
  methods: {
   handleSpan({ row, column, rowIndex, columnIndex }) {
		 
      if (columnIndex === 2) {
        return [1, 7];
      } else if (columnIndex > 1) {
        return [0, 0];
      }
    },
    onLoadData (page, data) {
      this.$store.commit('setLoading', true);
      let params = Object.assign({}, data, this.condition, {
        confirm_status: this.returnOrderList[this.$route.query.act]
      });
      return this.$ajax.post(this.$api.orderRefundInfoList, params)
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
				  // ajax 请求获取数据
        let params = {
          ...this.condition,
          confirm_status: this.returnOrderList[this.$route.query.act],
        };
        return this.$ajax.post(this.$api.orderRefundExport,params)
            .then((response) => {
              this.tableLoading = false;
              var res = response.data;
              if (res.code) {
                var jobId = res.data;
                // 打开异步提示组件
               this.$emit('showstartMq',jobId);
              }
            });
        }
      });
    },
    handleGoOrderInfo (id) {
      let routeUrl = this.$router.resolve({
        name: 'order-info',
        params: {
          sn: id
        }
      });
      window.open(routeUrl.href, '_blank');
    },
		checkAll(val){
			this.$refs.myTable.selectAll(val);
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
