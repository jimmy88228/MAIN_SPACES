<template>
	<div class="user-unbind">
		<Card>
			<Alert show-icon>
				什么是会员解绑?
				<Icon type="ios-bulb-outline" slot="icon"></Icon>
				<template slot="desc">解除会员与店员绑定关系，可以根据店员查询已绑关系的会员，或者根据会员名称模糊查询出会员做解绑</template>
			</Alert>
			<div class="search">
				<Form inline>
					<FormItem label="所属店铺" :label-width="80">
						<store-select :data="storeData" type="radio" @del-tag="handleStoreTag">
							<Button type="dashed" @click="handleStoreSelect">选择所属店铺</Button>
						</store-select>
					</FormItem>
					<FormItem label="导购" :label-width="50">
						<staff-select :data="staffData" type="radio" @del-tag="handleStaffTag">
							<Button type="dashed" @click="handleStaffSelect" :disabled="!storeId">选择解绑导购</Button>
						</staff-select>
					</FormItem>
					<FormItem>
						<Input placeholder="请输入会员卡号或会员昵称" v-model="condition.searchq" style="width: 260px;" clearable search
						 enter-button @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent />
					</FormItem>
				</Form>
			</div>
			<Table :loading="tableLoading" :columns="tableColumns" :height="tableHeight" :data="tableData" ref="myTable"
			 @on-selection-change="handleSelect"></Table>
			<div v-show="pageTotal" class="list_page">
				<Row type="flex">
					<Col style="width:90px">
						<Button type="primary" @click="handleUnbind">解除绑定</Button>
					</Col>
					<Col style="flex:1 1 0%;text-align: right;">
						<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
						@on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
					</Col>
				</Row>
			</div>
		</Card>
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>

<script>
	import PageHelper from '@/libs/page-helper.js';
	import Mixin from './mixin.js';
	import StoreSelect from '@/views/my-components/list-component/index-edit';
	import StaffSelect from '@/views/my-components/list-component/index-edit';

	export default {
		data() {
			return {
				storeData: [],
				staffData: [],
				storeId: 0,
				staffId: 0,
				condition: {
					staff_id: 0,
					common_store: 0,
					searchq: ''
				},
				selectedData: [],
				spinShow: false,
				currentType: 'select' //select代表选择导购/search代表搜索
			}
		},
		mixins: [PageHelper, Mixin],
		components: {
			StoreSelect,
			StaffSelect
		},
		methods: {
			onLoadData(page, data) {
				let params = Object.assign({}, data, this.currentType == 'select' ? {
					staff_id: this.condition.staff_id,
					common_store: this.condition.common_store
				} : {
					searchq: this.condition.searchq,
					staff_id: this.condition.staff_id,
					common_store: this.condition.common_store,
					store_id: this.storeId
				});
				return this.$ajax.post(this.$api.memberUnbindList, params)
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
						}
					});
			},
			searchPage() {
				this.currentType = 'search';
				this.loadData();
			},
			handleStoreTag(data) {
				this.storeData = data;
				if (this.storeData.length === 0) {
					// 清空店铺
					this.storeId = 0;
					this.staffData = [];
					this.staffId = 0;
				}
			},
			handleStoreSelect() {
				this.$selectContent({
					mode: 'store',
					type: 'radio',
					data: this.storeData,
					getList: (data) => {
						this.storeData = data;
						this.storeId = this.storeData[0].id;
					}
				});
			},
			handleStaffTag(data) {
				this.staffData = data;
				if (this.staffData.length === 0) {
					// 清空店员
					this.staffData = [];
					this.staffId = 0;
				}
			},
			handleStaffSelect() {
				if (!this.storeId) {
					this.$Message.error('请先选择所属店铺!');
					return false;
				}
				this.$selectContent({
					mode: 'staff',
					type: 'radio',
					data: this.staffData,
					extraAddtion: {
						store_id: this.storeId
					},
					getList: (data) => {
						this.staffData = data;
						this.staffId = this.staffData[0].id;
					}
				});
			},
			handleSelect(selection) {
				this.selectedData = selection;
			},
			handleUnbind() {
				if (this.selectedData.length === 0) {
					this.$Message.error('请选择解绑的会员!');
					return false;
				}
				this.$Modal.confirm({
					title: '解绑提示',
					content: '确定解绑该会员吗?',
					onOk: () => {
						this.spinShow = true;
						return this.$ajax.post(this.$api.memberRelieve, {
								user_id: this.selectedData.map(item => item.user_id)
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
			}
		},
		watch: {
			staffId(nV) {
				if (!nV) return false;
				this.condition.staff_id = nV;
				this.currentType = 'select';
				this.loadData();
			}
		}
	}
</script>

<style lang="less">
	.user-unbind {
		.ivu-input-icon {
			right: 50px;
		}

		.right {
			float: right;
		}
	}
</style>
