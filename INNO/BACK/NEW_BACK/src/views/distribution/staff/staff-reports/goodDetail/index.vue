<template>
    <div class="staff-goods-detail">
      <Card>
        <div>
          <p>销售额：{{amount.total_order_amount}}</p>
          <p>提成金额：{{amount.total_comm_amount}}</p>
          <p>结算中金额：{{amount.total_frozen_amount}}</p>
        </div>
        <Row>
        <Col span="20">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="4" class="btn-group">
          <Button type="primary">导出</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="comm_date">
          <p>{{row.comm_date | initDate}}</p>
          <p>{{row.comm_date | initTime}}</p>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
          <span @click="editBrand(index, row)"><a>查看</a></span>
        </template>
      </Table>
      <div v-show="pageTotal" class="list_page">
        <Page
          :total="pageTotal"
          :page-size="pageSize"
          :current="currentPage"
          :page-size-opts="pageSizeOpts"
          @on-change="e => changePage(e)"
          @on-page-size-change="ps => handlePageSize(ps)"
          show-elevator
          show-total
          show-sizer></Page>
      </div>
      </Card>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import PageTopBase from '@/views/my-components/page-top-base/index';

export default {
  components: {
    SearchForm,
    PageTopBase
  },
  data () {
    return {
      canCreate: {},
      condition: {
        start_time: '',  //开始时间
        end_time: '',   //结束时间
        searchq: '',  //模糊搜索
        status: '-1',   //订单状态 -1 全部 0 待支付 1 已完成 2  取消 3 退货中 4 结算中 5 已退货
        staffStatus: '-1',  //分销员状态 -1 全部 0 离职 1 在职 2 兼职
        dstbStaffType: '-1', //分销员来源 -1 全部 0 手动录入 1 用户申请
        searchqType: 'staff',  //搜索类型 staff员工信息 order 订单号
      },
      amount: {}
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.staffReportsGoodsDetails, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
          this.amount = res.data.total_list;
        }
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return this.$ajax.post(this.$api.staffReportsDetailsExport, {
            ...this.condition
          }).then((response) => {
							var res = response.data;
							if (res.code) {
								var jobId = res.data;
								// 打开异步提示组件
								this.jobIdCol.push(jobId);
								this.$nextTick(() => {
									this.$refs[`notice${jobId}`][0].showNotice(jobId);
								});
								this.$Message.success(res.message);
							} else {
								this.$Message.error(res.message);
							}
					});
				}
			});
    },
    handleFinish () {
      this.loadData();
    }
  }
}
</script>

<style lang="less" scoped>
.staff-goods-detail{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
