<style lang="less">
.release-list{

}	
</style>

<template>
    <div class="release-list">
    	<Card v-show="showList">
	    	<!--列表搜索框-->
			<div class="table-topbar" style="margin-bottom: 10px;">
		    	<Row type="flex">
			        <Col style="flex:1 1 0%;">
			        </Col>
			        <Col style="width:280px;text-align: right;">
                <Button type="success" @click="viewTree">预览结果</Button>
			        	<Button type="info" icon="md-add" @click="openModal({})">添加版本号</Button>
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
		
		<!--发布表单-->
	    <releaseForm ref="release-form" @on-success="formSaveCallback" @on-close="formClose"></releaseForm>
	    
    </div>
</template> 

<script>
/**
 * 更新发布列表
 */
import releaseForm from './release-form';

export default {
    components: {
    	releaseForm,
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
        	
			showList: true,
        	canCreate: true,
        }
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
        	this.$ajax.post( this.$api.releaseList, {
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
    			}
    			
			});
    	},
    	// 表头初始化
    	initTable( res ){
    		this.columns = res.data.columns;
        const _this = this;
        
			// 版本号
			this.columns[ 0 ]['render']= (h, params) => {

				return h('span', {}, params.row.name 
				+ ( params.row.alias_name != '' ? '( '+params.row.alias_name+' )' : '' ) );
			
			};
				
			// 状态标识
			this.columns[ (this.columns.length-3) ]['render'] = (h, params) => {
			    const row = params.row;
	
          return h('i-switch',{
          	props: {
          	    size: 'large',
          		value: Number( row.status ),
          		'true-value': 1,
          		'false-value': 0,
          		'before-change'() {
          			return new Promise((resolve) => {
          				_this.updateStatus(params.index, params.row);
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
                
                // 明细项管理按钮
            	buttons.push( 
                	h('span', {	
                			attrs:{
                				title:'明细项管理'
                			}
                		},
	                    [ h('span', {
	                        class:'table-handle-button',
	                        on: {
	                            click: () => {
	                                this.viewItems(params.index, params.row)
	                            }
	                        }
	                    },'明细项管理') ]
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

                return h('div',buttons);
           };
           
    	},
    	// 切换分页
        changePage ( page ) {
			
			this.tableLoading = true;
            // ajax 请求获取数据，然后动态更新下面数据源
        	this.$ajax.post( this.$api.releaseList, {
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
        // 查看明细项
        viewItems(index, row){
			this.$router.push('/system/release-item-list/'+ row.id );
        },
        // 编辑文档
        editItem(index, row){
        	this.modalEditIndex = index;
        	this.openModal(row);
        },
		// 直接在列表更新状态
		updateStatus(index, row){
			let status = row.status == 0 ? 1 : 0;
			
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定 '+ ( status == 0 ? '取消' : '' )+'发布 版本吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.tableLoading = true;

					// ajax 保存数据
					this.$ajax.post( this.$api.releaseStatus , {
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
			});
		},
        // 打开编辑模态框
        openModal(row){
        	this.showList = false;
        	
        	this.$refs['release-form'].openModal(row);
        },
        // 表单关闭的回调
        formClose(){
        	this.showList = true;
        },
        // 表单保存的回调
        formSaveCallback( obj ){
        	this.showList = true;
        	this.initData();
        },
        // 查看
        viewTree(){
        	this.$router.push('/settings/release-notes');
        }
    },
    mounted () {
        this.init();
    },
};
</script>