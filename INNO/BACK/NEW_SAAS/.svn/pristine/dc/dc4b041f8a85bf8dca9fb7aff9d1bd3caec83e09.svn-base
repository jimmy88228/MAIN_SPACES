<template>
	<div class="presale-group-list">
		<Card>
			<Row type="flex">
				<Col style="flex:1 1 0%;">
					<SearchForm ref="search" @on-search="searchPage"></SearchForm>
				</Col>
				<Col style="width:230px;text-align: right;">
					<Button type="info" @click="handleExport" v-if="canCreate.export">导出</Button>
					<Button type="success" icon="md-add" @click="createActivity" v-if="canCreate.add">创建活动</Button>
					<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
				</Col>
			</Row>
			
			<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
				<template slot-scope="{ row }" slot="name">
					<div class="img_list_wrap">
						<div class="img_fixed">
							<img :src="row.act_img" v-if="row.act_img" :alt="row.activity_name" v-viewer />
							<img src="@rs/images/default-img.jpg" :alt="row.activity_name" v-viewer v-else></img>
						</div>
						<span class="name">{{row.activity_name}}</span>
					</div>
				</template>
				<template slot-scope="{ row }" slot="createTime">
					<p>{{row.presale_begin_time}} - {{row.presale_end_time}}</p>
				</template>
				<template slot-scope="{ row }" slot="refund">
					<Tag :color="row.isallow_return_deposit == 1 ? 'success' : 'error'">{{row.isallow_return_deposit == 1  ? '退还' : '不退'}}</Tag>
				</template>
				<template slot-scope="{ row }" slot="is_enabled">
					<Tag type="dot" :color="row.is_enabled == 1 ? 'success' : 'error'">{{row.is_enabled == 1  ? '开启' : '关闭'}}</Tag>
				</template>
				<template slot-scope="{ row }" slot="handle">
					<span v-show="row.handle.edit" @click="handleEdit(row)"><a>编辑</a></span>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
			</div>
		</Card>
		<!--异步处理导出excel组件-->
		<div class="col">
			<notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
		</div>
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
				canCreate: {},
				condition: {
					searchq: '',
					is_enabled: -1,
					presale_type: 0,
					start_time: '',
					end_time: ''
				},
				jobIdCol: []
			}
		},
		mixins: [Mixin, PageHelper],
		methods: {
			onLoadData(page, data) {
				let params = Object.assign({}, data, this.condition);
				return this.$ajax.post(this.$api.presaleActivityList, params)
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.canCreate = res.data && res.data.canCreate;
						}
					});
			},
			searchPage(searchData) {
				this.condition = searchData;
				this.loadData();
			},
			createActivity() {
				this.$router.push({
					name: 'presale-activity-add'
				})
			},
			handleEdit(row) {
				this.$router.push({
					name: 'presale-activity-edit',
					params: {
						id: row.id
					}
				})
			},
			handleFinish() {
				// 异步下载结束后刷新
				this.loadData();
				this.currentPage = 1;
			},
			handleExport() {
				this.$Modal.confirm({
					title: '操作提示',
					content: `确定进行导出操作`,
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.$store.commit('setLoading', true);
						return this.$ajax.post(this.$api.presaleOrderExport, this.condition)
							.then(response => {
								const res = response.data;
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
								this.$store.commit('setLoading', false);
							});
					}
				});
			}
		},
		mounted() {
			this.loadData();
		}
	}
</script>

<style lang="less" scoped>
	.presale-group-list {

	}
</style>
