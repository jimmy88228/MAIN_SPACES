<template>
	<Card class="issue-log-list">
		<Row style="margin-bottom: 10px;">
			<Col span="20">
				<searchForm @on-search="searchPage" :cat-list="catList" ></searchForm>
			</Col>
			<Col span="4" style="text-align: right;">
				<Button type="info" @click="handleExport">导出商品</Button>
			</Col>
		</Row>
		<Table
			:columns="columns"
			:data="tableData"
			:loading="tableLoading"
			:height="tableHeight"
			ref="myTable">
			<template slot-scope="{ row }" slot="name">
				<p style="color:rgb(10,11,251);font-size:14px;">{{row.goods_name}}</p>
				<p style="font-size:14px;">货号:{{row.goods_sn}}</p>
				<p style="font-size:14px;">分类:{{row.cat_name}}</p>
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

</template>

<script>
	import searchForm from './search-form';
	import Mixin from './mixin.js';
	import PageHelper from '@/libs/page-helper.js';
	import notice from '@/views/my-components/mq-notice/mq-notice';

	export default {
		components: {
			searchForm,
			notice
		},
		data() {
			return {
				catList: [],
				searchData: {
					searchq: '',
					cat_id: 0,
					start_time: '',
					end_time: '',
				},
				jobIdCol: []
			}
		},
		mixins: [PageHelper,Mixin],
		methods: {
			onLoadData(page, data) {
				let params = {
					...this.searchData,
					...data
				}
				return this.$ajax.post(this.$api.videoNumberIssueLog, params)
					.then(response => {
						var res = response.data;
						if (res.code) {
							this.data = res.data || {};
						}
					});
			},
			loadExtraData() {
				this.$ajax.post(this.$api.catTree)
				.then((response) => {
					var res = response.data;
					if (res.code) {
						this.catList=res.data || [];
					}
					// this.$store.commit('setLoading', false);
				});
			},
			handleExport(){
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定导出数据么',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						return this.$ajax.post(this.$api.videoNumberIssueLogExport, this.searchData).then((response) => {
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
			searchPage(searchData){		
				this.searchData = searchData;
				this.loadData();
			}
		},
		mounted() {
			this.loadExtraData();
			this.loadData();
		}
	}
</script>

<style lang="less">

</style>
