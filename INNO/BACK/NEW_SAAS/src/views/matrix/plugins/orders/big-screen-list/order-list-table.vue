<template>
	<div class="big-order-list-table">
    <Table :columns="tableColums" :data="tableData" :span-method="handleSpan" disabled-hover>
      <template slot-scope="{ row }" slot="orderInfo">
        <div class="header_padding" v-if="status != 1000">
          <div>
            <span class="header_item">订单号:{{row.order_sn}}</span>
            <span class="header_item">所属店铺:{{row.store_name}}</span>
            <span class="header_item">所属店员:{{row.staff_name}}</span>
          </div>
          <Divider class="common_divider" />
          <div>
            <span class="header_item">所属分销员:{{row.orderDistributor}}</span>
            <span class="header_item">订单来源:{{row.platform_src_str}}</span>
            <span class="header_item">配送方式:{{row.shipping_name_format}}</span>
          </div>
        </div>
        <div class="header_inline" v-else>
          <span class="header_item">订单号:{{row.order_sn}}</span>
          <span class="header_item">所属店铺:{{row.store_name}}</span>
          <span class="header_item">所属店员:{{row.staff_name}}</span>
          <span class="header_item">订单来源:{{row.from_name_format}}</span>
          <span class="header_item">配送方式:{{row.shipping_name_format}}</span>
        </div>
      </template>
      <template slot-scope="{ row }" slot="money">
        <!-- 拆单并且是非ERP -->
        <div class="amount" v-if="row.order_status == 10 && status != 1000">
          <p>总额:￥{{row.goods_amount}}</p>
          <p>实付:￥{{row.money_paid}}</p>
          <p>{{row.pay_type}}</p>
        </div>
      </template>
      <template slot-scope="{ row }" slot="createTime">
        <div class="modify_time" v-if="row.order_status == 10 && status != 1000">
          <p>{{row.create_time_format | initDate}}</p>
          <p>{{row.create_time_format | initTime}}</p>
        </div>
      </template>
      <template slot-scope="{ row }" slot="orderStatus">
        <p v-if="row.order_status == 10 && status != 1000">{{row.order_status_name}}</p>
      </template>
      <template slot-scope="{ row }" slot="handle">
        <div class="lookup_order" v-if="row.order_status == 10 && status != 1000">
          <a v-if="row.handle.edit" @click="view(row.order_id)">查看</a>
        </div>
      </template>
    </Table>
    <div class="page" v-show="pageTotal">
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
import Mixin from './mixin.js';
import Conf from '@/config/index.js';

export default {
  name: 'orderListTable',
  mixins: [Mixin],
  data () {
    return {
      tableData: [],
      pageTotal: 0,
      currentPage: Conf.PAGE_START,
      pageSize: Conf.PAGE_SIZE_DEF,
      pageSizeOpts: Conf.PAGE_SIZE_OPTS,
      status: '0',
      // 允许切换分页标志位
      changeSizeSign: false,
      searchForm: {}
   	}
  },
  methods: {
    initData (status, searchForm = {}) {
      this.currentPage = 1;
      this.status = status;
      this.searchForm = searchForm;
      this.loadData();
    },
    view(orderId) {
      this.$router.push({
        name: 'order-info',
        params: {
          sn: orderId
        }
      });
    },
    loadData() {
      this.$store.commit('setLoading', true);
      return this.$ajax.post(this.$api.orderList, {
        page: this.currentPage,
        pageSize: this.pageSize,
        orderStatus: this.status,
        ...this.searchForm,
        platform_src: 'MWIN'
       })
    		.then(response => {
    			const res = response.data;
    			if (res.code) {
            this.data = res.data;
            this.tableData = res.data && res.data.items;
            // isVisible与nodeValue,这两个值会用于备注的显示及内容
            this.tableData.forEach(item => {
              if (item.order_status == '10') {
                // 当前是拆单的情况
                item.order_message.forEach(order => {
                  order.isVisible = false;
                  order.nodeValue = '';
                });
              }
            });
            this.pageTotal = res.data && res.data.total;
          }
          this.$store.commit('setLoading', false);
        });
    },
    changePage (page) {
      if (this.changeSizeSign) {
        this.changeSizeSign = false;
        return false;
      }
      this.currentPage = page;
      this.loadData();
    },
    handlePageSize (pageSize) {
      // 阻止页码的切换操作
      this.currentPage !== 1 && (this.changeSizeSign = true);
      this.currentPage = 1;
      this.pageSize = pageSize;
      this.loadData(1);
    },
    handleSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 4) {
        return [1, 2];
      } else if (columnIndex === 2 || columnIndex === 5) {
        return [0, 0];
      }
    },
    clearTableData() {
      this.tableData = [];
    }
  }
}
</script>

<style lang="less">
.big-order-list-table{
  .ivu-table-tbody{
    font-size: 13px;
  }
  .page{
    float: right;
    margin-top: 10px;
  }
  .header_padding{
    padding: 4px 0;
    white-space: pre-wrap;
  }
  .header_inline{
    white-space: pre-wrap;
    .header_item{
      margin-right: 10px;
    }
  }
  .common_divider{
    margin: 6px 0;
  }
}
</style>
