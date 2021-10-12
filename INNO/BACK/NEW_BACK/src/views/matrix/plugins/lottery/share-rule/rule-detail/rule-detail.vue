<template>
  <PageTopBase>
    <Card>
      <div class="flex f-align-center f-just-between m-bottom-10">
        <div class="flex f-align-center">
					<div class="space-nowrap">搜索类型&nbsp;&nbsp;</div>
					<Select v-model="condition.activityId" style="width:120px;">
						<Option :value="item.id" v-for="(item, index) in activityList" :key="index">{{item.name}}</Option>
					</Select>
					<div class="space-nowrap">&nbsp;&nbsp;搜索类型&nbsp;&nbsp;</div>
          <Input
					style="width:300px;"
					class="search_input"
					v-model="condition.searchq"
					placeholder="请输入规则名称搜索"
					clearable
					search
					enter-button
					@on-search="searchPage"
					@on-clear="searchPage"
					@keydown.native.enter.prevent>
						<Select v-model="condition.searchqType" slot="prepend">
							<Option :value="item.value" v-for="(item, index) in searchTypes" :key="index">{{item.name}}</Option>
						</Select>
					</Input>
        </div>
        <div>
          <div class="btn-group" style="margin-left:auto;">
            <Button type="primary" @click="handleExport">导出</Button>
          </div>
        </div>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="handle">
					<div class="v-lines">
						<a>编辑</a><span class="v-line">|</span>
						<a>删除</a><span class="v-line">|</span>
						<a>查看明细</a><span class="v-line">|</span>
					</div>
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
  </PageTopBase>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import PageTopBase from '@/views/my-components/page-top-base/index';
export default {
  components: {
    SearchForm,
    notice,
		PageTopBase
  },
  data () {
    return {
      canCreate: {},
      condition: {
				searchqType: 1,
        searchq: '',
				activityId: 0,
				id: 0
      },
			searchTypes: [
				{
					name: "分享人手机",
					value: 1,
					key: "phone"
				},
				{
					name: "分享人卡号",
					value: 2,
					key: "card_num"
				}
			],
			activityList: [],
      jobIdCol: [],
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
		initParams(){
			let query = this.$route.query || {};
			this.condition.id = query.id || 0
			this.condition.activityId = query.activityId || 0;
		},
    onLoadData (page, data) {
      return this.$ajax.post(this.$api.MatrixSharingRulesDetails, {
				...this.condition,
				...data
			})
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
					this.activityList = (res.data && res.data.lottery_activity) || []
        }
      });
    },
    searchPage () {
      this.loadData();
    },
    handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return this.$ajax.post(this.$api.MatrixSharingRulesDetailsExport, {
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
  },
  mounted () {
		this.initParams();
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
