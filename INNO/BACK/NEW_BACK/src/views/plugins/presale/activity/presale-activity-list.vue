<template>
	<div class="presale-group-list">
		<Card>
			<Row type="flex">
				<Col span="10" style="flex:1 1 0%;">
					<SearchForm ref="search" @on-search="searchPage"></SearchForm>
				</Col>
				<Col span="14" class="btn-group">
					<Button type="info" @click="handleImport(1)" v-if="canCreate.activity_upload">导入活动</Button>
					<Button type="info" @click="handleImport(2)" v-if="canCreate.goods_upload">按货号导入商品</Button>
					<Button type="info" @click="handleImport(3)" v-if="canCreate.goods_sku">按条码导入商品</Button>
					<Button type="info" @click="handleExport(1)" v-if="canCreate.export">导出活动</Button>
					<Button type="info" @click="handleExport(2)" v-if="canCreate.goods_export">导出商品</Button>
					<Button type="success" icon="md-add" @click="createActivity" v-if="canCreate.add">创建活动</Button>
					<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
				</Col>
			</Row>
			
			<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable"
			@on-selection-change="getSelectAct" @on-select-all="handleSelectAll">
				<template slot-scope="{ row }" slot="name">
					<div class="img_list_wrap">
						<div class="img_fixed">
							<img :src="row.act_img" v-if="row.act_img" :alt="row.activity_name" v-viewer />
							<img src="@rs/images/default-img.jpg" :alt="row.activity_name" v-viewer v-else/>
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
					<Tag type="dot" :color="row.is_enabled == 0  ? 'error' : row.is_enabled == 1 ? 'success' : 'warning'">{{row.is_enabled == 0  ? '关闭' : row.is_enabled == 1 ? '开启' : '过期'}}</Tag>
				</template>
				<template slot-scope="{ row }" slot="sort">
					<presale-sort :id="row.id" :value="row.sort" @edit-success="handleSort"></presale-sort>
				</template>
				<template slot-scope="{ row }" slot="handle">
					<span v-show="row.handle.edit" @click="handleEdit(row)"><a>编辑</a></span>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page list_page_fixed">
				<div class="btn_group"  v-if="canCreate.update_status">
					<Checkbox v-model="isCheckAll" @on-change="handleCheck">当页全选</Checkbox>
					<ButtonGroup>
						<Button @click="handleBatchStatus(1)">开启</Button>
					</ButtonGroup>
					<ButtonGroup>
						<Button @click="handleBatchStatus(0)">关闭</Button>
					</ButtonGroup>
				</div>
				<div v-else></div>
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
			</div>
			<!--导入组件-->
			<BatchImport ref="batchImport" @on-success="handleSort"></BatchImport>
			<Spin size="large" fix v-if="spinShow"></Spin>
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
	import BatchImport from '@/views/my-components/batch-import/batch-import';
	import notice from '@/views/my-components/mq-notice/mq-notice';
	import PresaleSort from './presale-sort';

	export default {
		components: {
			SearchForm,
			notice,
			PresaleSort,
			BatchImport,
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
				jobIdCol: [],
				selectedAct: [],
      			isCheckAll: false,
      			exportLoading: false,
      			spinShow:false,
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
			handleCheck() {
				this.tableData.forEach((item, index) => {
					if ('_checked' in item) {
						item._checked = this.isCheckAll;
					} else {
						this.$set(this.tableData[index], '_checked', this.isCheckAll);
					}
				});
				this.selectedAct = [...this.tableData].filter(item => item._checked);
			},
			getSelectAct(selection) {
				this.selectedAct = selection;
				let allLen = this.tableData.length;
				this.isCheckAll = allLen > 0 && allLen === selection.length;
				const hasSelected = this.selectedAct.map(item => item.id);
				this.tableData.forEach((item, index) => {
					this.$set(this.tableData[index], '_checked', hasSelected.includes(item.id));
				});
			},
			handleSelectAll() {
				this.isCheckAll = true;
			},
			handleBatchStatus(val) {
				if (this.selectedAct.length === 0) {
					this.$Message.error('请勾选活动');
					return false;
				}
				this.spinShow = true;
				return this.$ajax.post(this.$api.PresaleActivityEditStatus, {
						ids: this.selectedAct.map(item => item.id),
						status: val
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
						}
						this.isCheckAll = false;
						this.selectedAct = [];
						return this.loadData();
					}).finally(()=>{
						this.spinShow = false;
					})
			},
			handleFinish() {
				// 异步下载结束后刷新
				this.loadData();
				this.currentPage = 1;
			},
			handleSort () {
				this.loadData();
			},
			handleImport(row){
				//根据row值进行判断什么导入
				//1 导入活动 2 按货号导入商品 3 按条码导入商品
				let UploadApi='';
				let DownLoadApi='';
				if(Number(row)==1){
					 UploadApi=this.$api.PresaleActivityUpload;
					 DownLoadApi=this.$api.PresaleActivityDownload;
				}else if(Number(row)==2){
					UploadApi=this.$api.PresaleActivityGoodsUpload;
					DownLoadApi=this.$api.PresaleActivityGoodsDownload;
				}else{
					UploadApi=this.$api.PresaleActivityGoodsUploadByProductSn;
					DownLoadApi=this.$api.PresaleActivityGoodsDownloadByProductSn;
				}
				this.$refs.batchImport.openModal(this.canCreate,UploadApi,DownLoadApi);
			},
			handleExport(row) {
				this.$Modal.confirm({
					title: '操作提示',
					content: `确定进行导出操作`,
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.$store.commit('setLoading', true);
						let exportApi=this.$api.presaleActivityExport;
						//1 活动导出 2 商品导出
						if(Number(row)==1){
							exportApi=this.$api.presaleActivityExport;
						}else{
							exportApi=this.$api.PresaleActivityGoodsExport;
						}
						return this.$ajax.post(exportApi, this.condition)
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
	.presale-group-list{
		.list_page_fixed {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.btn-group{
			text-align: right;
		}
	}
</style>
