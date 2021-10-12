<template>
	<div class="goods-search-form">
		<Form ref="formSearch" :model="formSearch" :label-width="68" >
			<div class="flex f-just-between">
				<FormItem :label-width="0" class="search_wrapper flex">
					<Input class="goods-search_input"  v-model="formSearch.searchq" placeholder="请输入商品货号或名称" clearable search enter-button
					@on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent="searchPage"></Input>
					<a @click="showExtra" class="search_btn flex">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a>
				</FormItem>
				<FormItem>
					<slot name="btns"></slot>
				</FormItem>
			</div>
			<transition name="fade">
				<Row v-show="isShowExtra">
					<Col span="6">
						<FormItem label="商品状态">
							<Select v-model="formSearch.sale_state" style="width:150px">
								<Option  value="0" >全部</Option>
								<Option  value="1" >上架</Option>
								<Option  value="2" >下架</Option>
							</Select>
						</FormItem>
					</Col>
					<Col span="6">
						<FormItem label="同步状态">
							<Select v-model="formSearch.sync_state" style="width:150px">
								<Option  value="0" >全部</Option>
								<Option  value="1" >同步</Option>
								<Option  value="2" >不同步</Option>
							</Select>
						</FormItem>
					</Col>
					<Col span="8">
						<FormItem label="商品分类">
							<Cascader class="basic_cascader" :data="sortCatList" v-model="currentSort" placeholder="请选择所有分类" filterable
							change-on-select transfer :clearable="isClear" ref="catRef" :render-format="renderSort" @on-change="selectSortCat"></Cascader>
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem label="修改时间" :label-width="70" class="date-form-item">
							<date-select ref="dateSelect" @sT="handleUpdateTimeBegin" @eT="handleUpdateTimeEnd"/>
						</FormItem>	
					</Col>
					<Col span="12">
						<FormItem label="同步时间" :label-width="70" class="date-form-item">
							<date-select ref="dateSelect" @sT="handleSyncTimeBegin" @eT="handleSyncTimeEnd"/>
						</FormItem>	
					</Col>
					<Col span="24">
						<div style="margin-bottom: 10px;text-align: center;">
							<Button type="primary" @click="searchPage">搜索</Button>
							<a @click="showExtra" class="search_btn" style="margin-left:10px">
								<Icon type="ios-arrow-up" /> 收起选项</a>
						</div>
					</Col>
				</Row>
			</transition>
		</Form>
	</div>
</template>

<script>
	import DateSelect from '@/views/my-components/date-select/index.vue';
	/**
	 * 商品列表 搜索框
	 */
	const defaultItem = {
		value: '0',
		label: '顶级分类',
		children: []
	};
	 
	export default {
		components: {
			DateSelect
		},
		name: 'searchForm',
		props: {
			catList: {
				type: Array,
				default () {
					return [];
				}
			},
		},
		data() {
			return {
				// 搜索表单
				formSearch: {
					searchq: '',
					cat_id: 0,
					sale_state:'0',
					sync_state:'0',
					start_time: '',
					end_time: '',
					sync_start_time: '',
					sync_end_time: '',

				},
				sortCatList: [],
				currentSort: [],
				isClear: true,
				isShowExtra: false,
			}
		},
		methods: {
			showExtra() {
				this.isShowExtra = !this.isShowExtra;
			},
			// 搜索按钮触发
			searchPage() {
				this.$emit('on-search',this.formSearch);
			},
			renderSort(labels) {
				return labels.slice(labels.length - 1).join('/');
			},
			handleSortList(context) {
				const format = context.map(item => {
					return {
						value: item.cat_id || item.vcat_id,
						label: item.cat_name || item.vcat_name,
						parent_id: item.parent_id,
						children: item.children.length ? this.handleSortList(item.children) : []
					}
				});
				return format;
			},
			selectSortCat(value, selectedData) {
				if (selectedData.length == 0) {
					this.formSearch.cat_id = 0;
				} else {
					this.formSearch.cat_id = selectedData[selectedData.length - 1].value;
				}
				
			},
			handleUpdateTimeBegin(value){
				this.formSearch.start_time=value;
			},
			handleUpdateTimeEnd(value){
				this.formSearch.end_time=value;
			},
			handleSyncTimeBegin(value){
				this.formSearch.sync_start_time=value;
			},
			handleSyncTimeEnd(value){
				this.formSearch.sync_end_time=value;
			},
		},
		watch: {
			catList: {
				handler(nV) {
					this.sortCatList = this.handleSortList([...nV]);
					this.sortCatList.unshift(defaultItem);
				},
				immediate: true
			}
		},
	}
</script>

<style lang="less">
	.goods-search-form {
		.search_wrapper {
			.ivu-form-item-content {
				display: flex;
				align-items: center;
			}

			.search_btn {
				display: inline-block;
				margin-left: 10px;
			}
		}

		.ivu-form-item {
			margin-bottom: 10px;
			margin-right: 10px;
		}

		.ivu-input-icon-clear {
			right: 50px;
		}

		.goods-search_input {
			width: 320px;

			.goods-search_select {
				width: 90px;
			}
		}

		.ivu-form-item-label {
			text-align: left;
		}
	}
</style>
