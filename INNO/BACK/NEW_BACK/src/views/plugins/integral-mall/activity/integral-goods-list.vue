<template>
	<div class="integral-goods-list">
		<Card>
			<Row type="flex">
				<Col style="flex:1 1 0%;">
					<SearchForm ref="search" @on-search="searchPage"></SearchForm>
				</Col>
				<Col style="text-align: right;width:660px;">
					<Button type="info" @click="handleImportActivity()" v-if="canCreate.activity_upload">导入活动</Button>
					<Button type="info" @click="confirmExportActivity()" v-if="canCreate.activity_export">导出活动</Button>
					<Button type="info" @click="handleImportActivityGoods()" v-if="canCreate.activity_goods_upload">导入商品</Button>
					<Button type="info" @click="confirmExportActivityGoods()" v-if="canCreate.activity_goods_export">导出商品</Button>
					<Button type="info" @click="handleImportBatchActivity()" v-if="canCreate.activity_batch_upload">导入批量修改活动</Button>
					<Button type="info" icon="md-add" @click="createActivity" v-if="canCreate.add">创建活动</Button>
					<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
				</Col>
			</Row>
			<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable" 
			@on-selection-change="getSelectAct" @on-select-all="handleSelectAll">
				<template slot-scope="{ row }" slot="name">
					<div class="img_list_wrap">
						<div class="img_fixed">
							<img :src="row.picture" v-if="row.picture" :alt="row.name" v-viewer />
							<img src="@rs/images/default-img.jpg" :alt="row.name" v-viewer v-else></img>
						</div>
						<span class="name">{{row.name}}</span>
					</div>
				</template>
				<template slot-scope="{ row }" slot="goods">
					<p>{{row.get_goods.goods_name}}</p>
				</template>
				<template slot-scope="{ row }" slot="goodsSn">
					<p>{{row.get_goods.goods_sn}}</p>
				</template>
				<template slot-scope="{ row }" slot="start_time">
					<p>{{row.start_time | initDate}}</p>
					<p>{{row.start_time | initTime}}</p>
				</template>
				<template slot-scope="{ row }" slot="end_time">
					<p>{{row.end_time | initDate}}</p>
					<p>{{row.end_time | initTime}}</p>
				</template>
				<template slot-scope="{ row }" slot="sort">
					<goods-sort :id="row.id" :sort="row.sort" @edit-sort="loadData"></goods-sort>
				</template>
				<template slot-scope="{ row }" slot="enable">
					<Tag type="dot" :color="row.enable === '1' ? 'success' : 'error'">{{row.enable === '1'  ? '启用' : '关闭'}}</Tag>
				</template>
				<template slot-scope="{ row }" slot="handle">
					<span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page list_page_fixed">
				<div class="btn_group"  v-if="canCreate.edit_status">
				<Checkbox v-model="isCheckAll" @on-change="handleCheck">当页全选</Checkbox>
				<ButtonGroup>
					<Button @click="handleBatchStatus(1)">批量启用</Button>
				</ButtonGroup>
				<ButtonGroup>
					<Button @click="handleBatchStatus(0)">批量关闭</Button>
				</ButtonGroup>
				</div>
				<div v-else></div>
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
			</div>
			 <!--异步处理导出excel组件-->
			<div class="col">
				<notice :ref="'notice' + item" @finish="" v-for="item in jobIdCol" :key="item"></notice>
			</div>
			<!--管理员编辑表单-->
			<BatchImport ref="batchImport" @on-success="onImportSuccess"></BatchImport>
		</Card>
	</div>
</template>
<script>
	import SearchForm from './search-form';
	import Mixin from './mixin.js';
	import PageHelper from '@/libs/page-helper.js';
	import GoodsSort from './goods-list-sort';
	import notice from '@/views/my-components/mq-notice/mq-notice';
	import BatchImport from '@/views/my-components/batch-import/batch-import';

	export default {
		components: {
			SearchForm,
			GoodsSort,
			notice,
    		BatchImport
		},
		data() {
			return {
				canCreate: {},
				condition: {
					searchq: '',
					status: -1,
					start_time: '',
					end_time: '',
					searchq_type: 'name'
				},
				selectedAct: [],
				isCheckAll: false,
				exportLoading: false,
				jobIdCol: [],
			}
		},
		mixins: [Mixin, PageHelper],
		methods: {
			onLoadData(page, data) {
				let params = Object.assign({}, data, this.condition);
				return this.$ajax.post(this.$api.integralGoodsList, params)
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
					name: 'integral-goods-add'
				})
			},
			editItem(row) {
				this.$router.push({
					name: 'integral-goods-edit',
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
				return this.$ajax.post(this.$api.integralGoodsEditStatus, {
						ids: this.selectedAct.map(item => item.id),
						status: val
								})
								.then(response => {
									const res = response.data;
									if (res.code) {
										this.$Message.success(res.message);
										this.loadData();
									}
						this.isCheckAll = false;
						this.selectedAct = [];
						this.spinShow = false;
					});
			},
			confirmExportActivity(data){
				let params = Object.assign({}, data, this.condition);
				return this.$ajax.post(this.$api.integralGoodsActivityExport,params).then((response) => {
						var res = response.data;
						if (res.code) {
							var jobId = res.data;
							this.jobIdCol.push(jobId);
							this.$nextTick(() => {
								this.$refs[`notice${jobId}`][0].showNotice(jobId);
							});
							this.$Message.success(res.message);
						} else {
							this.$Message.error(res.message);
						}
				}).finally(()=>{
					this.isExportTime = false;
				})
			},
			handleImportActivity (row) {
				this.uploadUrl = this.$api.integralGoodsActivityUpload;
				console.log(this.uploadUrl)
				this.$refs.batchImport.openModal(this.canCreate, this.uploadUrl, this.$api.integralGoodsActivityDownload);
			},
            handleImportBatchActivity (row) {
                //批量修改活动
                this.uploadUrl = this.$api.integralGoodsActivityBatchUpload;
                this.$refs.batchImport.openModal(this.canCreate, this.uploadUrl, this.$api.integralGoodsActivityBatchDownload);
            },
			confirmExportActivityGoods(data){
				let params = Object.assign({}, data, this.condition);
				return this.$ajax.post(this.$api.integralGoodsActivityGoodsExport,params).then((response) => {
						var res = response.data;
						if (res.code) {
							var jobId = res.data;
							this.jobIdCol.push(jobId);
							this.$nextTick(() => {
								this.$refs[`notice${jobId}`][0].showNotice(jobId);
							});
							this.$Message.success(res.message);
						} else {
							this.$Message.error(res.message);
						}
				}).finally(()=>{
					this.isExportTime = false;
				})
			},
			handleImportActivityGoods (row) {
				this.uploadUrl = this.$api.integralGoodsActivityGoodsUpload;
				console.log(this.uploadUrl)
				this.$refs.batchImport.openModal(this.canCreate, this.uploadUrl, this.$api.integralGoodsActivityGoodsDownload);
			},
			onImportSuccess () {
				this.loadData();
			},
		},
		mounted() {
			this.loadData();
		}
	}
</script>

<style lang="less" scoped>
	.integral-goods-list {
		.btn-group {
			text-align: right;
		}
		.list_page_fixed {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>
