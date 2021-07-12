<template>
	<div class="coupon-list">
		<Row type="flex">
			<Col style="flex:1 1 0%;">
			<SearchForm ref="search" @on-search="searchPage"></SearchForm>
			</Col>
			<Col style="width:170px;text-align: right;">
			<select-coupon-type>
				<Button type="info" icon="md-add" v-if="canCreate.add">添加优惠券</Button>
			</select-coupon-type>
			<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
			</Col>
		</Row>
		<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="proxyData" ref="myTable"
		 @on-selection-change="getSelectGoods" @on-select-all="handleSelectAll">
			<template slot-scope="{ row }" slot="name">
				<div class="img_list_wrap">
					<div class="img_fixed">
						<img :src="row.image_main" v-if="row.image_main" :alt="row.type_name" v-viewer />
						<img src="@rs/images/default-img.jpg" :alt="row.type_name" v-viewer v-else></img>
					</div>
					<div>
						<p class="name">{{row.type_name}}</p>
						<p class="name" v-if="row.bonus_type == 1 || row.bonus_type == 4">({{row.bonus_type == 1 ? '满减券' : (row.bonus_type == 4 ? '折扣券' : '实物券')}})</p>
					</div>
				</div>
			</template>

			<template slot="sendCount" slot-scope="{ row }">
				<span v-show="row.handle.assembly" @click="handleAssembly(row.type_id, 'send-list')"><a>{{ row.send_count }}</a></span>
			</template>

			<template slot="useCount" slot-scope="{ row }">
				<span v-show="row.handle.assembly" @click="handleAssembly(row.type_id, 'use-list')"><a>{{ row.use_count }}</a></span>
			</template>


			<template slot-scope="{ row }" slot="sendType">
				<p v-if="row.send_type == 0">微商城优惠卷</p>
				<p v-else-if="row.send_type == 3">扫码支付优惠卷</p>
				<p v-else-if="row.send_type == 4">ERP券</p>
				<p v-else-if="row.send_type == 5">通用券</p>
			</template>
			<template slot-scope="{ row }" slot="modifyTime">
				<p>{{row.modify_time | initDate}}</p>
				<p>{{row.modify_time | initTime}}</p>
			</template>
			<template slot-scope="{ row }" slot="handle">
				<div v-if="$route.query.act === 'coupon-list'">
					<div>
						<span v-show="row.handle.send" @click="handleSend(row.type_id)"><a>发放</a></span>
						<Divider type="vertical" v-show="row.handle.edit" />
						<span v-show="row.handle.edit" @click="handleEdit(row.type_id, row.send_type, row.bonus_type)"><a>编辑</a></span>
						<Divider type="vertical" v-show="row.handle.copy" />
						<span v-show="row.handle.copy" @click="handleCopy(row.type_id, row.send_type, row.bonus_type)"><a>复制</a></span>
					</div>
					<div>
						<span v-show="row.handle.additional" @click="handleShowFixed(row.type_id)"><a>追加补发</a></span>
						<Divider type="vertical" />
						<span v-show="row.handle.volumecode" @click="handleVolumeCode(row)"><a>预生成券二维码</a></span>
					</div>
					<div>
						<span v-show="row.handle.assembly" @click="handleAssembly(row.type_id)"><a>发放流水</a></span>
						<Divider type="vertical" v-show="row.handle.rollcode" />
						<span v-show="row.handle.rollcode" @click="handleCouponsRollCode(row)"><a>领券二维码</a></span>
						<Divider type="vertical" v-show="row.handle.remove" />
						<span v-show="row.handle.remove" @click="handleCouponChange('remove', row.type_id)"><a>移除</a></span>
						<Divider type="vertical" v-show="row.handle.jumpset" />
						<span v-show="row.handle.jumpset" @click="handleJumpSet(row.type_id)"><a>跳转设置</a></span>
					</div>
					<div>
						<span v-show="row.handle.reel" @click="handleExport(row.type_id)"><a>导出券号</a></span>
					</div>
				</div>
				<div v-else>
					<span v-show="row.handle.rest" @click="handleCouponChange('rollback', row.type_id)"><a>还原</a></span>
				</div>
			</template>
		</Table>
		<div v-show="pageTotal" class="list_page list_page_fixed">
			<div class="btn_group" v-if="$route.query.act === 'coupon-list'">
				<Checkbox v-model="isCheckAll" @on-change="handleCheck">当页全选</Checkbox>
				<ButtonGroup>
					<Button @click="handleCouponDownload">批量下载领券二维码</Button>
				</ButtonGroup>
			</div>
			<div v-else></div>
			<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
			 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
		</div>

		<Modal v-model="showFixed" title="追加补发预生成优惠券" @on-ok="handleFixed">
			<label style="margin-right: 20px;">补发数量</label>
			<Input v-model="fixedData.number" placeholder="请输入补发数量" class="basic_input" />
		</Modal>
		<Spin size="large" fix v-if="spinShow"></Spin>
		<jump-set ref="jumpSet" />
		<!--异步处理导出excel组件-->
		<div class="col">
			<notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
		</div>
	</div>
