<style lang="less">
.release-item-list{

}	
</style>

<template>
    <div class="release-item-list">
    	<Card v-show="showList">
	    	<!--列表搜索框-->
			<div class="table-topbar" style="margin-bottom: 10px;">
		    	<Row type="flex">
			        <Col style="flex:1 1 0%;">
						<Tooltip content="返回" placement="bottom-start">
							<Icon type="ios-arrow-dropleft" @click="goBack" :size="28" style="cursor: pointer;"/>
						</Tooltip>
						{{releaseInfo.name}} {{releaseInfo.alias_name}} - 明细项管理
			        </Col>
			        <Col style="width:180px;text-align: right;">
			        	<Button type="info" icon="md-add" @click="openModal({})">添加明细项</Button>
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
	    <releaseItemForm ref="release-item-form" @on-success="formSaveCallback" @on-close="formClose"></releaseItemForm>
	    
    </div>
</template> 

<script>
/**
 * 更新发布列表
 */
import releaseItemForm from './release-item-form';
import releaseItemSort from './release-item-sort';

export default {
    components: {
    	releaseItemForm,
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
			releaseId: 0,
			
			releaseInfo:{},
			typeList: [],
			authorList: [],
        }
    },
    methods: {
    	/**
    	 * @desc 初始化方法
    	 */
        init () {
        	// 动态计算表高度
        	this.tableHeight = document.body.clientHeight - 200;
        	
			this.releaseId = this.$route.params['id'];
        	this.initData();
        },
        // 初始化 加载数据，（不会自动加载，而是父组件触发加载）
    	initData(){
    		this.tableLoading = true;
			// ajax 请求获取初始化数据
        	this.$ajax.post( this.$api.releaseItemList, {
        		isInit: 1,
				release_id: this.releaseId,
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
					
					this.releaseInfo = res.data.releaseInfo;
					this.typeList = res.data.typeList;
					this.authorList = res.data.authorList;
    			}
    			
			});
    	},
    	// 表头初始化
    	initTable( res ){
    		this.columns = res.data.columns;

			// 类型标识
			this.columns[ 1 ]['render'] = (h, params) => {
			    const row = params.row;
			    const color = row.type_color;
			    const text = row.type_name;
			
			    return h('Tag', {
			        props: {
			            color: color
			        },
			    }, text);
			};
            
			// 负责人
			this.columns[ 2 ]['render'] = (h, params) => {
				let tags = [];
				
				for(var i in params.row.author){
					tags.push( h('Tag', {
						props: {},
					}, params.row.author[i] ) );
				}
				return tags;
			};
			
			// 排序
			this.columns[ 3 ]['render'] = (h, params) => {
				return h( releaseItemSort,{
					props:{
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
		                                this.editItem(params.row)
		                            }
		                        }
		                    },'编辑') ]
                    	) 
                   	);
                }
				
				if( params.row.handle.remove ){
					// 移除按钮
					buttons.push( 
						h('span', {	
								attrs:{
									title:'删除'
								}
							},
					        [ h('span', {
					            class:'table-handle-button',
					            on: {
					                click: () => {
					                    this.removeItem(params.index, params.row)
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
            // ajax 请求获取数据
        	this.$ajax.post( this.$api.releaseItemList, {
        		page:page,
				release_id: this.releaseId,
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
        // 编辑文档
        editItem(row){
        	this.openModal(row);
        },
		// 打开编辑模态框
		openModal(row){
			this.showList = false;
			
			this.$refs['release-item-form'].openModal(row, this.releaseInfo, this.authorList, this.typeList );
		},
		// 直接在列表更新状态
		removeItem(index, row){
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定删除吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.tableLoading = true;

					// ajax 保存数据
					this.$ajax.post( this.$api.releaseItemRemove , {
						id : row.id,
					})
					.then( (response) => {
						this.tableLoading = false;
						var res = response.data;
						
						if( res.code ){
							// 保存成功
							this.$Message.success( res.message );
							
							// 更新列表的值
							this.initData();
						}
					});
				},
			});
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
		goBack(){
			this.$router.push('/system/release-list');
		}
    },
    mounted () {
        this.init();
    },
};
</script>