<template>
  <div class="integral-gift-list">
    <Card>
      <div class="search">
        <Row>
          <Col span="20">
            <SearchForm ref="search" type="gift" @on-search="searchPage"></SearchForm>
          </Col>
          <Col span="4" class="btn-group">
            <Button type="primary" @click="handleExport">导出</Button>
          </Col>
        </Row>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="create_time">
          <p>{{row.create_time | initDate}}</p>
          <p>{{row.create_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.view" @click="goDetails(row)"><a>查看详情</a></span>
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
import PageHelper from '@/libs/page-helper.js';
import Mixin from './mixin';
import SearchForm from '../search-form';
import notice from '@/views/my-components/mq-notice/mq-notice';

export default {
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: '',
        start_time: '',
        end_time: ''
      },
      jobIdCol: []
    }
  },
  mixins: [Mixin, PageHelper],
  components: {
    SearchForm,
    notice
  },
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.exchangeLogGoodsList, params)
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
    goDetails (row) {
      this.$router.push({
        name: 'order-info',
        params: {
          sn: row.order_id
        }
      })
    },
    handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return this.$ajax.post(this.$api.exchangeLogGoodsExport, this.condition).then((response) => {
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
		}
  }
}
</script>

<style lang="less" scoped>
.integral-gift-list{
  .search{
    margin-bottom: 24px;
  }
  .coupon-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
