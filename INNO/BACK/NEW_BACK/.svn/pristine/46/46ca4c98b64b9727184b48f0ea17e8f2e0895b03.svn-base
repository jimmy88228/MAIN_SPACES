<style lang="less">
	.cron-log{
	.table-topbar{
	    .ivu-form-item{
	        margin-bottom: 10px;
	    }
	    .ivu-input-icon-clear{
		right:50px;
	    }
	}
}
</style>

<template>
	<Card class="cron-log">
		<div class="table-topbar">
			<Form ref="formSearch" :model="formSearch" inline>
				<FormItem>
					<Tooltip content="返回">
						<Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28" />
					</Tooltip>
				</FormItem>
				<FormItem>
					<Select v-model="formSearch.cronCode" placeholder="任务类型" style="width:180px">
						<Option value="ALL">全部任务</Option>
						<Option v-for="(item, key) in cronCodeList" :value="key" :key="key">{{ item.name }} ({{key}})</Option>
					</Select>
				</FormItem>
				<FormItem>
					<DatePicker v-model="formSearch.searchTime" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="日志时间"
					 style="width:255px"></DatePicker>
				</FormItem>
				<FormItem>
					<Input v-model="formSearch.searchq" placeholder="日志关键词" style="width:150px" clearable search enter-button
					 @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent="searchPage"></Input>
				</FormItem>
			</Form>
		</div>

		<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
		<div v-show="pageTotal>0" style="margin: 10px;overflow: hidden">
			<div style="float: right;">
				<Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
			</div>
		</div>
	</Card>
</template>

<script>
	import util from '@/libs/util.js';

	export default {
		components: {

		},
		data() {
			return {
				columns: [],
				data: [],
				tableHeight: 500,
				tableLoading: false,
				pageTotal: 0,
				pageSize: 20,

				// 类型列表
				cronCodeList: [],

				formSearch: {
					searchq: '',
					cronCode: '',
					searchTime: ''
				}
			}
		},
		methods: {
			init() {
				// 动态计算表高度
				this.tableHeight = document.body.clientHeight - 210;

				this.tableLoading = true;
				// ajax 请求获取初始化数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.cronLogList, {
						isInit: 1,
						searchCode: this.formSearch.cronCode
					})
					.then((response) => {
						this.tableLoading = false;
						var res = response.data;

						if (res.code) {
							this.columns = res.data.columns;

							// 初始化表数据
							this.data = res.data.items;
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);

							// 初始化类型
							this.cronCodeList = res.data.cronCodeList;

							// url 带的参数加入到搜索
							this.formSearch.cronCode = this.$route.params.code;
						}
					});
			},
			// 切换分页
			changePage(page) {
				this.tableLoading = true;
				// ajax 请求获取数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.cronLogList, {
						searchCode: this.formSearch.cronCode,
						time: this.formSearch.searchTime,
						page: page
					})
					.then((response) => {
						var res = response.data;
						if (res.code) {
							// 初始化表数据
							this.data = res.data.items;
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);
						}

						this.tableLoading = false;
					});
			},
			// 搜索日志
			searchPage() {
				this.tableLoading = true;
				// ajax 请求获取数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.cronLogList, {
						searchCode: this.formSearch.cronCode,
						time: this.formSearch.searchTime
					})
					.then((response) => {
						var res = response.data;
						if (res.code) {
							// 初始化表数据
							this.data = res.data.items;
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);
						}

						this.tableLoading = false;
					});
			},
			// 返回列表
			goBack() {
				this.$router.push('/system/cron');
			}
		},
		mounted() {
			this.init();
		}
	};
</script>
