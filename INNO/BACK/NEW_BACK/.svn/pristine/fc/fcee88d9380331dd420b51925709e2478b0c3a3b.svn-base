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
						title="确定还原该优惠券么?"
						@on-ok="recycleCoupon(row)">
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
				title="确定批量还原优惠券么?"
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
		<editCoupon ref="editCoupon" @search="search"></editCoupon>
	</div>
</template>
<script>
	import editCoupon from '../edit-coupon.vue';
	import SearchForm from './search-form.vue';
	import Mixin from './mixin.js';
	import PageHelper from '@/libs/page-helper.js';
	export default{
		mixins:[PageHelper, Mixin],	
		components:{
			SearchForm,
			editCoupon
		},
		data(){
			return {
				formSearch: {
					searchq: "",
				},
				canCreate: {},
				selectCoupon: [],
			}
		},
		mounted(){
			this.loadData();
		},
		methods:{
			onLoadData (page, data) {
			  return this.$ajax.post(this.$api.MatrixPrizeBonusList, {
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
			addCoupon(row){
				this.$refs["editCoupon"].showModal(row)
			},
			recycleCoupon(row){
				if(!row.type_id) return;
				return this.$ajax.post(this.$api.MatrixPrizeBonusRemove, {
					type_id: row.type_id,
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
				this.selectCoupon = selection;
			},
			handleBatch(row){
				if(this.selectCoupon.length == 0) return;
				let type_ids = [];
				for(let i = 0; i < this.selectCoupon.length; i++){
					type_ids.push(this.selectCoupon[i].type_id);
				}
				return this.$ajax.post(this.$api.MatrixPrizeBonusBatch, {
					type_ids: type_ids,
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