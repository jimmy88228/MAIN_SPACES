<template>
	<div class="brand-list">
		<div>
			<Row type="flex">
				<Col style="flex:1 1 0%;">
					<SearchForm ref="search" @on-search="searchPage"></SearchForm>
				</Col>
				<Col style="width: 340px;text-align: right;">
					<!-- <Button type="info" @click="handleExport">导出</Button>
					<Button type="warning" icon="md-add" @click="handleImport">批量导入</Button>
					<Button type="success" icon="md-add" @click="createItem" v-if="canCreate.add">新增分销员</Button> -->
					<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
				</Col>
			</Row>
			<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable"
			 @on-selection-change="getSelectGoods" @on-sort-change="sortPage">
				<template slot-scope="{ row }" slot="member">
					<div>
						<div class="img_list_wrap">
							<div class="img_fixed">
								<img :src="row.portrait_path" v-if="row.portrait_path" :alt="row.wechat_name" v-viewer />
								<img src="@rs/images/default-img.jpg" :alt="row.wechat_name" v-viewer v-else/>
							</div>
							<div>
								<p class="name">昵称:{{row.wechat_name}}</p>
								<p class="name">卡号:{{row.card_num}}</p>
							</div>
						</div>
						<p v-if="Number(row.is_staff)>0" style="margin-top:-10px;margin-bottom:5px;margin-left:5px;"><Button type="info" size="small">店员</Button></p>
					</div>
				</template>
				<template slot-scope="{ row }" slot="is_enabled">
					<Tag type="dot" :color="row.is_enabled === 'Y' ? 'success' : 'error'">{{row.is_enabled === 'Y'  ? '开启' : '关闭'}}</Tag>
				</template>
				<template slot-scope="{ row }" slot="create_time">
					<p>{{row.create_time | initDate}}</p>
					<p>{{row.create_time | initTime}}</p>
				</template>
				<template slot-scope="{ row }" slot="handle">
					<!-- <span v-show="row.handle.edit" @click="handleEdit(row)"><a>编辑</a></span>
					<Divider type="vertical" v-show="row.handle.edit && row.handle.performance" />
					<span v-show="row.handle.performance" @click="goYe(row)"><a>业绩查询</a></span>
					<Divider type="vertical" v-show="row.handle.performance && row.handle.balance" />
					<span v-show="row.handle.balance" @click="goYuEr(row)"><a>余额查询</a></span>
					<Divider type="vertical"  />
					<span v-show="row.handle.clear_fan" @click="clearFan(row)"><a>解除粉丝</a></span> -->
					<span v-show="row.handle.trash"  @click="handleRecovery(row)"><a>还原</a></span>
				</template>
			</Table>
			<div v-show="pageTotal > 0" class="handle_wrapper">
				<div style="padding-left:12px;">
					<Checkbox v-model="isCheckAll" @on-change="handleCheck">当页全选</Checkbox>
					<ButtonGroup>
						<!-- <Button @click="handleGoods('batchBind')">批量绑定</Button>
						<Button @click="handleGoods('openStaff')">开启分销员</Button>
						<Button @click="handleGoods('closeStaff')">关闭分销员</Button>
						 <Button @click="handleImport4">批量修改分销员资料</Button>
						<Button @click="handleImport2">批量解除关系</Button>
						<Button @click="handleImport3">批量分销余额减扣</Button> -->
						<Button @click="handleBatchRecovery">批量还原</Button>
					</ButtonGroup>
				</div>
				<div v-show="pageTotal" class="list_page">
					<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
					 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
				</div>
			</div>
		</div>

		<BatchImport ref="batchImport" @on-success="onImportSuccess"></BatchImport>
		<BatchImport ref="batchImport2" :downloadPayLoad="downloadPayLoad2" :upLoadPayLoad="downloadPayLoad2" @on-success="onImportSuccess">
			<template v-slot:content>
				<p  class="strong_tips">*关系解除后不可恢复</p>
				<p  class="strong_tips">解除上级时，导入粉丝会员卡号</p>
				<p  class="strong_tips">清除粉丝时，导入分销员代码</p>
					
				<Select v-model="downloadPayLoad2.type" class="basic_select">
					<Option :value="1">解除上级</Option>
					<Option :value="2">清除下级</Option>
				</Select>
			</template>
		</BatchImport>
		<!--异步处理导出excel组件-->
		<div class="col">
			<notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
		</div>
	</div>
