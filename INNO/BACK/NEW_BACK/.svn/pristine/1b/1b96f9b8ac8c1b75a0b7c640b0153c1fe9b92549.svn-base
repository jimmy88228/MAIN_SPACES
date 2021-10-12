<template>
    <div class="brand-list">
      <Card>
        <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="primary" @click="handleExport">导出</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="createTime">
          <p>{{row.createTime | initDate}}</p>
          <p>{{row.createTime | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span @click="handleView(row)"><a>查看</a></span>
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
      <notice :ref="'notice' + item" v-for="item in jobIdCol" :key="item"></notice>
    </div>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import PageTopBase from '@/views/my-components/page-top-base/index';
import notice from '@/views/my-components/mq-notice/mq-notice';

export default {
  components: {
    SearchForm,
    PageTopBase,
    notice
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: '',
        start_time: '',
        end_time: '',
        store_id: 0
      },
      jobIdCol: []
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.rewardReportDevelopList, params)
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
    handleView (row) {
      this.$router.push({
        name: 'distributor-report',
        query: {
          searchq: row.developCardNum
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
					return this.$ajax.post(this.$api.rewardReportDevelopExport, {
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
  }
}
</script>

<style lang="less" scoped>
.brand-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
