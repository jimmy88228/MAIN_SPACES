<template>
	<Modal v-model="modalShow" width="800">
				<p slot="header" style="color:#f60;">
						商品查询
				</p>
				<div class="m-bottom-10">
						<Input
						  v-model="searchForm.search"
						  style="width:200px;"
						  placeholder="货号,如多货号以逗号隔开"
						  clearable
						  search
						  enter-button
						  @on-search="searchPage"
						  @on-clear="searchPage"
						  @keydown.native.enter.prevent="searchPage">
						</Input>
				</div>
				<div>
					<Table :loading="tableLoading" :height="tableHeight - 100" :columns="tableColumns" :data="tableData" ref="myTable">
						<template slot-scope="{ row, index }" slot="is_enable">
						  <Icon :size="25" type="ios-close-circle-outline" :color="row.is_enable ? '#8E1A1B' : '#2BDC70'"/>
						</template>
						<template slot-scope="{ row, index }" slot="goods_num">
						  <p>查询到{{row.goods_num}}个</p>
						</template>
					</Table>
				</div>
				<div slot="footer">
						<Button type="primary" @click="modalShow = false">确定</Button>
				</div>
		</Modal>
</template>
<script>
	import PageHelper from '@/libs/page-helper.js';
	import mixins from './mixins.js';
	export default{
		components:{
			
		},
		mixins:[PageHelper, mixins],
		data(){
			return {
				modalShow: false,
				searchForm: {
					search: ''
				}
			}
		},
		methods:{
			showModal(){
				this.modalShow = true;
			},
			searchPage(){
				let searchForm = this.searchForm || {};
				if(!searchForm.search){
					this.$Message.error("请输入货号");
					return;
				}
				this.loadData();
			},
			onLoadData(data, extaData){
				return this.$ajax.post(this.$api.fullReductionSearchActivityGoods,{
					...this.searchForm,
					...extaData
				}).then((resp)=>{
					let res = resp.data || {};
					if(res.code){
						let data = res.data || [];
						let items = []
						if(!(data instanceof Array)){
							for(let i in data){
								items.push(data[i]);
							}
						} else {
							items = data;
						}
						this.data = {
							items: items,
							total: items.length
						}
					}
					console.log('res',res);
				});
			}
		}
	}
</script>