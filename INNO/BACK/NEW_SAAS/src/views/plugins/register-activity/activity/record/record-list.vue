<template>
  <PageTopBase>
    <div class="record-list">
      <div class="btn_group">
        <Button type="primary" @click="handleExport">导出</Button>
      </div>
      <Card>
        <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
          <template slot-scope="{ row }" slot="createTime">
            <p>{{row.created_at_format | initDate}}</p>
            <p>{{row.created_at_format | initTime}}</p>
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
  </PageTopBase>
</template>
<script>
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import PageTopBase from '@/views/my-components/page-top-base/index';
import notice from '@/views/my-components/mq-notice/mq-notice';

export default {
  props: ['id'],
  components: {
    PageTopBase,
    notice
  },
  data () {
    return {
      jobIdCol: []
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, {
        id: this.id
      });
      return this.$ajax.post(this.$api.registerActivityRecord, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
        }
      });
    },
    handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return this.$ajax.post(this.$api.registerActivityRecordExport, {
            id: this.id
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
			// 异步下载结束后刷新
			this.loadData();
		}
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.record-list{
  .btn_group{
    text-align: right;
    margin-bottom: 24px;
  }
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
