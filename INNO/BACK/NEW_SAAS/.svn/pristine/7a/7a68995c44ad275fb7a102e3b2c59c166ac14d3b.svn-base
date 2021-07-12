<template>
	<div>
		
		<Row type="flex" style="margin-bottom:10px;">
			<Col style="flex:1 1 0%;">
				
			</Col>
			<Col style="width:150px;text-align: right;">
				<Button type="info" icon="md-add" @click="createItem">新增区域</Button>
				<Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
			</Col>
		</Row>
		
		<Table ref="myTable" :loading="tableLoading" :columns="columns" :height="tableHeight" :data="data"></Table>
		<div v-show="pageTotal" class="list_page list_page_fixed">
			<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" @on-change="changePage"></Page>
		</div>
		
		<!--编辑框-->
		<tabAreaForm ref="tab-area-form" @on-success="onSaveSuccess"></tabAreaForm>
		
	</div>
</template>
	
<script>
import tabAreaForm from './tab-area-form.vue';
	
/**
 * 云店设置 - 隔离店铺管理
 */	
export default {
	components: {
		tabAreaForm
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
			this.$ajax.post(this.$api.visitAreaList, {
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
			
			// 关联地区
			this.columns[1].render = (h, params) => {
				var tag = [];
				for (var i in params.row.get_region) {
					tag.push(
						h('Tag', {
							props: {
								color: "green"
							},
						}, params.row.get_region[i]['province_name'] + ' ' 
						+ ( params.row.get_region[i]['city_name'] != null ? params.row.get_region[i]['city_name'] : '') )
					);
				}
				return h('div',{
					style:{
						padding: '5px 0',
					}
				}, tag);
			};
			
			// 推荐门店
			this.columns[2].render = (h, params) => {
				var tag = [];
				for (var i in params.row.get_store) {
					tag.push(
						h('Tag', {
							props: {
								color: ( params.row.get_store[i]['cancel'] == 'N' ? "blue" : "red" )
							},
						}, params.row.get_store[i]['store_name'] + ' ' + params.row.get_store[i]['store_code'] + ' '
						+ ( params.row.get_store[i]['cancel'] == 'Y' ? "（店铺已关闭）" : "" ) )
					);
				}
				return h('div',{
					style:{
						padding: '5px 0',
					}
				}, tag);
			};
				
			// 操作按钮
			this.columns[(this.columns.length - 1)].render = (h, params) => {
				var buttons = [];
				
				// 编辑
				buttons.push(
					h('span', {
							attrs: {
								title: '编辑'
							}
						},
						[h('span', {
							class: 'table-handle-button',
							on: {
								click: () => {
									this.editItem(params.row);
								}
							}
						}, '编辑')]
					)
				);
				
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
				content: '确定移除区域吗？删除后不能恢复！',
				okText: '确定移除',
				cancelText: '取消',
				onOk: () => {
					// ajax提交数据
					this.tableLoading = true;
					this.$ajax.post(this.$api.visitAreaRemove, {
						id: row.id,
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
		createItem(){
			this.openModal({});
		},
		editItem( row ){
			this.openModal( row );
		},
		openModal( row ){
			this.$refs['tab-area-form'].openModal( row );
		},
		changePage( page ){
			this.tableLoading = true;
			// ajax 请求获取数据
			this.$ajax.post(this.$api.visitAreaList, {
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
		},
		// 保存成功的回调
		onSaveSuccess(){
			this.init();
		}
	},
	mounted() {
		this.init();
	},
}	
</script>
	
<style lang="less">
.tab-area-setting{
	
}
</style>