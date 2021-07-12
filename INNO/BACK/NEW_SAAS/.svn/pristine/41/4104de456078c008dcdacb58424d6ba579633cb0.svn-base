<template>
	<Card v-if="showModal">
		<Row type="flex" style="margin-bottom:10px;">
			<Col style="flex:1 1 0%;">
				<Tooltip content="返回" placement="bottom-start">
					<Icon type="ios-arrow-dropleft" size="26" @click="goBack" style="cursor: pointer;"/>
					<span style="margin-left:30px">单品推荐活动 - 关联店铺列表</span>
				</Tooltip>
			</Col>
			<Col style="width:180px;text-align: right;">
				<Button type="info" icon="md-add" :disabled="!canCreate" @click="addStore">加入关联店铺</Button>
				<Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
			</Col>
		</Row>
		
		<Table ref="myTable" :loading="tableLoading" :columns="columns" :height="tableHeight" :data="data"></Table>
		<div v-show="pageTotal" class="list_page list_page_fixed">
			<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" @on-change="changePage"></Page>
		</div>
		
		<!--店铺选择器-->
		<storeSelect ref="store-select" @on-ok="onStoreOk"></storeSelect>
		
	</Card>
</template>
	
<script>
import storeSelect from '@/views/my-components/store-select/store-select';
	
/**
 * 绑定店铺组件
 */	
export default {
	name:"bindingStore",
	components: {
		storeSelect
	},
	data() {
		return {
			showModal: false,
			currActivityId: 0,
			tableLoading: false,
			columns: [],
			data:[],
			tableHeight: 500,
			pageTotal: 0,
			pageSize: 20,
			currentPage: 1,
			canCreate: false,
		}
	},
	methods: {
		// 初始化
		openModal( activityId ) {
			
			this.showModal = true;
			this.currActivityId = activityId;
			
			this.tableHeight = document.body.clientHeight - 210;
			this.init();
		},
		init(){
			this.tableLoading = true;
			this.$ajax.post(this.$api.cloudGoodsRecommendStoreList, {
				isInit: 1,
				activity_id: this.currActivityId,
			})
			.then(response => {
				this.tableLoading = false;
				const res = response.data;
				if (res.code) {
					this.initColumns(res);
					
					this.data = res.data.items;
					this.canCreate = res.data.canCreate;
					this.pageTotal = Number(res.data.total);
					this.pageSize = Number(res.data.pageSize);
				}
			});
		},
		initColumns( res ){
			this.columns = res.data.columns;
			
			// 操作按钮
			this.columns[(this.columns.length - 1)].render = (h, params) => {
				var buttons = [];
				
				// 删除
				if( params.row.handle.remove ){
					buttons.push(
						h('span', {
								attrs: {
									title: '删除'
								}
							},
							[h('span', {
								class: 'table-handle-button',
								on: {
									click: () => {
										this.removeItem(params.index, params.row)
									}
								}
							}, '删除')]
						)
					);
				}
				
				return h('div', buttons);
			};	
		},
		// 删除项
		removeItem( index, row ){
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定移除关联店铺吗？',
				okText: '确定移除',
				cancelText: '取消',
				onOk: () => {
					// ajax提交数据
					this.tableLoading = true;
					this.$ajax.post(this.$api.cloudGoodsRecommendStoreRemove, {
						store_id: row.store_id,
						activity_id: this.currActivityId,
					})
					.then(response => {
						this.tableLoading = false;
						const res = response.data;
						if (res.code) {
							this.$Message.success( res.message );
							
							this.$delete( this.data, index);
							this.pageTotal--;
						}
					});
				},
			});
		},
		addStore(){
			this.$refs['store-select'].openModal( [], 'checkbox' );
		},
		// 选门店的组件的 回调
		onStoreOk( items ){
			let storeIds = [];
			items.map((item)=>{
				storeIds.push( item.id );
				return item;
			});
			
			// ajax提交数据
			this.tableLoading = true;
			this.$ajax.post(this.$api.cloudGoodsRecommendStoreAdd, {
				store_ids: storeIds,
				activity_id: this.currActivityId,
			})
			.then(response => {
				this.tableLoading = false;
				const res = response.data;
				if (res.code) {
					this.$Message.success( res.message );
					
					// 刷新列表
					this.init();
				}
			});
		},
		changePage( page ){
			this.tableLoading = true;
			// ajax 请求获取数据
			this.$ajax.post(this.$api.cloudGoodsRecommendStoreList, {
				page: page,
				activity_id: this.currActivityId,
			})
			.then((response) => {
				this.tableLoading = false;
				var res = response.data;
				if (res.code) {
					// 初始化表数据
					this.data = res.data.items;
					this.pageTotal = Number(res.data.total);
					this.pageSize = Number(res.data.pageSize);
				}
			});
		},
		goBack(){
			this.showModal = false;
			this.$emit('on-back');
		},
	},
	mounted() {
		
	},
}	
</script>
	
<style lang="less">
.page-store-setting{
	
}
</style>