<template>
  <div class="bargin-report-list">
    <Card>
      <Row>
        <Col span="20">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="4" class="btn-group">
          <Button type="primary" icon="md-add" @click="handleExport">导出</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="cut_create_time">
          <p>{{row.cut_create_time | initDate}}</p>
          <p>{{row.cut_create_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="success_time">
          <p>{{row.success_time | initDate}}</p>
          <p>{{row.success_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="help_cut_create_time">
          <p>{{row.help_cut_create_time | initDate}}</p>
          <p>{{row.help_cut_create_time | initTime}}</p>
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
      <notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
    </div>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import notice from '@/views/my-components/mq-notice/mq-notice';

export default {
  components: {
    SearchForm,
    notice
  },
  data () {
    return {
      canCreate: {},
      condition: {
        status: -1,
        start_time: '',
        end_time: ''
      },
      jobIdCol: []
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.bargainReportList, params)
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
    handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					let formSearch = this.condition;
					return this.$ajax.post(this.$api.bargainReportExport,this.condition).then((response) => {
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
			// 异步下载结束后刷新
			this.loadData();
		},
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.bargin-report-list{
  .btn-group{
    text-align: right;
  }
}
</style>
