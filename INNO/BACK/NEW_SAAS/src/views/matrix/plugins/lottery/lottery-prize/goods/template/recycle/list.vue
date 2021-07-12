<style>
	
</style>
<template>
	<div>
		<SearchForm 
		:canCreate="canCreate"
		@search="search"
		></SearchForm>
		<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable" @on-selection-change="changeSelect">
		  <template slot-scope="{ row }" slot="handle">
				<div class="v-lines">
					<template v-if="row.handle.remove">
						<Poptip
						:transfer="true"
						confirm
						title="确定还原该实物么?"
						@on-ok="recycleGoods(row)">
						<a >还原</a>
						</Poptip>&nbsp;<span class="v-line">|&nbsp;</span>
					</template>
					</div>
		  </template>
			
		</Table>
		<div v-show="pageTotal" class="list_page flex f-just-between">
			<div>
				<Poptip
				:transfer="true"
				confirm
				title="确定批量还原实物么?"
				@on-ok="handleBatch()" v-if="canCreate.batch">
				<Button type="primary" >批量还原</Button>
				</Poptip>
			</div>
		  <Page
		    :total="pageTotal"
		    :page-size="pageSize"
		    :current="currentPage"
		    :page-size-opts="pageSizeOpts"
		    @on-change="e => changePage(e)"
		    @on-page-size-change="ps => handlePageSize(ps)"
		    show-elevator
		    show-total
		    show-sizer></Page>
		</div>
	</div>
</template>
<script>
	import SearchForm from './search-form.vue';
	import Mixin from './mixin.js';
	import PageHelper from '@/libs/page-helper.js';
	export default{
		mixins:[PageHelper, Mixin],	
		components:{
			SearchForm,
		},
		data(){
			return {
				formSearch: {
					searchq: "",
				},
				canCreate: {},
				selectGoods: [],
			}
		},
		mounted(){
			this.loadData();
		},
		methods:{
			onLoadData (page, data) {
			  return this.$ajax.post(this.$api.MatrixPrizeGoodsList, {
					...this.formSearch,
					is_delete: 1,
					...data
				})
			  .then(response => {
			    const res = response.data;
			    if (res.code) {
			      this.data = res.data;
			      this.canCreate = res.data && res.data.canCreate;
			    }
			  });
			},
			search(formSearch){
				this.formSearch = formSearch || {};
				this.loadData();
			},
			addGoods(row){
				this.$refs["editGoods"].showModal(row)
			},
			recycleGoods(row){
				if(!row.goods_id) return;
				return this.$ajax.post(this.$api.MatrixPrizeGoodsRemove, {
					goods_id: row.goods_id,
					is_delete: 1 // 1还原， 2移除
				})
				.then(response => {
				  const res = response.data;
				  if (res.code) {
						this.$Message.success(res.message);
				    this.loadData();
				  } else {
						this.$Message.error(res.message);
					}
				});
			},
			changeSelect(selection, row){
				this.selectGoods = selection;
			},
			handleBatch(row){
				if(this.selectGoods.length == 0) return;
				let goods_ids = [];
				for(let i = 0; i < this.selectGoods.length; i++){
					goods_ids.push(this.selectGoods[i].goods_id);
				}
				return this.$ajax.post(this.$api.MatrixPrizeGoodsBatch, {
					goods_ids: goods_ids,
					is_delete: 1 // 1还原， 2移除
				})
				.then(response => {
				  const res = response.data;
				  if (res.code) {
						this.$Message.success(res.message);
				    this.loadData();
				  } else {
						this.$Message.error(res.message);
					}
				});
			},
		}
	}
</script>