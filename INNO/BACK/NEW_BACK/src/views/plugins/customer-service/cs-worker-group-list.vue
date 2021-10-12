<style lang="less">
.cs-worker-group-list{
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
	<div class="cs-worker-group-list">
		<Card v-show="showList">
			<div class="table-topbar">
		    	<Row style="display:flex;">
			        <Col style="flex:1 1 0%;">
			        	<Form ref="formSearch" :model="formSearch" inline>
					        <FormItem>
					        	状态：
			        			<Select v-model="formSearch.status" placeholder="状态" style="width:110px" clearable>
			        				<Option value="-1">全部状态</Option>
			        				<Option value="1">启用</Option>
									<Option value="0">关闭</Option>
							    </Select>
					        </FormItem>
			        		<FormItem>
					            <Input v-model="formSearch.searchq" :style="{width: ( formSearch.searchq != '' ? 300 : 250) +'px'}" placeholder="" clearable search enter-button
								    @on-search="searchPage"
								    @on-clear="searchPage"
								    @keydown.native.enter.prevent ="searchPage">
					            	<Select v-model="formSearch.searchqType" slot="prepend" style="width:80px">
							            <Option value="name">名称</Option>
							        </Select>
					            </Input>
					        </FormItem>
			        	</Form>
			        </Col>
			        <Col style="width:210px;text-align: right;">
						
			        	<Button v-if="canCreate" type="info" icon="md-add" @click="addWorker">添加分组</Button>
                <Button @click="initData" shape="circle" title="刷新列表"></Button>
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
		<csWorkerGroupForm ref="cs-worker-group-form" @on-close="closeUserForm" @on-save="onFormSave"></csWorkerGroupForm>

	</div>
</template>

<script>
import csWorkerGroupForm from './cs-worker-group-form';

export default {
	name: 'csWorkerGroupList',
    components: {
		csWorkerGroupForm,
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

			statusList:[],
			canCreate: false,
			canExport: false,

			// 搜索表单
			formSearch:{
				searchq:'',
				searchqType: 'name',
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
			// ajax 请求获取初始化数据，然后动态更新下面数据源
			this.$ajax.post( this.$api.csWorkerGroupList, {
				isInit: 1,
			})
			.then( (response) => {
				this.tableLoading = false;
				var res = response.data;

				if( res.code ){

					this.initColumn( res );

					// 初始化表数据
					this.data = res.data.items;
					this.pageTotal = Number( res.data.total );
					this.pageSize = Number( res.data.pageSize );
					this.canCreate = res.data.canCreate;
					this.canExport = res.data.canExport;

					this.statusList =  res.data.statusList;
				}

			});

		},
    initColumn( res ){
      this.columns = res.data.columns;
      const _this = this;

      // 是否允许主动接入
      this.columns[ (this.columns.length-3) ]['render'] = (h, params) => {
      	const row = params.row;
      	const color = row.can_join == 1 ? 'success' : 'error';
      	const text = row.can_join == 1 ? '允许' : '不允许';

      	return h('Tag', {
      		props: {
      			color: color
      		},
      	}, text);
      };

      // 状态标识
      this.columns[ (this.columns.length-2) ]['render'] = (h, params) => {
      	const row = params.row;

      	return h('i-switch',{
      						props: {
      						    size: 'large',
      							value: Number( row.status ),
      							'true-value': 1,
      							'false-value': 0,
      							'before-change'() {
      								return new Promise((resolve) => {
      									if( row.handle.edit ){
      										if( row.status == 1 ){
      											_this.$Modal.confirm({
      												title: '操作提示',
      												content: '确定关闭分组吗？',
      												okText: '确定',
      												cancelText: '取消',
      												onOk: () => {
      													_this.updateStatus(params.index, row);
      												}
      											});
      										}
      										else{
      											_this.updateStatus(params.index, row);
      										}
      									}
      									else{
      										_this.$Message.error('权限不足');
      									}
      								});
      							},
      						},
      					},[
      						h('span', {
      							slot: 'open'
      						}, '启用'),
      						h('span', {
      							slot: 'close'
      						}, '关闭')
      					]);
                
      };

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
      							this.editWorker(params.index, params.row)
      						}
      					}
      				}, '编辑') ]
      			)
      		);

      	}

      	return h('div',buttons);
      }
    },
		// 切换分页
		changePage ( page ) {

			this.tableLoading = true;
			// ajax 请求获取数据，然后动态更新下面数据源
			this.$ajax.post( this.$api.csWorkerGroupList, {
				searchq: this.formSearch.searchq,
				searchqType: this.formSearch.searchqType,
				page:page,
			})
			.then( (response) => {
				var res = response.data;
				if( res.code ){
					// 初始化表数据
					this.data = res.data.items;
					this.pageTotal = Number( res.data.total );
					this.pageSize = Number( res.data.pageSize );
				}

				this.tableLoading = false;
			});

		},
		// 搜索
		searchPage(){
			this.tableLoading = true;
			// ajax 请求获取数据，然后动态更新下面数据源
			this.$ajax.post( this.$api.csWorkerGroupList, {
				searchq: this.formSearch.searchq,
				searchqType: this.formSearch.searchqType,
				status: this.formSearch.status,
			})
			.then( (response) => {
				var res = response.data;
				if( res.code ){
					// 初始化表数据
					this.data = res.data.items;
					this.pageTotal = Number( res.data.total );
					this.pageSize = Number( res.data.pageSize );
				}

				this.tableLoading = false;
			});
		},
		// 编辑按钮
		editWorker(index,row){
			this.showList = false;
			this.$refs['cs-worker-group-form'].openModal(row);
		},
		// 添加客服分组
		addWorker(){
			this.showList = false;
			this.$refs['cs-worker-group-form'].openModal( {id:0} );
		},
		// 回调关闭表单
		closeUserForm( obj ){
			this.showList = true;
		},
		// 添加用户成功
		onFormSave(){
			// 重新刷新页面
			this.initData();
		},
		// 直接在列表更新状态
		updateStatus(index, row){
			this.tableLoading = true;
			var status = (row.status == 0 ? 1 : 0);

			// ajax 保存数据
			this.$ajax.post( this.$api.csWorkerGroupStatus , {
				id : row.id,
				status: status,
			})
			.then( (response) => {
				this.tableLoading = false;
				var res = response.data;

				if( res.code ){
					// 保存成功
					this.$Message.success( res.message );

					// 更新列表的值
					this.$set( this.data[ index ], 'status', status );
				}
			});
		},
	},
	mounted () {
	    this.init();
	},
	// 缓存后的事件
	activated(){

	}
}
</script>
