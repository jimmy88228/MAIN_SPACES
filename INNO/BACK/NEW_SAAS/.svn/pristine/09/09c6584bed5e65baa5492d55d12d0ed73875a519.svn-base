<template>
	<div>
		<Row type="flex" style="margin-bottom:10px;">
			<Col style="flex:1 1 0%;">
				
			</Col>
			<Col style="width:150px;text-align: right;">
				<Button type="info" icon="md-add" @click="addStore">加入店铺</Button>
				<Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
			</Col>
		</Row>
		
		<Table ref="myTable" :loading="tableLoading" :columns="columns" :height="tableHeight" :data="data"></Table>
		<div v-show="pageTotal" class="list_page list_page_fixed">
			<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" @on-change="changePage"></Page>
		</div>
		
		<!--店铺选择器-->
		<storeSelect ref="store-select" @on-ok="onStoreOk"></storeSelect>
		
	</div>
</template>
	
<script>
import storeSelect from '@/views/my-components/store-select/store-select';
	
/**
 * 云店设置 - 隔离店铺管理
 */	
export default {
	components: {
		storeSelect
	},
	data() {
		return {
			tableLoading: false,
			columns: [],
			data:[],
			tableHeight: 500,
			pageTotal: 0,
			pageSize: 20,
			currentPage: 1,
		}
	},
	methods: {
		// 初始化
		init() {
			this.tableHeight = document.body.clientHeight - 250;
			
			this.tableLoading = true;
			this.$ajax.post(this.$api.visitStoreList, {
				isInit: 1
			})
			.then(response => {
				this.tableLoading = false;
				const res = response.data;
				if (res.code) {
					this.initColumns(res);
					
					this.data = res.data.items;
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
				
				return h('div', buttons);
			};	
		},
		// 删除项
		removeItem( index, row ){
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定移除隔离店铺吗？',
				okText: '确定移除',
				cancelText: '取消',
				onOk: () => {
					// ajax提交数据
					this.tableLoading = true;
					this.$ajax.post(this.$api.visitStoreRemove, {
						store_id: row.store_id,
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
			for(var i in items){
				this.storeSave( items[i] );
			}
		},
		storeSave( item ){
			// ajax提交数据
			this.tableLoading = true;
			this.$ajax.post(this.$api.visitStoreAdd, {
				store_id: item.id,
				store_name: item.name,
				store_code: item.code,
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
			this.$ajax.post(this.$api.visitStoreList, {
				page: page,
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
		}
	},
	mounted() {
		this.init();
	},
}	
</script>
	
<style lang="less">
.tab-store-setting{
	
}
</style>