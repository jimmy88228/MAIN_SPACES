<template>
	<div class="goods-recommend-activity">
		<Card v-show="showList">
			<Row type="flex">
				<Col style="flex:1 1 0%;">
					<SearchForm ref="search" @on-search="searchPage"></SearchForm>
				</Col>
				<Col style="width:160px;text-align: right;">
					<Button type="info" icon="md-add" @click="createActivity" v-if="canCreate.add">添加活动</Button>
					<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
				</Col>
			</Row>
			<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
				<template slot-scope="{ row }" slot="stime">
					<template v-if="row.time_type == 0">
						<p>时间不限</p>
					</template>
					<template v-else>
						<p>{{row.stime | initDate}}</p>
						<p>{{row.stime | initTime}}</p>
					</template>
				</template>
				<template slot-scope="{ row }" slot="etime">
					<template v-if="row.time_type == 0">
						<p>时间不限</p>
					</template>
					<template v-else>
						<p>{{row.etime | initDate}}</p>
						<p>{{row.etime | initTime}}</p>
					</template>
				</template>
				<template slot-scope="{ row }" slot="handle">
					<span v-show="row.handle.edit" @click="bindingStore(row)"><a>设置适用门店</a></span>
					<Divider type="vertical" v-show="row.handle.edit" />
					<span v-show="row.handle.goods" @click="handleBinding(row)"><a>绑定商品</a></span>
					<Divider type="vertical" v-show="row.handle.goods && row.handle.edit" />
					<span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
					<Divider type="vertical" v-show="row.handle.edit && row.handle.remove" />
					<span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除活动吗？')"><a>删除</a></span>
					<Divider type="vertical" v-show="row.handle.remove && row.handle.copy" />
					<span v-show="row.handle.copy" @click="handleCopy(row)"><a>复制</a></span>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
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
				return this.$ajax.post(this.$api.cloudGoodsRecommendList, params)
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
					name: 'cloud-goods-recommend-add'
				});
			},
			editItem(row) {
				this.$router.push({
					name: 'cloud-goods-recommend-edit',
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
				this.$router.push({
					name: 'cloud-goods-recommend-activity-goods',
					params: {
						id: row.id
					}
				});
			},
			handleCopy(row) {
				return this.$ajax.post(this.$api.cloudGoodsRecommendCopy, {
					id: row.id
				}).then(() => {
					this.loadData();
				});
			},
			onDelItem(row) {
				return this.$ajax.post(this.$api.cloudGoodsRecommendRemove, {
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
	.goods-recommend-activity {
		.btn-group {
			text-align: right;
		}
	}
</style>
