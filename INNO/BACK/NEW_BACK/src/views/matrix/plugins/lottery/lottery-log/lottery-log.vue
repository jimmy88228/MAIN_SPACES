<template>
  <div class="lottery-log-list">
    <Card>
      <Row>
        <Col span="20">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="4">
          <div class="btn-group">
            <Button type="primary" v-if="canCreate.export" @click="handleExport">导出汇总</Button>
          </div>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.viewdetails" @click="goDetails(row)"><a>查看明细</a></span>
          <Divider type="vertical" v-show="row.handle.viewexport"/>
          <span v-show="row.handle.viewexport" @click="handleDetailsExport(row)"><a>导出明细</a></span>
          <Divider type="vertical" v-show="row.handle.distributionexport"/>
          <span v-show="row.handle.distributionexport" @click="openModal(row)"><a>导出分销报表</a></span>
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
    <!--异步处理导出excel组件-->
    <div class="col">
      <notice :ref="'notice' + item" @finish="loadData" v-for="item in jobIdCol" :key="item"></notice>
    </div>
    <LotteryForm ref="lotteryForm"/>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import LotteryForm from './lottery-form';

export default {
  components: {
    SearchForm,
    notice,
    LotteryForm
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: '',
        type: "0",
        // start_time: '',
        // end_time: ''
      },
      jobIdCol: []
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.MatrixLotteryLogList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    openModal (row) {
      this.$refs.lotteryForm.setData(row).show();
    },
    goDetails (row) {
      this.$router.push({
        name: 'matrix-lottery-log-details',
        params: {
          id: row.activity_id
        }
      })
    },
    handleExport () {
      this.jobIdCol=[];
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return this.$ajax.post(this.$api.MatrixLotteryLogExport,{
            ...this.condition,
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
    handleDetailsExport (row) {
      this.jobIdCol=[];
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return this.$ajax.post(this.$api.MatrixLotteryLogViewDetailsExport,{
            activity_id:row.activity_id
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
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.lottery-log-list{
  .btn-group{
    text-align: right;
  }
}
</style>
