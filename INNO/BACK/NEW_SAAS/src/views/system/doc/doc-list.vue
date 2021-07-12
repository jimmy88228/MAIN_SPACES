<style lang="less">
.doc-list{

}
</style>

<template>
    <div class="doc-list">
    	<Card v-show="showDocList">
	    	<!--列表搜索框-->
			<div class="table-topbar">
		    	<Row type="flex">
			        <Col style="flex:1 1 0%;">
			        	<!--搜索表单-->
						<searchForm ref="search-form" :catTree="catTree" @on-search="searchPage"></searchForm>
			        </Col>
			        <Col style="width:160px;text-align: right;">
			        	<Button type="info" icon="md-add" @click="openModal({})">添加文档</Button>
						<Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
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

		<!--文档编辑表单-->
	    <docForm ref="doc-form" @on-success="formSaveCallback" @on-close="formClose"></docForm>

		<!--文档详情查看-->
		<docInfoModal ref="doc-info-modal"></docInfoModal>
    </div>
</template>

<script>
import docInfoModal from './doc-info-modal.vue';

/**
 * 文档列表
 */
import searchForm from './search-form';
import docForm from './doc-form';
import docSort from './doc-sort';

export default {
    components: {
    	searchForm,
    	docForm,
		docSort,
		docInfoModal,
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

        	modalEditIndex:0,
        	showDocList: true,
        	catTree: [],
        	toolbars: [],
        }
    },
    computed: {
    },
    methods: {
    	/**
    	 * @desc 初始化方法
    	 */
        init () {
        	// 动态计算表高度
        	this.tableHeight = document.body.clientHeight - 200;

        	this.initData();
        },
        // 初始化 加载数据，（不会自动加载，而是父组件触发加载）
    	initData(){
    		this.tableLoading = true;
			// ajax 请求获取初始化数据
        	this.$ajax.post( this.$api.docList, {
        		isInit: 1,
        	})
    		.then( (response) => {
    			this.tableLoading = false;
    			var res = response.data;

    			if( res.code ){
    				// 初始化表
    				this.initTable( res );

    				// 初始化表数据
    				this.data = res.data.items;
    				this.pageTotal = Number( res.data.total );
    				this.pageSize = Number( res.data.pageSize );
    				this.canCreate = res.data.canCreate;
    				this.catTree = res.data.catTree;
    				this.toolbars = res.data.toolbars;
    				this.authorList = res.data.authorList;

					this.$nextTick(()=>{
						this.$refs['search-form'].initData( this.catTree );
					});

    			}

			});
    	},
    	// 表头初始化
    	initTable( res ){

    		this.columns = res.data.columns;
        const _this = this;

			// 图文标题
			this.columns[ 0 ]['render']= (h, params) => {

				return h('Row', {
			    		props: {
			    			type:"flex",
			    			justify:"start",
			    		}
			    	},[
			    	h('Col', {style:{}}, '' ),
			        h('Col', {
			        	style:{
			        		padding:'8px 5px 5px 5px',
			        		flex: '1 1 0%',
			        	}},
			        	[h('div', {
			            	style:{
			            		fontWeight: 'blod',
			            		overflow: 'hidden',
								display: '-webkit-box',
								'-webkit-line-clamp': 2,
								'-webkit-box-orient': 'vertical',
								wordBreak: 'break-all',
			            	}
			            }, (params.row.get_docs_cat != null ? '['+params.row.get_docs_cat.name +'] ' : '' ) + params.row.title ),
			        ]),
			    ]);

			};

			// 排序
			this.columns[ 2 ]['render']= (h, params) => {
				return h( docSort,{
					props:{
						sort: params.row.sort,
						id: params.row.id,
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
          	}, '上线'),
          	h('span', {
          		slot: 'close'
          	}, '下线')
          ]);
			};

           	// 操作按钮
			this.columns[ (this.columns.length-1) ]['render'] = (h, params) => {
                var buttons = [];

                // 预览按钮
            	buttons.push(
                	h('span', {
                			attrs:{
                				title:'预览'
                			}
                		},
	                    [ h('span', {
	                        class:'table-handle-button',
	                        on: {
	                            click: () => {
	                                this.viewDoc(params.index, params.row)
	                            }
	                        }
	                    },'预览') ]
                	)
               	);

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

                if( params.row.handle.remove ){
                    // 删除
                    buttons.push(
                    	h('span',{
                    			attrs:{
                    				title:'删除'
                    			}
                    		},
		                    [ h('span', {
		                        class:'table-handle-button',
		                        on: {
		                            click: () => {
		                                this.removeItem(params.index, params.row )
		                            }
		                        }
		                    },'删除') ]
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
        	this.$ajax.post( this.$api.docList, {
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
        // 搜索 - 回调函数
        searchPage( searchForm ){

        	this.tableLoading = true;

        	// ajax 请求获取数据，然后动态更新下面数据源
        	this.$ajax.post( this.$api.docList, searchForm )
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
        // 预览文档
        viewDoc(index, row){
			this.$refs['doc-info-modal'].openModal( row.code );
        },
        // 编辑文档
        editItem(index, row){
        	this.modalEditIndex = index;
        	this.openModal(row);
        },
		// 直接在列表更新状态
		updateStatus(index, row){
			this.tableLoading = true;
			var status = (row.status == 1 ? 2 : 1);

			// ajax 保存数据
			this.$ajax.post( this.$api.docStatus , {
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
        // 删除文档
        removeItem(index, row ){

        	this.$Modal.confirm({
                title: '操作提示',
                content: '确定删除文档吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {

                	this.tableLoading = true;
	            	// ajax 请求获取数据
	            	this.$ajax.post( this.$api.docRemove, {
	            		id: row.id,
	            	})
		    		.then( (response) => {
					this.tableLoading = false;
		    			var res = response.data;
		    			if( res.code ){
		    				// 删除后
		    				this.$delete( this.data, index);
		    				this.$Message.success( res.message );
		    			}
					});

                }
            });
        },
        // 打开编辑模态框
        openModal(row){
        	this.showDocList = false;

        	this.$refs['doc-form'].openModal(row, this.catTree, this.toolbars, this.authorList );
        },
        // 表单关闭的回调
        formClose(){
        	this.showDocList = true;
        },
        // 表单保存的回调
        formSaveCallback( obj ){
        	this.showDocList = true;
        	this.initData();
        },
    },
    watch: {
    },
    mounted () {
        this.init();
    },
    created () {

    },
};
</script>
