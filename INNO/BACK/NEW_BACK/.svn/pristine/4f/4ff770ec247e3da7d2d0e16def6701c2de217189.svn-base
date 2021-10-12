<template>
	<div class="brand-list">
		<Card>
			<Row type="flex">
				<Col style="flex:1 1 0%;">
					<SearchForm ref="search" @on-search="searchPage"></SearchForm>
				</Col>
				<Col style="width:300px;text-align: right;">
					<Button type="info" icon="md-add" @click="handleImport">批量导入</Button>
					<Button type="success" icon="md-add" @click="openModal({})" v-if="canCreate.add">添加商品品牌</Button>
					<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
				</Col>
			</Row>
			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData" ref="myTable">
				<template slot-scope="{ row }" slot="name">
					<div class="img_list_wrap">
						<div class="img_fixed">
							<img :src="row.goods_brand_image" v-if="row.goods_brand_image" :alt="row.goods_brand_name" v-viewer />
							<img src="@rs/images/default-img.jpg" :alt="row.goods_brand_name" v-viewer v-else></img>
						</div>
						<span class="name">{{row.goods_brand_name}}</span>
					</div>
				</template>
				<template slot-scope="{ row }" slot="createTime">
					<p>{{row.created_at_format | initDate}}</p>
					<p>{{row.created_at_format | initTime}}</p>
				</template>
				<template slot-scope="{ row, index }" slot="handle">
					<span v-show="row.handle.edit" @click="editBrand(index, row)"><a>编辑</a></span>
					<Divider type="vertical" v-show="row.handle.edit && row.handle.remove" />
					<span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除商品品牌吗？')"><a>删除</a></span>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
			</div>
		</Card>
		<BrandForm ref="brandForm" @on-success="onFormSuccess"></BrandForm>
		<BatchImport ref="batchImport" @on-success="onImportSuccess"></BatchImport>
	</div>
</template>
<script>
	import SearchForm from './search-form';
	import Mixin from './mixin.js';
	import BrandForm from './brand-form';
	import BatchImport from '@/views/my-components/batch-import/batch-import';
	import PageHelper from '@/libs/page-helper.js';

	export default {
		components: {
			SearchForm,
			BrandForm,
			BatchImport
		},
		data() {
			return {
				canCreate: {},
				condition: {
					searchq: '',
					type: 1
				}
			}
		},
		mixins: [Mixin, PageHelper],
		methods: {
			clearOptions() {
				this.condition = {
					searchq: '',
					type: 1
				};
				this.$refs.search.clearOptions();
			},
			onLoadData(page, data) {
				let params = Object.assign({
					isInit: 1
				}, data, this.condition);
				return this.$ajax.post(this.$api.ShopGoodsBrandList, params)
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
			openModal(row) {
				this.$refs.brandForm.setData(row).show();
			},
			editBrand(index, row) {
				this.openModal(row);
			},
			onDelItem(row) {
				return this.$ajax.post(this.$api.ShopGoodsBrandRemove, {
					goods_brand_id: row.goods_brand_id
				});
			},
			handleImport() {
				this.$refs.batchImport.openModal(this.canCreate, this.$api.ShopGoodsBrandUpload, this.$api.ShopGoodsBrandDownload);
			},
			onImportSuccess() {
				this.loadData();
			}
		},
		mounted() {
			console.log(this.$route)
			this.loadData();
		}
	}
</script>

<style lang="less" scoped>
	.brand-list {

	}
</style>
