<template>
	<div class="goods-coupons-activity">
		<Card v-show="showList">
			<Row type="flex">
				<Col style="flex:1 1 0%;">
					<SearchForm ref="search" @on-search="searchPage"></SearchForm>
				</Col>
				<Col style="width:150px;text-align: right;" class="btn-group">
					<Button type="info" icon="md-add" @click="createActivity" v-if="canCreate.add">添加活动</Button>
					<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
				</Col>
			</Row>
			<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData"
				ref="myTable">
				<template slot-scope="{ row }" slot="stime">
					<p>{{row.stime | initDate}}</p>
					<p>{{row.stime | initTime}}</p>
				</template>
				<template slot-scope="{ row }" slot="etime">
					<p>{{row.etime | initDate}}</p>
					<p>{{row.etime | initTime}}</p>
				</template>
				<template slot-scope="{ row }" slot="handle">
					<span v-show="row.handle.edit" @click="bindingStore(row)"><a>设置适用门店</a></span>
					<Divider type="vertical" v-show="row.handle.edit" />
					<span v-show="row.handle.goods" @click="handleBinding(row)"><a>绑定商品</a></span>
					<Divider type="vertical" v-show="row.handle.goods" />
					<span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
					<Divider type="vertical" v-show="row.handle.edit" />
					<span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除活动吗？')"><a>删除</a></span>
					<Divider type="vertical" v-show="row.handle.remove" />
					<span v-show="row.handle.copy" @click="handleCopy(row)"><a>复制</a></span>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts"
					@on-change="e => changePage(e)" @on-page-size-change="ps => handlePageSize(ps)" show-elevator
					show-total show-sizer></Page>
			</div>
		</Card>
		
		<!--绑定门店组件-->
		<BindingStore ref="binding-store" @on-back="onBack"></BindingStore>
	</div>
</template>
<script>
	import SearchForm from './search-form';
	import Mixin from './mixin.js';
	import PageHelper from '@/libs/page-helper.js';
	import BindingStore from './binding/binding-store.vue';
	
	export default {
		components: {
			SearchForm,
			BindingStore
		},
		data() {
			return {
				showList: true,
				canCreate: {},
				condition: {
					searchq: ''
				}
			}
		},
		mixins: [Mixin, PageHelper],
		methods: {
			onLoadData(page, data) {
				let params = Object.assign({}, data, this.condition);
				return this.$ajax.post(this.$api.cloudGoodsCouponsActivityList, params)
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
					name: 'cloud-goods-coupons-activity-add'
				});
			},
			editItem(row) {
				this.$router.push({
					name: 'cloud-goods-coupons-activity-edit',
					params: {
						id: row.id
					}
				});
			},
			// 绑定门店
			bindingStore(row){
				this.showList = false;
				this.$refs['binding-store'].openModal( row.id );
			},
			onBack(){
				this.showList = true;
				this.loadData();
			},
			// 绑定商品
			handleBinding(row) {
				//绑定
				this.$router.push({
					name: 'goods-coupons-activity-goods',
					params: {
						id: row.id
					}
				});
			},
			handleCopy(row) {
				return this.$ajax.post(this.$api.cloudGoodsCouponsActivityCopy, {
					id: row.id
				}).then(() => {
					this.loadData();
				});
			},
			onDelItem(row) { //delItem
				return this.$ajax.post(this.$api.cloudGoodsCouponsActivityRemove, {
					id: row.id
				});
			}
		},
		mounted() {
			this.loadData();
		}
	}
</script>

<style lang="less" scoped>
	.goods-coupons-activity {
		.btn-group {
			text-align: right;
		}
	}
</style>
