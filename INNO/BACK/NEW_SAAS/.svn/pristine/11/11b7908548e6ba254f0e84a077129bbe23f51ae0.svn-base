<template>
	<div class="integral-goods-list">
		<Card>
			<Row type="flex">
				<Col style="flex:1 1 0%;">
					<SearchForm ref="search" @on-search="searchPage"></SearchForm>
				</Col>
				<Col style="text-align: right;width:160px;">
					<Button type="info" icon="md-add" @click="createActivity" v-if="canCreate.add">创建活动</Button>
					<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
				</Col>
			</Row>
			<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
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
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
			</div>
		</Card>
	</div>
</template>
<script>
	import SearchForm from './search-form';
	import Mixin from './mixin.js';
	import PageHelper from '@/libs/page-helper.js';
	import GoodsSort from './goods-list-sort';

	export default {
		components: {
			SearchForm,
			GoodsSort
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
				}
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
	}
</style>
