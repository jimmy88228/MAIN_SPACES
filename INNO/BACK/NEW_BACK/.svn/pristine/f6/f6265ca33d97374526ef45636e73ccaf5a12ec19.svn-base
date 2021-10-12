<style lang="less" scoped>
	.group-store {
		background-color: #fff;
		padding: 1rem;
	}
</style>

<template>
	<div class="group-store">
		<div>
			<div class="table-topbar">
				<Row>
					<Col span="6">
					<Button type="primary" @click="modalShow=true" :disabled="!storeSelection.length">转移店铺所属分组</Button>
					<Button type="primary" @click="batchRemove" :disabled="!storeSelection.length">删除店铺</Button>
					</Col>
					<Col span="18" style="text-align:right;margin-bottom:10px;">
					<Input v-model="searchStr" placeholder="店铺名称 模糊查询" clearable style="width:180px"></Input>
					<Button type="info" @click="changePage(1)">搜索</Button>
					</Col>
				</Row>
			</div>
			<Table ref="storeList" @on-selection-change="handleSelectChange" :loading="tableLoading"
				:height="tableHeight" :columns="columns" :data="tableData">
				<template slot-scope="{ row, index }" slot="handle">
					<a @click="remove(index,row)">删除</a>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts"
					@on-change="e => changePage(e)" @on-page-size-change="ps => handlePageSize(ps)" show-elevator
					show-total show-sizer></Page>
			</div>
		</div>
		<Modal title="转移店铺" width="350" v-model="modalShow" @on-ok="transferGroup">
			<div>
				<Select v-model="transGroupId">
					<Option :value="item.id" v-if="item.id!=groupId" :key="item.id" v-for="item in groupList">
						{{item.group_name}}</Option>
				</Select>
			</div>
		</Modal>
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>

<script type="text/javascript">
	import Cookies from 'js-cookie';
	import util from '@/libs/util.js';
	import PageHelper from '@/libs/page-helper.js';
	import storeMixin from './store-mixin.js';
	export default {
		mixins: [PageHelper, storeMixin],
		components: {},
		data() {
			return {
				// tableHeight: 600,
				// tableLoading: false,
				spinShow: false,
				// columns: [],
				// data: [],
				// pageSize: 15,
				// pageTotal: 0,
				// page: 1,
				searchStr: '',
				// editIndex: -1,
				groupId: 0,
				groupList: [],
				formItem: {
					id: 0,
					group_name: '',
					is_enabled: '1'
				},
				ruleValidate: {
					group_name: [{
						required: true,
						message: '分组名称不能为空',
						trigger: 'blur'
					}],
				},
				modalShow: false,
				storeSelection: [],
				transGroupId: '0'
			}
		},
		methods: {
			initParams() {
				let query = this.$route.query || {};
				this.groupId = parseInt(query.group_id) || 0
			},
			onLoadData(page, extraData) {
				if (!this.groupId) return new Promise((rs, rj) => rj());
				return this.$ajax.post(this.$api.storeNavigationGroupStore, {
					id: this.groupId,
					...extraData
				}).then((response) => {
					console.log("response", response);
					let res = response.data || {};
					if (res.code) {
						let data = res.data || {};
						this.data = data;
						this.canCreate = data.canCreate || {};
					}
				})
			},
			changePage(page, init = 0) {
				// 动态计算表高度
				this.tableHeight = document.body.clientHeight - 200;
				this.tableLoading = true;
				util.ajax.post(util.apiHost + '/storeNavGroup/getGroupStore', {
					page: page,
					pageSize: this.pageSize,
					searchStr: this.searchStr,
					groupId: this.groupId,
					isInit: init
				}).then((response) => {
					this.tableLoading = false;
					let data = response.data.data;
					if (init == 1) {
						console.log(data.columns)
						this.columns = data.columns;
						this.groupList = data.groupList;
					}
					this.page = data.page;
					this.pageSize = data.pageSize;
					this.pageTotal = data.total;
					this.data = data.items;
				})
			},
			batchRemove() {
				let store_id = new Array();
				for (var i in this.storeSelection) {
					store_id[i] = this.storeSelection[i]['store_id'];
				}
				console.log(store_id);
				this.tableLoading = true;
				util.ajax.post(util.apiHost + '/storeNavGroup/removeStore', {
					groupId: this.groupId,
					store_id: store_id,
				}).then((response) => {
					this.tableLoading = false;
					if (response.data.code == 1) {
						this.$Message.success('删除成功！');
						this.changePage(1);
					} else {
						this.$Message.error(response.data.msg);
					}
				})
			},
			remove(index, item) {
				this.tableLoading = true;
				util.ajax.post(util.apiHost + '/storeNavGroup/removeStore', {
					groupId: item.group_id,
					store_id: item.store_id
				}).then((response) => {
					this.tableLoading = false;
					if (response.data.code == 1) {
						this.$delete(this.data, index);
						this.$Message.success('删除成功！');
					} else {
						this.$Message.error(response.data.msg);
					}
				})
			},
			handleSelectChange(data) {
				this.storeSelection = data;
				console.log(data);
			},
			transferGroup() {
				let store_id = new Array();
				if (this.transGroupId <= 0) {
					this.$Message.error('请选择转移目标分组');
					return false;
				}
				for (var i in this.storeSelection) {
					store_id[i] = this.storeSelection[i]['store_id'];
				}
				if (store_id.length <= 0) {
					this.$Message.error('请选择店铺！');
					return false;
				}
				this.tableLoading = true;
				util.ajax.post(util.apiHost + '/storeNavGroup/transGroup', {
					groupId: this.transGroupId,
					store_ids: store_id,
				}).then((response) => {
					this.tableLoading = false;
					if (response.data.code == 1) {
						this.$Message.success('转移成功！');
						this.changePage(1);
					} else {
						this.$Message.error(response.data.msg);
					}
				})
			}
		},
		mounted() {
			// this.groupId = this.$route.query.group_id;
			// this.groupId = parseInt(this.groupId);
			// if (this.groupId<=0 || isNaN(this.groupId)) {
			// 	this.$router.push('/store/group-list');
			// 	return false;
			// }
			// console.log(this.groupId);
			this.initParams();
			this.loadData();
		}
	}
</script>