</template>
<script>
	import SearchForm from './search-form';
	import Mixin from './mixin.js';
	import BatchImport from '@/views/my-components/batch-import/batch-import';
	import PageHelper from '@/libs/page-helper.js';
	import notice from '@/views/my-components/mq-notice/mq-notice';
	import Template from '../../../../my-components/list-component/template/template.vue';

	export default {
		components: {
			SearchForm,
			BatchImport,
			notice
		},
		data() {
			return {
				canCreate: {},
				condition: {
					store_id: 0,
					is_level: '0', //等级 0全部 1 等级一 2 等级二
					is_bind: '0', //是否绑定 0全部 1 是 2 否
					is_enabled: '0', //是否启用 0全部 1 是 2 否
					status: '-1', //分销员状态 -1全部 0 离职 1 在职 2 兼职
					start_time: '', //开始时间
					end_time: '', //结束时间
					searchq: '', //搜索值
					searchq_type: '', //搜索类型
					sortType: 'DESC',
					is_delete: 1
				},
				isCheckAll: false,
				selectGoods: [],
				jobIdCol: [],
				tipText: {
					batchBind: '批量绑定',
					openStaff: '开启分销员',
					closeStaff: '关闭分销员'
				},
				selectData: [],
				downloadPayLoad2: {
					type: 1
				}
			}
		},
		mixins: [Mixin, PageHelper],
		methods: {
			getSelectGoods(selection) {
				console.log(this.selectData)
				this.selectGoods = selection;
				let allLen = this.selectData.length;
				this.isCheckAll = allLen > 0 && allLen === selection.length;
				const hasSelected = this.selectGoods.map(item => item.dstb_staff_id);
				this.selectData.forEach((item, index) => {
					this.$set(this.selectData[index], '_checked', hasSelected.includes(item.dstb_staff_id));
				});
			},
			handleCheck() {
				this.selectData.forEach((item, index) => {
					if ('_checked' in item) {
						item._checked = this.isCheckAll;
					} else {
						this.$set(this.selectData[index], '_checked', this.isCheckAll);
					}
				});
				this.selectGoods = [...this.selectData].filter(item => item._checked);
			},
			handleGoods(type) {
				if (this.selectGoods.length === 0) {
					this.$Message.error('请选择分销员')
					return false;
				}
				this.$Modal.confirm({
					title: '操作提示',
					content: `确定进行${this.tipText[type]}操作`,
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						let url;
						switch (type) {
							case 'batchBind':
								url = this.$api.distributionStaffBind;
								break;
							case 'openStaff':
								url = this.$api.distributionStaffOpen;
								break;
							case 'closeStaff':
								url = this.$api.distributionStaffClose;
								break;
							default:
								break;
						}
						this.$ajax.post(url, {
								dstb_staff_ids: this.selectGoods.map(item => item.dstb_staff_id)
							})
							.then((response) => {
								var res = response.data;

								if (res.code) {
									this.$Message.success(res.message);
									this.selectGoods = [];
									this.loadData();
								}
							});
					}
				});
			},
			clearOptions() {
				this.condition = {
					store_id: 0,
					is_level: '0', //等级 0全部 1 等级一 2 等级二
					is_bind: '0', //是否绑定 0全部 1 是 2 否
					is_enabled: '0', //是否启用 0全部 1 是 2 否
					status: '-1', //分销员状态 -1全部 0 离职 1 在职 2 兼职
					start_time: '', //开始时间
					end_time: '', //结束时间
					searchq: '', //搜索值
					searchq_type: '', //搜索类型
					sortType: 'DESC'
				};
				this.$refs.search.clearOptions();
			},
			onLoadData(page, data) {
				let params = Object.assign({}, data, this.condition);
				return this.$ajax.post(this.$api.distributionStaffList, params)
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.canCreate = res.data && res.data.canCreate;
						}
					});
			},
			sortPage({
				order
			}) {
				this.condition.sortType = order;
				this.loadData();
			},
			searchPage(searchData) {
				this.condition = searchData;
				this.loadData();
			},
			onDelItem(row) {
				return this.$ajax.post(this.$api.goodsBrandRemove, {
					goods_brand_id: row.goods_brand_id
				});
			},
			handleImport() {
				// 有空去统一字段
				this.$refs.batchImport.openModal(this.canCreate.import ? {
					upload: true,
					download: true
				} : {
					upload: false,
					download: false
				}, this.$api.distributionStaffImportDistribution, this.$api.distributionStaffDownDistribution);
			},
			handleImport2() {
				this.$refs.batchImport2.openModal({
					upload: true,
					download: true
				}, this.$api.distributionStaffRelieve, this.$api.distributionStaffRelieveDown)
			},
			handleImport3() {
				this.$refs.batchImport.openModal({
					upload: true,
					download: true
				}, this.$api.distributionStaffDeduction, this.$api.distributionStaffDeductionDown)
			},
			handleImport4() {
				this.$refs.batchImport.openModal({
					upload: true,
					download: true
				}, this.$api.distributionStaffUpdateData, this.$api.distributionStaffUpdateDataDown)
			},
			onImportSuccess() {
				this.loadData();
			},
			createItem() {
				this.$router.push({
					name: 'distribution-staff-add'
				});
			},
			handleEdit(row) {
				this.$router.push({
					name: 'distribution-staff-edit',
					params: {
						id: row.dstb_staff_id
					}
				});
			},
			goYe(row) {
				this.$router.push({
					name: 'distribution-yeji',
					params: {
						id: row.dstb_staff_id
					},
					query: {
						name: row.dstb_staff_name
					}
				})
			},
			goYuEr(row) {
				this.$router.push({
					name: 'distribution-yeer',
					params: {
						id: row.dstb_staff_id
					},
					query: {
						name: row.dstb_staff_name
					}
				})
			},
			handleExport() {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定导出数据么',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						return this.$ajax.post(this.$api.distributionStaffListExport, {
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
			clearFan(row){
				var that = this;
				this.$Modal.confirm({
                    title: '分销员解除粉丝',
                        // content: '确定要删除该活动吗，<span style="color:red;">数据将不可恢复，请谨慎操作！</span>点确定继续删除',
						content: '提示语：此操作将会清除该分销员的所有粉丝会员，<span style="color:red;">且不可恢复，请慎重操作！</span>是否确认继续？',
                        okText: '确定',
						cancelText: '取消',
                        onOk: () => {
							return this.$ajax.post(this.$api.distributionStaffClearFan, {staff_id:row.dstb_staff_id}).then((response) => {
								var res = response.data;
								if (res.code) {
									this.$Message.success('解除成功!');
									this.loadData();
								} else {
									this.$Message.error(res.message);
								}
							});
                        }
                });
							
			},
			handleBatchRecovery() {
				if (this.selectGoods.length === 0) {
					this.$Message.error('请勾选分销员');
					return false;
				}
				this.spinShow = true;
				return this.$ajax.post(this.$api.distributionStaffTrashAction, {
						staff_ids: this.selectGoods.map(item => item.dstb_staff_id),
						is_delete: 0
					})
					.then((response) => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
							this.spinShow = false;
							this.selectGoods = [];
						}
						this.loadData();
					});
			},
			handleRecovery(row) {
				this.spinShow = true;
				return this.$ajax.post(this.$api.distributionStaffTrashAction, {
						staff_ids: [row.dstb_staff_id],
						is_delete: 0
					})
					.then((response) => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
						}
						this.spinShow = false;
						this.loadData();
					});
			},
		}
	}
</script>

<style lang="less" scoped>
	.brand-list {
		.brand-list_import {
			margin-right: 10px;
		}

		.btn-group {
			text-align: right;
		}

		.handle_wrapper {
			margin-top: 10px;
		}
	}
</style>
