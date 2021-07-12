<style lang="less">
.cs-worker-list{
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
	<div class="cs-worker-list">
		<Card v-show="showList">
			<div class="table-topbar">
		    	<Row style="display:flex;">
			        <Col style="flex:1 1 0%;">
			        	<Form ref="formSearch" :model="formSearch" inline>
					        <FormItem>
					        	状态：
			        			<Select v-model="formSearch.status" placeholder="用户状态" style="width:110px">
			        				<Option value="-1">全部状态</Option>
			        				<Option v-for="(item, key) in statusList" :value="key" :key="key" :style="{color: item.color }">{{item.name}}</Option>
							    </Select>
					        </FormItem>
							<FormItem>
								分组：
								<Select v-model="formSearch.group_id" style="width:120px">
									<Option :value="-1">全部分组</Option>
									<Option :value="0">默认分组</Option>
									<Option v-for="(item, key) in groupList" :value="item.id" :key="key">{{item.name}}</Option>
							    </Select>
							</FormItem>
			        		<FormItem>
					            <Input v-model="formSearch.searchq" :style="{width: ( formSearch.searchq != '' ? 300 : 250) +'px'}" placeholder="" clearable search enter-button
								    @on-search="searchPage"
								    @on-clear="searchPage"
								    @keydown.native.enter.prevent ="searchPage">
					            	<Select v-model="formSearch.searchqType" slot="prepend" style="width:90px">
							            <Option value="nickName">客服昵称</Option>
							        </Select>
					            </Input>
					        </FormItem>
			        	</Form>
			        </Col>
			        <Col style="width:250px;text-align: right;">
                
			        	<Button v-if="canCreate" type="info" icon="md-add" @click="addWorker">添加客服</Button>
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
	  <csWorkerForm ref="cs-worker-form" @on-close="closeUserForm" @on-save="onFormSave"></csWorkerForm>

	</div>
</template>

<script>
import csWorkerForm from './cs-worker-form';

export default {
	name: 'csWorkerList',
    components: {
		csWorkerForm,
    },
    data () {
        return {
        	// 列表
        	columns:[],
        	data:[],
        	groupList:[],

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
        		searchqType: 'nickName',
				status: -1,
				group_id: 0,
        	},

			userCode: '',
        	showList: true,
        };
    },
    methods: {
		init(){
			this.userCode = this.$route.hash.replace('#user-','');

			if( this.userCode != '' ){
				// ajax 请求获取数据，用户详情页
				this.$ajax.post( this.$api.csWorkerList, {
					searchq: this.userCode,
					searchqType: 'userCode',
				})
				.then( (response) => {
					var res = response.data;
					if( res.code ){
						this.showList = false;
						this.$refs['user-form'].editUser(-1, res.data.items[0] );
					}
				});
			}

			this.initData();
		},
    	// 初始化方法
        initData() {
        	// 动态计算表高度
        	this.tableHeight = document.body.clientHeight - 200;

			this.tableLoading = true;
			// ajax 请求获取初始化数据，然后动态更新下面数据源
        	this.$ajax.post( this.$api.csWorkerList, {
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

					this.groupList = res.data.groupList;
    				this.statusList =  res.data.statusList;
    			}

			});

        },
		initColumn( res ){
			this.columns = res.data.columns;
      const _this = this;
      
			// 用户头像 + 名称
			this.columns[0].render = (h, params) => {
			    return h('Row', {
			    		props: {
			    			type:"flex",
			    			justify:"start",
			    		}
			    	},[
			    	h('Col', {
							style:{
								width: '50px',
							}
						},
			    		[h('Avatar', {
			                props: {
			                    src: params.row.avatar_format,
			                    icon:'md-person',
			                    size: 'large',
			                },
			                style:{
			                	marginRight:'5px',
			                	marginTop:'10px',
			                	marginBottom:'10px',
								cursor:'pointer',
			                },
							attrs:{
								title: '点击查看大图',
							},
							nativeOn:{
								click:() => {
									this.$util.viewImage( params.row.avatar_format, this );
								}
							},
			        	}),
			        ]),
			        h('Col', {
			        	style:{
			        		padding:'8px 5px 5px 0px',
			        		flex: '1 1 0%',
			        	}},
			        	[h('div', {
			            	style:{
			            		fontWeight: 'blod',
			            		overflow: 'hidden',
								display: '-webkit-box',
								'-webkit-line-clamp': 1,
								'-webkit-box-orient': 'vertical',
								wordBreak: 'break-all',
								overflow: 'hidden',
								textOverflow:'ellipsis',
								whiteSpace: 'nowrap',
			            	}
			            }, params.row.nick_name ),
			            h('div',{
			            	style:{
			            		overflow: 'hidden',
								textOverflow:'ellipsis',
								whiteSpace: 'nowrap',
			            	}
			            }, params.row.get_admin_info.name != '' ? params.row.get_admin_info.name : '' ),
			        ]),
			    ]);
			};

			// 在线状态
			this.columns[ (this.columns.length-4) ]['render'] = (h, params) => {
			    const row = params.row;
			    const color = row.status == 1 ? 'success' : row.status == 2 ? 'error' : 'default';
			    const text = row.status == 1 ? '在线' : row.status == 2 ? '忙碌' : '离线';

				return h('Tag', {
				    props: {
				        color: color
				    },
				}, text);
			};

			// 实际在线状态
			this.columns[ (this.columns.length-3) ]['render'] = (h, params) => {
			    const row = params.row;
			    const color = row.onlive == 1 ? 'success' : 'error';
			    const text = row.onlive == 1 ? '在线' : '离线';

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
          						value: Number( row.enable ),
          						'true-value': 1,
          						'false-value': 0,
          						'before-change'() {
          							return new Promise((resolve) => {
          								if( row.handle.edit ){
          									if( row.enable == 1 ){
          										_this.$Modal.confirm({
          											title: '操作提示',
          											content: '确定锁定用户吗？设置后，会员会被锁定无法进入会话。',
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
          					}, '正常'),
          					h('span', {
          						slot: 'close'
          					}, '锁定')
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

					// 释放会话按钮
					if( params.row.get_session_count > 0 ){
						buttons.push(
							h('span',
								{
									attrs:{
										title:'结束当前客服的全部会话'
									}
								},
								[ h('span', {
									class:'table-handle-button',
									on: {
										click: () => {
											this.finishWorkerSession(params.index, params.row)
										}
									}
								}, '释放会话') ]
							)
						);
					}
			    }

				// 暂时不开放移除按钮
				if( 1>2 && params.row.handle.remove ){
					// 移除按钮
					buttons.push(
				    	h('span',
				    		{
				    			attrs:{
				    				title:'移除'
				    			}
				    		},
				            [ h('span', {
				                props: {
				                    type: 'ios-trash-outline',
				                    size: '28'
				                },
				                class:'table-handle-button',
				                on: {
				                    click: () => {
				                        this.removeWorker(params.index, params.row)
				                    }
				                }
				            },'移除') ]
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
        	this.$ajax.post( this.$api.csWorkerList, {
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
        	// ajax 请求获取数据
        	this.$ajax.post( this.$api.csWorkerList, {
        		searchq: this.formSearch.searchq,
        		searchqType: this.formSearch.searchqType,
        		status: this.formSearch.status,
				group_id: this.formSearch.group_id,
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
        editWorker(index, row){
        	this.showList = false;
        	this.$refs['cs-worker-form'].openModal(row, this.groupList );
        },
        // 添加客服
        addWorker(){
        	this.showList = false;
        	this.$refs['cs-worker-form'].openModal( {admin_id:0}, this.groupList );
        },
		// 释放客服的会话
		finishWorkerSession(index, row){
			this.$Modal.confirm({
			    title: '操作提示',
			    content: '确定当前客服的会话吗？释放后，用户的会重新回到待接入状态，当前客服的接入队列也会被清空',
			    okText: '确定',
			    cancelText: '取消',
			    onOk: () => {
					this.tableLoading = true;
					// ajax 请求获取数据
					this.$ajax.post( this.$api.csWorkerSessionKill, {
						worker_id: row.id,
					})
					.then( (response) => {
						this.tableLoading = false;
						var res = response.data;
						if( res.code ){
							this.initData();
							this.$Message.success( res.message );
						}
					});
				},
			});
		},
		// 移除客服
		removeWorker( index, row ){
			this.$Modal.confirm({
			    title: '操作提示',
			    content: '确定停用客服吗？停用后，当前账号不能进入客服会话。',
			    okText: '确定',
			    cancelText: '取消',
			    onOk: () => {

			    	this.tableLoading = true;
			    	// ajax 请求获取数据
			    	this.$ajax.post( this.$api.csWorkerRemove, {
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
			var enable = (row.enable == 0 ? 1 : 0);

			// ajax 保存数据
			this.$ajax.post( this.$api.csWorkerStatus , {
				id : row.id,
				enable: enable,
			})
			.then( (response) => {
				this.tableLoading = false;
				var res = response.data;

				if( res.code ){
					// 保存成功
		            this.$Message.success( res.message );

		            // 更新列表的值
		            this.$set( this.data[ index ], 'enable', enable );
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
