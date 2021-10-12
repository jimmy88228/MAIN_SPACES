<style lang="less">
	.user-log{
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
	<div class="user-log">
		<div class="table-topbar">
			<Form ref="formSearch" :model="formSearch" inline>
				<FormItem>
					<Select v-model="formSearch.logType" placeholder="请选择日志类型" style="width:130px">
						<Option v-for="(item, key) in logTypeList" :value="key" :key="key">{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem>
					<DatePicker v-model="formSearch.searchTime" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请选择日志时间"
					 style="width:245px"></DatePicker>
				</FormItem>
				<FormItem>
					<AutoComplete v-model="formSearch.userSearch" :clearable="true" :data="userList" @on-search="searchUser"
					 @on-select="selectUser" placeholder="输入用户名/昵称/手机选择会员" icon="md-person" style="width:200px"></AutoComplete>
				</FormItem>
				<FormItem>
					<Input v-model="formSearch.searchq" placeholder="日志内容" style="width:180px" clearable search enter-button
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
	</div>
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

				logTypeList: [],
				userList: [],
				formSearch: {
					searchq: '',
					logType: '',
					searchTime: '',
					// 搜索会员关键词
					userSearch: '',
					userSearchId: '',
					// 搜索会员的临时索引
					userSearchIndex: []
				}

			}
		},
		methods: {
			init() {
				// 动态计算表高度
				this.tableHeight = document.body.clientHeight - 210;

				this.tableLoading = true;
				// ajax 请求获取初始化数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.userLogList, {
						isInit: 1
					})
					.then((response) => {
						this.tableLoading = false;
						var res = response.data;

						if (res.code) {
							this.columns = res.data.columns;

							// 文字颜色
							this.columns[1].render = (h, params) => {
								var spanColor = params.row.log_type.type == 'add' ? '#19be6b' :
									params.row.log_type.type == 'update' ? '#2d8cf0' :
									params.row.log_type.type == 'remove' ? '#ed3f14' :
									params.row.log_type.type == 'login' ? '#2d8cf0' : 'auto';
								return h('div', [
									h('strong', {
										style: {
											color: spanColor
										}
									}, params.row.log_type.name)
								]);
							};

							// 初始化表数据
							this.data = res.data.items;
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);

							// 初始化类型
							this.logTypeList = res.data.logTypeList;
						}
					});
			},
			// 切换分页
			changePage(page) {
				this.tableLoading = true;
				// ajax 请求获取数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.userLogList, {
						searchq: this.formSearch.searchq,
						searchUserId: (this.formSearch.userSearchId != '' && this.formSearch.userSearch != '' ? this.formSearch.userSearchId :
							''),
						searchType: this.formSearch.logType,
						searchTime: this.formSearch.searchTime,

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
				util.ajax.post(util.apiUrl.userLogList, {
						searchq: this.formSearch.searchq,
						searchUserId: (this.formSearch.userSearchId != '' && this.formSearch.userSearch != '' ? this.formSearch.userSearchId :
							''),
						searchType: this.formSearch.logType,
						searchTime: this.formSearch.searchTime
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
			// 搜索管理员
			searchUser() {
				// ajax 请求获取数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.userList, {
						searchq: this.formSearch.userSearch,
						isInit: 1
					})
					.then((response) => {
						var res = response.data;
						if (res.code) {
							// 初始化表数据
							var arrData = [];
							this.formSearch.userSearchIndex = [];
							for (var i in res.data.items) {
								arrData[i] = res.data.items[i].user_name + res.data.items[i].mobile + '/' + res.data.items[i].nick_name;
								// 做索引，提供给选中的时候用
								this.formSearch.userSearchIndex[arrData[i]] = res.data.items[i].user_id;
							}
							this.userList = arrData;
						}
					});
			},
			// 选中autocomplete
			selectUser(val) {
				this.formSearch.userSearchId = this.formSearch.userSearchIndex[val];
			}
		},
		mounted() {
			this.init();
		}
	};
</script>
