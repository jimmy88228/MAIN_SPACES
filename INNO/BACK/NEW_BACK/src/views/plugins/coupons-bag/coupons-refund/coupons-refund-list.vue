<template>
  <div class="weixin-group-list">
    <Card>
      <Row>
        <Col span="16">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="8" class="btn-group">
          <div class="btn_group">
            <Button type="primary" @click="handleExport">导出</Button>
          </div>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="payTime">
          <p>{{row.payTime | initDate}}</p>
          <p>{{row.payTime | initTime}}</p>
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
      <!--异步处理导出excel组件-->
      <div class="col">
        <notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
      </div>
    </Card>
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
      condition: {
        searchq: '',
        start_time: '',
        end_time: ''
      },
      jobIdCol:[]
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.couponsBagRefundList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
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
					return this.$ajax.post(this.$api.couponsBagRefundExport, this.condition).then((response) => {
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
.weixin-group-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn_group{
    text-align: right;
    margin-bottom: 24px;
  }
}
</style>
