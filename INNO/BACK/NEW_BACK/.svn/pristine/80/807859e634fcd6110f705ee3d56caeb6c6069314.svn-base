<template>
	<div class="sign-activity">
		<Card>
			<div class="btn-group">
				<Row type="flex">
					<Col style="flex:1 1 0%;">
						<SearchForm ref="search" @on-search="handleSearch" @on-explode="exportPage"></SearchForm>
					</Col>
					<Col style="width:180px;text-align: right;">
						<Button type="info" icon="md-add" @click="createActivity">创建活动</Button>
						<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
					</Col>
				</Row>
				<div style="color: red;">* 每次只能开启一个活动</div>
			</div>
			
			<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
				<template slot-scope="{ row }" slot="start_time">
					<p>{{row.start_time | initDate}}</p>
					<p>{{row.start_time | initTime}}</p>
				</template>
				<template slot-scope="{ row }" slot="end_time">
					<p>{{row.end_time | initDate}}</p>
					<p>{{row.end_time | initTime}}</p>
				</template>

				<template slot-scope="{ row }" slot="is_enabled">
					<i-switch v-model="row.is_enabled" true-value="1" false-value="0" :before-change="handleChange.bind(this, row.id, row.is_enabled)">
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</template>

				<template slot-scope="{ row, index }" slot="handle">
					<span @click="editBrand(index, row)"><a>编辑</a></span>
					<span @click="signLog(index, row)"><a>查看明细</a></span>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
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
		data() {
			return {
				condition: {
					searchq: '',
					from_time: '',
					to_time: ''
				},
				jobIdCol: []
			}
		},
		mixins: [Mixin, PageHelper],
		methods: {
			onLoadData(page, data) {
				let params = Object.assign({}, data);
				return this.$ajax.post(this.$api.signOrderGiveList, params)
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
						}
					});
			},
			exportPage(searchData) {
				this.condition = searchData;
				this.handleExport();
			},
			createActivity() {
				this.$router.push({
					name: 'sign-order-give-add'
				});
			},
			editBrand(index, row) {
				this.$router.push({
					name: 'sign-order-give-edit',
					params: {
						id: row.id
					}
				});
			},
            signLog(index, row) {
				this.$router.push({
					name: 'activity-log-list',
					params: {
						id: row.id
					}
				});
			},
			handleExport() {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定导出签到下单赠送?',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						let formSearch = this.condition;
						return this.$ajax.post(this.$api.signOrderGiveListExport, this.condition).then((response) => {
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
			handleFinish() {
				// 异步下载结束后刷新
				this.loadData();
			},
			handleChange(id, val) {
				return new Promise((resolve, reject) => {
					this.$ajax.post(this.$api.signOrderGiveStatus, {
							id: id,
							is_enable: Number(val) === 0 ? 1 : 0
						})
						.then(response => {
							const res = response.data;
							if (res.code) {
								this.$Message.success(res.message);
								this.loadData();
							}
						});
					reject();
				})
			},
			// 搜索
			handleSearch( searchData ) {
				this.tableLoading = true;
				console.log(searchData);
				return new Promise((resolve, reject) => {
					this.$ajax.post(this.$api.signOrderGiveList, searchData )
						.then(response => {
							this.tableLoading = false;
							const res = response.data;
							
							if (res.code) {
								this.data = res.data;
							}
						});
					reject();
				})
			},
		},
		mounted() {
			this.loadData();
		}
	}
</script>

<style lang="less" scoped>
	.sign-activity {
		.brand-list_import {
			margin-right: 10px;
		}

		.btn-group {
			margin-bottom: 24px;
		}
	}
</style>
