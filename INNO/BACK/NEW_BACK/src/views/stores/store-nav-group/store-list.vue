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
				<div class="flex f-just-between m-bottom-15">
					<div>
						<Button type="primary" @click="modalShow=true" :disabled="!storeSelection.length">转移店铺所属分组</Button>
						<Button type="primary" @click="batchRemove" :disabled="!storeSelection.length">删除店铺</Button>
					</div>
					<div>
						<Input
								class=""
								style="width:230px"
								v-model="searchq"
								placeholder="店铺名称 模糊查询"
								clearable
								search
								enter-button
								@on-search="loadData()"
								@on-clear="loadData()"
								@keydown.native.enter.prevent="loadData()"></Input>
					</div>
				</div>
			</div>
			<Table ref="storeList" @on-selection-change="handleSelectChange" :loading="tableLoading"
				:height="tableHeight" :columns="columns" :data="tableData">
				<template slot-scope="{ row, index }" slot="action">
					<Poptip
						transfer
						confirm
						title="确定删除该店铺？"
						v-if="row.handle['store-remove']"
						@on-ok="remove(index, row)">
						<a>删除</a>
					</Poptip>
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
					<Option :value="id"  :key="id" v-if="id != groupId" v-for="(item, id) in groupList">
						{{item}}
					</Option>
				</Select>
			</div>
		</Modal>
	</div>
</template>

<script type="text/javascript">
	import PageHelper from '@/libs/page-helper.js';
	import storeMixin from './store-mixin.js';
	export default {
		mixins: [PageHelper, storeMixin],
		components: {},
		data() {
			return {
				searchq: '',
				groupId: 0,
				groupList: {},
				modalShow: false,
				storeSelection: [],
				transGroupId: '0'
			}
		},
		computed:{
			selectStoreIds(){
				let store_ids = [];
				for (let i = 0; i < this.storeSelection.length; i++) {
					store_ids[i] = this.storeSelection[i]['id'];
				}
				return store_ids;
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
					searchq: this.searchq,
					...extraData
				}).then((response) => {
					console.log("response", response);
					let res = response.data || {};
					if (res.code) {
						let data = res.data || {};
						this.data = data;
						let group_data = data.group_data || {};
						group_data[0] = '请选择分组';
						this.groupList = group_data;
						this.canCreate = data.canCreate || {};
					}
				})
			},
			remove(index, item) {
				this.tableLoading = true;
				return this.$ajax.post(this.$api.storeNavigationGroupStoreRemove, {
					group_id: item.group_id,
					id: item.id
				}).then((response) => {
					this.tableLoading = false;
					let res = response.data || {};
					if (res.code) {
						let data = res.data || {};
						this.$delete(this.tableData, index);
						this.$Message.success('删除成功！');
					} else {
						this.$Message.error(res.message);
					}
				})
			},
			batchRemove() {
				if(!(this.selectStoreIds.length > 0)) {
					this.$Message.warning("请选择删除的店铺！");
					return;
				}
				this.tableLoading = true;
				return this.$ajax.post(this.$api.storeNavigationGroupStoreBatch,{
					group_id: this.groupId,
					shift_group_id: 0,
					type: 2,
					ids: this.selectStoreIds,
				}).then((response) => {
					this.tableLoading = false;
					let res = response.data || {};
					if (res.code == 1) {
						this.$Message.success('删除成功！');
						this.loadData();
					} else {
						this.$Message.error(res.message);
					}
				})
			},
			transferGroup() {
				let store_id = new Array();
				if (this.transGroupId <= 0) {
					this.$Message.error('请选择转移目标分组');
					return false;
				}
				if(!(this.selectStoreIds.length > 0)) {
					this.$Message.warning("请选择店铺！");
					return false;
				}
				this.tableLoading = true;
				this.$ajax.post(this.$api.storeNavigationGroupStoreBatch, {
					type: 1,
					shift_group_id: this.transGroupId,
					group_id: this.groupId,
					ids: this.selectStoreIds,
				}).then((response) => {
					this.tableLoading = false;
					if (response.data.code == 1) {
						this.$Message.success('转移成功！');
						this.loadData();
					} else {
						this.$Message.error(response.data.msg);
					}
				})
			},
			handleSelectChange(data) {
				this.storeSelection = data;
			}
		},
		mounted() {
			this.initParams();
			this.loadData();
		}
	}
</script>
