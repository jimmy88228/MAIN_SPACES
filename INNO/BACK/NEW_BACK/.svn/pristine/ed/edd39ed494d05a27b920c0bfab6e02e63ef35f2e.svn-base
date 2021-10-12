<style lang="less">
.plugins-group-list{
	.table-topbar{
        .ivu-form-item{
            margin-bottom: 10px;
        }
		.ivu-input-icon-clear{
			right:50px;
	    }
    }

	.table-bg-image{
		background-size:100% auto !important;
	}
}
</style>

<template>
	<div class="plugins-group-list">
		<Card>
			<!--列表搜索框-->
			<div class="table-topbar">
				<Row type="flex">
					<Col style="flex:1 1 0%;">
						<Form ref="formSearch" :model="formSearch" inline>
							<FormItem>
								状态：
								<Select v-model="formSearch.status" style="width:110px" clearable>
									<Option value="-1">不限</Option>
									<Option value="1">启用</Option>
									<Option value="2">关闭</Option>
								</Select>
							</FormItem>
							<FormItem>
								<Input v-model="formSearch.searchq" style="width:180px;" placeholder="名称 模糊查询" clearable search enter-button
									@on-search="searchPage"
									@on-clear="searchPage"
									@keydown.native.enter.prevent ="searchPage"></Input>
							</FormItem>
						</Form>
					</Col>
					<Col style="width:160px;text-align: right;">
						<Button v-if="canCreate" type="info" icon="md-add" @click="openModal({},true)">创建产品</Button>
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

	    <!--添加表单-->
	    <groupForm ref="group-form" @on-success="onFormSuccess"></groupForm>

	</div>
</template>

<script>
/**
 * 课程列表
 */
import groupForm from './plugins-group-form';
import groupSort from './plugins-group-list-sort';

export default {
	components: {
		groupForm,
		groupSort,
	},
	props: {

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
			isInit: 0,
			sortColumn: '',
			sortVal: '',
			pluginsTree: [],

			// 搜索表单
        	formSearch:{
				status: -1,
        		searchq:'',
        	},
    	}
   	},
   	methods: {
    	// 初始化
    	init(){
			// 动态计算表高度
        	this.tableHeight = document.body.clientHeight - 200;

			this.isInit = 1;
        	// 初始化列表
        	this.initData();
    	},
    	// 初始化 加载数据，（不会自动加载，而是父组件触发加载）
    	initData(){
    		this.tableLoading = true;

			var params = {
				isInit: this.isInit,
				sortColumn: this.sortColumn,
				sortVal: this.sortVal,
			};

			// ajax 请求获取初始化数据，
        	this.$ajax.post( this.$api.pluginsGroupList, params)
    		.then( (response) => {
    			this.tableLoading = false;
    			var res = response.data;

    			if( res.code ){
    				// 初始化表
    				this.initTable( res );

    				// 初始化表数据
    				this.data = res.data.items;
					this.pluginsTree = res.data.pluginsTree;

    				this.pageTotal = Number( res.data.total );
    				this.pageSize = Number( res.data.pageSize );
    				this.canCreate = res.data.canCreate;
    			}

			});
    	},
    	// 表头初始化
    	initTable( res ){
    		this.columns = res.data.columns;
        const _this = this;

			// 排序
			this.columns[ (this.columns.length-4) ]['render'] = (h, params) => {
			    return h( groupSort, {
			        props: {
			            sort: params.row.sort,
			            itemId: params.row.id,
			        },
					on: {
						'on-success': () => {
							// 触发重新加载列表
							this.initData();
						},
					}
			    });
			};

    		// 状态标识
			this.columns[ (this.columns.length-3) ]['render'] = (h, params) => {
                const row = params.row;

                return h('i-switch',{
                					props: {
                					    size: 'large',
                						value: Number( row.status ),
                						'true-value': 1,
                						'false-value': 2,
                						'before-change'() {
                							return new Promise((resolve) => {
                								_this.updateStatus(params.index, row);
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
                    	h('span', {
                    			attrs:{
                    				title:'编辑'
                    			}
                    		},
		                    [ h('span', {
		                        class:'table-handle-button',
		                        on: {
		                            click: () => {
		                                this.editItem(params.index, params.row)
		                            }
		                        }
		                    },'编辑') ]
                    	)
                   	);

                }

                return h('div',buttons);
           };

    	},
    	// 切换分页
        changePage ( page ) {

			this.tableLoading = true;
            // ajax 请求获取数据，然后动态更新下面数据源
        	this.$ajax.post( this.$api.pluginsGroupList , {
				isInit: 0,
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
        	this.$ajax.post( this.$api.pluginsGroupList, {
				isInit: 0,
        		searchq: this.formSearch.searchq,
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
        // 打开模态框
        openModal (row){
        	this.$refs['group-form'].openModal(row, this.pluginsTree);
        },
        // 编辑
        editItem(index, row){
        	this.modalEditIndex = index;
        	this.openModal (row);
        },
        // 添加成功的回调
        onFormSuccess( res ){
			// 重新加载页面
			this.initData();
        },
        // 直接在列表更新状态
        updateStatus(index, row){
        	var status = ( row.status == 1 ? 2 : 1 );
        	if( status == 2 ){
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定关闭分组吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.updateStatusAction( row, status );
					},
				});
			}
			else{
				this.updateStatusAction( row, status );
			}
        },
		updateStatusAction( row, status ){
			this.tableLoading = true;
			// ajax 保存数据
			this.$ajax.post( this.$api.pluginsGroupStatus , {
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
			        this.init();
			    }
			});
		}
    },
    watch: {

    },
    mounted () {
    	this.init();
    },
}
</script>
