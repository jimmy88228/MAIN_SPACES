<script src="../../../config/index.js"></script>
<template>
	<PageTopBase class="assembly-list">
	<div class="sign-activity">
		<Card>
			<div class="btn-group">
				<Row type="flex">
					<Col style="flex:1 1 0%;">
						<SearchForm ref="search" @on-search="handleSearch" @on-explode="exportPage"></SearchForm>
					</Col>
					<Col style="width:180px;text-align: right;">
						<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
					</Col>
				</Row>
			</div>
			
			<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
				<template slot-scope="{ row }" slot="receive_time">
					<p>{{row.receive_time | initDate}}</p>
					<p>{{row.receive_time | initTime}}</p>
				</template>

				<template slot-scope="{ row, index }" slot="related_order_sn">
					<router-link tag="a" :to="{name: 'order-info', params: {sn: row.related_order_id}}" target="_blank" v-if="row.related_order_sn != '-'">{{row.related_order_sn }}</router-link>
					<p v-else>{{row.related_order_sn }}</p>
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
	</PageTopBase>
</template>
<script>
    import PageTopBase from '@/views/my-components/page-top-base/index';
	import SearchForm from './search-form-log';
	import Mixin from './mixin-log.js';
	import PageHelper from '@/libs/page-helper.js';
	import notice from '@/views/my-components/mq-notice/mq-notice';

	export default {
        props: ['id'],
		components: {
			SearchForm,
			notice,
            PageTopBase,
		},
		data() {
			return {
				condition: {
					searchq: '',
                    receive_status: '-1',
				},
				jobIdCol: []
			}
		},
		mixins: [Mixin, PageHelper],
		methods: {
			onLoadData(page, data) {
				let params = Object.assign({}, data);
				return this.$ajax.post(this.$api.signOrderGiveLog, {
					...params,
					activityId: this.id,
					...this.condition
				})
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
			handleExport() {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定导出签到下单活动记录?',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						let formSearch = this.condition;
						return this.$ajax.post(this.$api.signOrderGiveLogExport, {
						    ...formSearch,
                            activityId: this.id
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
                this.condition = searchData
			    this.loadData();
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
