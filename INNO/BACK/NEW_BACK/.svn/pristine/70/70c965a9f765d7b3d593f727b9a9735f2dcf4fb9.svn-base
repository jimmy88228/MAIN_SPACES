<style lang="less">
.page-cat-list{
	.table-topbar{
	    .ivu-form-item{
	        margin-bottom: 10px;
	    }
	    .ivu-input-icon-clear{
	    	right:50px;
	    }
	}
}
</style>

<template>
	<div class="page-cat-list">
		<Card v-show="showList">
			<div class="table-topbar">
		    	<Row style="display:flex;">
			        <Col style="flex:1 1 0%;">
			        	<Form ref="formSearch" :model="formSearch" inline>
			        		<FormItem>
					            <Input v-model="formSearch.searchq" 
								:style="{width:'250px'}" 
								placeholder="搜索分类名称" clearable search enter-button 
								@on-search="searchPage"
								@on-clear="searchPage"
								@keydown.native.enter.prevent ="searchPage" />
					        </FormItem>
			        	</Form>
			        </Col>
			        <Col style="width:210px;text-align: right;">
			        	<Button v-if="canCreate" type="info" icon="md-add" @click="addCat">添加分类</Button>
						<Button icon="md-refresh" @click="initData" shape="circle" title="刷新列表"></Button>
			        </Col>
			    </Row>	
			</div>
			
			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
			<div v-show="pageTotal>0" class="table-pager-footer">
		        <div style="float: right;">
		            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
		        </div>
		    </div>
		</Card>
		
		<!--表单组件-->
		<pageCatForm ref="page-cat-form" @on-close="closeForm" @on-save="onFormSave"></pageCatForm>
		
	</div>
</template>

<script>
import pageCatForm from './page-cat-form';

export default {
	name: 'pageCatList',
    components: {
		pageCatForm,
    },
    data () {
        return {
			// 列表
			columns:[],
			data:[],
			
			tableHeight: 500,
			tableLoading: false,
			pageTotal: 0,
			pageSize: 20,
			
			canCreate: false,

			// 搜索表单
			formSearch:{
				searchq:'',
			},

			showList: true,
		}
	},
	methods: {
		init(){
			this.initData();
		},
		// 初始化方法
		initData() {
			// 动态计算表高度
			this.tableHeight = document.body.clientHeight - 200;
			
			this.tableLoading = true;
			// ajax 请求获取初始化数据
			this.$ajax.post( this.$api.goodsPageCatList, {
				isInit: 1,
			})
			.then( (response) => {
				this.tableLoading = false;
				var res = response.data;
				
				if( res.code ){
					
					this.columns = res.data.columns;

					// 操作按钮
					this.columns[ (this.columns.length-1) ]['render'] = (h, params) => {
						var buttons = [];
						if( params.row.handle.edit ){
							// 编辑按钮
							buttons.push( 
								h('span',
									{	
										attrs:{
											title:'编辑'
										}
									},
									[ h('span', {
										class:'table-handle-button',
										on: {
											click: () => {
												this.editItem(params.row);
											}
										}
									}, '编辑') ]
								) 
							);
		
						}
						
						if( params.row.handle.remove && params.row.get_pages_count == 0 ){
							// 编辑按钮
							buttons.push( 
								h('span',
									{	
										attrs:{
											title:'删除'
										}
									},
									[ h('span', {
										class:'table-handle-button',
										on: {
											click: () => {
												this.removeItem(params.row);
											}
										}
									}, '删除') ]
								) 
							);
								
						}
						return h('div',buttons);
					}
					
					// 初始化表数据
					this.data = res.data.items;
					this.pageTotal = Number( res.data.total );
					this.pageSize = Number( res.data.pageSize );
					this.canCreate = res.data.canCreate;
				}
			});
	
		},
		// 切换分页
		changePage ( page ) {
			
			this.tableLoading = true;
			// ajax 请求获取数据
			this.$ajax.post( this.$api.goodsPageCatList, {
				searchq: this.formSearch.searchq,
				page:page,
			})
			.then( (response) => {
				this.tableLoading = false;
				var res = response.data;
				if( res.code ){
					// 初始化表数据
					this.data = res.data.items;
					this.pageTotal = Number( res.data.total );
					this.pageSize = Number( res.data.pageSize );
				}
			});
			
		},
		// 搜索
		searchPage(){
			this.tableLoading = true;
			// ajax 请求获取数据
			this.$ajax.post( this.$api.goodsPageCatList, {
				searchq: this.formSearch.searchq,
			})
			.then( (response) => {
				this.tableLoading = false;
				var res = response.data;
				if( res.code ){
					// 初始化表数据
					this.data = res.data.items;
					this.pageTotal = Number( res.data.total );
					this.pageSize = Number( res.data.pageSize );
				}
			});
		},
		// 编辑按钮
		editItem(row){
			this.showList = false;
			this.$refs['page-cat-form'].openModal(row);
		},
		// 删除按钮
		removeItem(row){
			this.$Modal.confirm({
			    title: '操作提示',
			    content: '确定删除微页面分类吗？只有未关联任何页面的分类才会删除成功。',
			    okText: '确定删除',
			    cancelText: '取消',
			    onOk: () => {
					this.tableLoading = true;
					// ajax 请求获取数据
					this.$ajax.post( this.$api.goodsPageCatRemove, {
						id: row.id,
					})
					.then( (response) => {
						this.tableLoading = false;
						var res = response.data;
						if( res.code ){
							this.$Message.success( res.message );
							// 初始化表数据
							this.initData();
						}
					});
				},
			});
		},
		// 添加客服分组
		addCat(){
			this.showList = false;
			this.$refs['page-cat-form'].openModal( {id:0} );
		},
		// 回调关闭表单
		closeForm( obj ){
			this.showList = true;
		},
		// 添加用户成功
		onFormSave(){
			// 重新刷新页面
			this.initData();
		},
	},
	mounted () {
	    this.init();
	},
}
</script>