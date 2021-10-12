<template>
	<div>
		<Form ref="formSearch" :model="formSearch" :label-width="68">
			<Row>
				<Col span="5">
					<FormItem label="商品分类">
						<Cascader style="width:150px" class="basic_cascader" :data="sortCatList" v-model="currentSort" placeholder="请选择分类" filterable
							change-on-select transfer :clearable="isClear" ref="catRef" :render-format="renderSort" @on-change="selectSortCat"></Cascader>
					</FormItem>	
				</Col>
				<Col span="10" >
					<FormItem label="同步时间">
						<date-select ref="dateSelect"  @sT="handleOnSaleTimeBegin" @eT="handleOnSaleTimeEnd"/>
					</FormItem>		
				</Col>
				<Col span="5">
					<Input  v-model="formSearch.searchq" placeholder="请输入商品货号或名称" clearable search enter-button
					@on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent="searchPage"></Input>
				</Col>	
			</Row>
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
					start_time: '',
					end_time: '',

				},
				sortCatList: [],
				currentSort: [],
				isClear: true,
			}
		},
		methods: {
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
			handleOnSaleTimeBegin(value){
				this.formSearch.start_time=value;
			},
			handleOnSaleTimeEnd(value){
				this.formSearch.end_time=value;
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

</style>
