<template>
	<Modal v-model="isShowModal"  width="800" @on-ok="confirmStock">
		<div slot="header">
			{{title}}&nbsp;&nbsp;<p>商品货号: <span class="name">{{goodsData.goods_sn}}</span></p>
		</div>
		<Form ref="formDynamic" :model="formDynamic">
		  <Table :columns="storeColumns" :data="tableData" :loading="tableLoading" ref="myTable" @on-selection-change="selectChange">
		    <template slot-scope="{ row, index }" slot="setStock">
		       <InputNumber v-model="row.inventory" :min="0" @on-change="e => changeInventory('inventory', index, e)"/>
		    </template>
		    <template slot-scope="{ row, index }" slot="handle">
		      <template >
		        <span><a @click="handleDel(row.product_id, index)">删除</a></span>
		      </template>
		    </template>
		  </Table>
		</Form>
		<div class="footer m-top-10">
		  <div class="action">
		    <Checkbox v-model="checkAll"></Checkbox>
		    <Select v-model="checkType" class="basic_select">
		      <Option :value="1">当前页全选</Option>
		      <Option :value="2">全部页全选</Option>
		    </Select>
		    <span>已选{{selectData.length}}项</span>>&nbsp;&nbsp;
		    <template>
		      <span>批量操作</span>&nbsp;
		      <Poptip  placement="bottom-end">
		        <Button type="primary">批量设置库存</Button>
		        <div slot="title">批量操作</div>
		        <div slot="content">
		          <InputNumber v-model="batchValue" placeholder="请输入值" v-show="currentBatchType !== 'enable'"/>
		          <i-switch :true-value="1" :false-value="0" v-model="batchBoolValue" v-show="currentBatchType === 'enable'">
		            <span slot="open">是</span>
		            <span slot="close">否</span>
		          </i-switch>
		          <div style="margin-top: 10px;text-align: right;">
		            <Button type="primary" @click="handleBatchConfirm">确定</Button>
		          </div>
		        </div>
		      </Poptip>
		    </template>
		  </div>
		  <div v-show="pageTotal" class="list_page">
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
	</Modal>
</template>
<script>
	import PageHelper from '@/libs/page-helper.js';
	export default{
		mixins: [PageHelper],
		props: {
			title: {
				type: String,
				default(){
					return "编辑店铺"
				}
			},
			storeColumns:{
				type: Array,
				default(){
					return [
						{
							type: 'selection',
							width: 60
						},
						{
							title: '关联店铺',
							key: 'store_name'
						},
						{
							title :'店铺最大可售库存',
							slot: 'setStock'
						}
					]
				}
			}
		},
		components:{},
		data(){
			return {
				isShowModal: false,
				checkIndeter: true,
				goodsData: {},
				formDynamic: {
					pageData: []
				},
				checkType: 1,
				showBatchInput: false,
				selectData: [],
				currentBatchType: '',
				batchValue: 0,
				batchBoolValue: 0
			}
		},
		computed:{
			checkAll:{
				get(){
					let selectData = this.selectData || [];
					if(selectData.length > 0 && selectData.length == this.data.items.length){
						return true
					} else {
						return false
					}
				},
				set(val){
					let items = this.data.items || [];
					for(let i = 0; i < items.length; i++){
						this.$set(this.data.items[i], '_checked', val)
					}
					this.selectData = val ? this.data.items : [];
				}
			},
			ids(){
				let selectData = this.selectData || [];
				let ids = [];
				for(let i = 0; i < selectData.length; i++){
					ids.push(selectData[i].id);
				}
				return ids || [];
			}
		},
		methods:{
			showModal({goodsData, relationStores}){
				this.isShowModal = true;
				this.goodsData = JSON.parse(JSON.stringify(goodsData)) || {};
				relationStores = JSON.parse(JSON.stringify(relationStores)) || [];
				this.data = {
					items: relationStores || [],
					total: relationStores.length
				}
				let items = this.data.items || [];
				for(let i = 0; i < items.length; i++){
					this.$set(this.data.items[i], '_checked', false);
				}
			},
			selectChange(selection){
				this.selectData = selection;
				let items = this.data.items || [];
				this.$nextTick(()=>{
					for(let i = 0; i < items.length; i++){
						let val = false;
						if(this.ids.indexOf(items[i].id) != -1){
							val = true;
						}
						this.$set(this.data.items[i], '_checked', val);
					}
				})
			},
			changeInventory(key, index, even){
				this.$set(this.data.items[index], key, even);
			},
			handleBatchConfirm(){
				if(this.selectData.length == 0){
					this.$Message.warning("请勾选可设置店铺");
					return;
				}
				let items = this.data.items;
				for(let i = 0; i < items.length; i++){
					let id = items[i].id || 0;
					if(id){
						if(this.ids.indexOf(id) != -1){
							this.$set(this.data.items[i], 'inventory', this.batchValue);
						}
					}
					
				}
			},
			confirmStock(){
				this.$emit("success", {
					goodsData: this.goodsData,
					storeData: this.data.items || []
				});
			}
		}
	}
</script>
<style>
	
</style>