</template>
<script>
	import SearchForm from './search-form';
	import PageHelper from '@/libs/page-helper.js';
	import JumpSet from './jump-set';
	import SelectCouponType from './select-coupon-type';
	import Mixin from './mixin';
	import notice from '@/views/my-components/mq-notice/mq-notice';

	export default {
		components: {
			SearchForm,
			JumpSet,
			SelectCouponType,
			notice
		},
		data() {
			return {
				canCreate: {},
				condition: {
					date: '',
					give_type: 'all',
					lost: 2,
					send_type: 'all',
					searchq: '',
					search_type: 1
				},
				isCheckAll: false,
				proxyData: [],
				selectedCoupon: [],
				showFixed: false,
				fixedData: {
					number: 0
				},
				currentTypeId: 0,
				jobIdCol: [],
				spinShow: false
			}
		},
		mixins: [Mixin, PageHelper],
		methods: {
			onLoadData(page, data) {
				let params = Object.assign({}, data, this.condition, {
					showtype: this.$route.query.act === 'coupon-list' ? 1 : 2
				});
				return this.$ajax.post(this.$api.couponsList, params)
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.canCreate = res.data && res.data.canCreate;
							this.proxyData = JSON.parse(JSON.stringify(this.tableData));
						}
					});
			},
			searchPage(searchData) {
				this.condition = searchData;
				this.loadData();
			},
			handleCheck() {
				this.proxyData.forEach((item, index) => {
					if ('_checked' in item) {
						item._checked = this.isCheckAll;
					} else {
						this.$set(this.proxyData[index], '_checked', this.isCheckAll);
					}
				});
				this.selectedCoupon = [...this.proxyData].filter(item => item._checked);
			},
			getSelectGoods(selection) {
				this.selectedCoupon = selection;
				let allLen = this.proxyData.length;
				this.isCheckAll = allLen > 0 && allLen === selection.length;
				const hasSelected = this.selectedCoupon.map(item => item.type_id);
				this.proxyData.forEach((item, index) => {
					this.$set(this.proxyData[index], '_checked', hasSelected.includes(item.type_id));
				});
			},
			handleSelectAll() {
				this.isCheckAll = true;
			},
			handleSend(id) {
				this.$router.push({
					name: 'send-coupon',
					params: {
						id
					}
				});
			},
			handleEdit(typeId, pid, id) {
				this.$router.push({
					name: 'coupon-details',
					params: {
						id: typeId
					},
					query: {
						pid,
						id,
						isEdit: 1
					}
				});
			},
			handleCopy(typeId, pid, id) {
				this.$router.push({
					name: 'coupon-details',
					params: {
						id: typeId
					},
					query: {
						pid,
						id,
						isCopy: 1
					}
				});
			},
			// 追加补发
			handleFixed() {
				if (this.fixedData.number <= 0) {
					this.$Message.error('请输入补发数量');
					return false;
				}
				this.spinShow = true;
				return this.$ajax.post(this.$api.couponsAdditional, {
						type_id: this.currentTypeId,
						num: this.fixedData.number
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
							this.loadData();
						}
						this.spinShow = false;
					});
			},
			handleShowFixed(id) {
				this.showFixed = true;
				this.currentTypeId = id;
			},
			//发放流水
			handleAssembly(id,act = 'send-list') {
				this.$router.push({
					name: 'assembly-list',
					params: {
						id,
						act:act
					}
				});
			},
			handleCouponChange(type, id) {
				this.$Modal.confirm({
					title: '提示',
					content: `确定进行${type === 'remove' ? '删除' : '还原'}操作吗？`,
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.spinShow = true;
						return this.$ajax.post(this.$api.couponsRemove, {
								type_id: id,
								type: type === 'remove' ? 1 : 0
							})
							.then(response => {
								const res = response.data;
								if (res.code) {
									this.$Message.success(res.message);
									this.loadData();
								}
								this.spinShow = false;
							});
					}
				});
			},
			handleJumpSet(id) {
				this.loadJumpSetData(id).then(data => {
					this.spinShow = false;
					this.$refs.jumpSet.setData(data, id).show();
				});
			},
			loadJumpSetData(id) {
				this.spinShow = true;
				return this.$ajax.post(this.$api.couponsJumpSetInfo, {
						type_id: id
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							return res.data;
						}
					});
			},
			handleCouponDownload() {
				if (this.selectedCoupon.length === 0) {
					this.$Message.error('请勾选优惠券');
					return false;
				}
				this.spinShow = true;
				return this.$ajax.post(this.$api.couponsBatchDownCode, {
						type_ids: this.selectedCoupon.map(item => item.type_id)
					})
					.then((response) => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
							var jobId = res.data;
							// 打开异步提示组件
							this.jobIdCol.push(jobId);
							this.$nextTick(() => {
								this.$refs[`notice${jobId}`][0].showNotice(jobId);
							});
						}
						this.spinShow = false;
					});
			},
			handleFinish() {
				// 异步下载结束后刷新
				this.loadData();
				this.currentPage = 1;
			},
			handleExport(id) {
				this.$Modal.confirm({
					title: '操作提示',
					content: `确定进行导出操作`,
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						return this.$ajax.post(this.$api.couponsReel, {
								type_id: id
							})
							.then(response => {
								const res = response.data;
								if (res.code) {
									this.$refs.myTable.exportCsv({
										filename: '导出券号',
										columns: res.data.columns,
										data: res.data.items
									});
								}
							});
					}
				});
			},
			handleVolumeCode(row) {
				this.spinShow = true;
				return this.$ajax.post(this.$api.couponsVolumeCode, {
						type_id: row.type_id
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
							var jobId = res.data;
							// 打开异步提示组件
							this.jobIdCol.push(jobId);
							this.$nextTick(() => {
								this.$refs[`notice${jobId}`][0].showNotice(jobId);
							});
						}
						this.spinShow = false;
					});
			},
			handleCouponsRollCode(row) {
				this.spinShow = true;
				return this.$ajax.post(this.$api.couponsRollCode, {
						type_id: row.type_id,
						store_id: row.store_id
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.$Modal.confirm({
								render(h) {
									return h('div', [
										h('img', {
											style: {
												width: '200px',
												height: '200px',
												display: 'block',
												margin: '0 auto'
											},
											attrs: {
												src: res.data
											}
										})
									])
								}
							})
						}
						this.spinShow = false;
					});
			}
		}
	}
</script>

<style lang="less" scoped>
	.coupon-list {
		.coupon-list_import {
			margin-right: 10px;
		}

		.list_page_fixed {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>
