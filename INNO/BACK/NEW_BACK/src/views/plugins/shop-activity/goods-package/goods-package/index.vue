<template>
	<div class="goods-package-list">
		<div>
			<SearchForm ref="search" @on-search="searchPage"></SearchForm>
			<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
				<template slot-scope="{ row }" slot="package_bg_image">
					<div class="img_list_wrap">
						<div class="img_fixed">
							<img :src="row.package_bg_image" v-if="row.package_bg_image" v-viewer />
							<img src="@rs/images/default-img.jpg" v-viewer v-else></img>
						</div>
					</div>
				</template>
				<template slot-scope="{ row }" slot="goods_thumb2">
					<div class="img_list_wrap">
						<div class="img_fixed">
							<img :src="row.goods_thumb2" v-if="row.goods_thumb2" v-viewer />
							<img src="@rs/images/default-img.jpg" v-viewer v-else></img>
						</div>
					</div>
				</template>
				<template slot-scope="{ row }" slot="is_enabled">
					<Tag type="dot" :color="row.is_enabled === '1' ? 'success' : (row.is_enabled === '2') ? 'warning' : 'error'">
						{{row.is_enabled === '1' ? '启用' : (row.is_enabled === '2') ? '过期' : '关闭'}}
					</Tag>
				</template>
				<template slot-scope="{ row }" slot="g_sort">
					<goods-list-sort :sort="row.g_sort" :goods-id="row.goods_id" :package-id="row.package_id" @edit-sort="loadData"></goods-list-sort>
				</template>
				<template slot-scope="{ row }" slot="handle">
					<span @click="editItem(row)"><a>编辑套餐</a></span>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
			</div>
		</div>
	</div>
</template>
<script>
	import SearchForm from './search-form';
	import Mixin from './mixin.js';
	import PageHelper from '@/libs/page-helper.js';
	import goodsListSort from './goods-list-sort';

	export default {
		components: {
			SearchForm,
			goodsListSort
		},
		data() {
			return {
				canCreate: {},
				condition: {
					searchq: '',
					type: 0
				}
			}
		},
		mixins: [Mixin, PageHelper],
		methods: {
			onLoadData(page, data) {
				let params = Object.assign({}, data, this.condition);
				return this.$ajax.post(this.$api.packageGoodsList, params)
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.canCreate = res.data && res.data.canCreate;
							this.$emit('get-can-create', this.canCreate);
						}
					});
			},
			searchPage(searchData) {
				this.condition = searchData;
				this.loadData();
			},
			editItem(row) {
				this.$router.push({
					name: 'goods-package-edit',
					params: {
						id: row.package_id
					}
				})
			}
		}
	}
</script>
