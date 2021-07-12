<style lang="less">	
.user-feedback{
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
	<div class="user-feedback">
		<Card v-show="showFeedbackList">
			<div class="table-topbar">
		    	<Row type="flex">
			        <Col style="flex:1 1 0%;">
			        	<Form ref="formSearch" :model="formSearch" inline>
					        <FormItem>
			        			<Select v-model="formSearch.fbStatus" placeholder="请选择状态" style="width:130px" clearable>
									<Option value="-1">全部状态</Option>
							        <Option v-for="(item, key) in statusList" :value="key" :key="key">{{ item.name }}</Option>
							    </Select>
					        </FormItem>
							<FormItem>
								用户：
								<Tag v-if="formSearch.userSearchName!='' " closable @on-close="userClose" size="large">{{formSearch.userSearchName}}</Tag>
								<Button v-else @click="onSelectUser">请选择用户...</Button>
							</FormItem>
	
							<FormItem>
								分类：
								<Select v-model="formSearch.cat_id" style="width:100px;" clearable>
									<Option value="-1">不限</Option>
									<OptionGroup v-for="(cat0,index0) in catTree" :key="index0" :label="cat0.name">
										<Option v-for="(cat1,index1) in cat0.get_children" :key="index1" :value="cat1.id" style="text-indent:10px;">
											{{cat1.name}}
										</Option>
									</OptionGroup>
								</Select>
							</FormItem>
					        <FormItem>
					            <Input v-model="formSearch.searchq" placeholder="意见内容 模糊查询" clearable search enter-button 
									@on-search="searchPage"
									@on-clear="searchPage"
									@keydown.native.enter.prevent ="searchPage"></Input>
					        </FormItem>
			        	</Form>
			        </Col>
			        <Col style="width:250px;text-align: right;">
						
				
						
				<Button v-if="canCreate" icon="md-add" type="info" @click="addTask">创建员工工单</Button>
				<Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
					</Col>
			    </Row>	
			</div>
			
			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"
			@on-sort-change="sortPage"></Table>
			<div v-show="pageTotal>0" class="table-pager-footer">
		        <div style="float: right;">
		            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
		        </div>
		    </div>
		</Card>
		
		<!--回复表单组件-->
		<feedbackInfo ref="feedback-info" @on-save="formSave" @on-close="formClose"></feedbackInfo>
		
		<!--选择用户-->
		<userSelect ref="user-select" :canSelectAll="true" @on-ok="onSelectOk"></userSelect>
		

		<!--添加员工工单表单-->
		<staffFeedbackForm ref="staff-feedback-form" @on-save="initData"></staffFeedbackForm>
	</div>
</template>

<script>
import feedbackInfo from './feedback-info';
import userSelect from '@/views/my-components/user-select/user-select';
import staffFeedbackForm from './feedback-form.vue';

export default {
	name: 'userFeedback',
    components: {
		feedbackInfo,
		userSelect,
		staffFeedbackForm,
    },
	props: {
		// 评价类型
		contentType:{
			type:Array,
			default: ()=>[3],
		}, 
	},
    data () {
    	return {
    		columns:[],
        	data:[],
        	tableHeight: 500,
        	tableLoading: false,
        	pageTotal: 0,
        	pageSize: 20,
			sortColumn: '',
			sortVal: '',
        	userList:[],
        	modalEditIndex:0,
        	
        	showFeedbackList:true,
        	
        	// 搜索表单
        	formSearch:{
        		searchq:'',
        		fbStatus:-1,
        		cat_id: 0,
				
        		// 搜索管理员关键词
        		userSearch:'',
        		userSearchId: '',
        		userSearchName:[],
				
				// 指派人
				handler_admin_id: 0,
				get_handler_info: {},
        	},
        	catTree:[],
        	statusList:[],
			levelList: [],
			canCreate: false,
    	}
    },
    methods: {
    	// 初始化方法
        init() {
        	// 动态计算表高度
        	this.tableHeight = document.body.clientHeight - 200;
        	
			// 带员工工单的才能创建工单
			this.canCreate =  this.contentType.indexOf(6) !== -1 ? true : false;
			
			// 初始化列表数据
			this.initData();
        },
		// 初始化列表数据
		initData(){
			this.tableLoading = true;
			
			// ajax 请求获取初始化数据，然后动态更新下面数据源
			this.$ajax.post( this.$api.feedbackList, {
				isInit: 1,
				content_types: this.contentType,
				sortColumn: this.sortColumn,
				sortVal: this.sortVal,
			})
			.then( (response) => {
				this.tableLoading = false;
				var res = response.data;
				
				if( res.code ){
					
					this.columns = res.data.columns;
					
					// 初始化表字段
					this.columnInit();
					
					// 初始化表数据
					this.data = res.data.items;
					this.catTree = res.data.catTree;
					this.levelList = res.data.levelList;
					this.pageTotal = Number( res.data.total );
					this.pageSize = Number( res.data.pageSize );
					this.statusList = res.data.statusList;
					
					// 初始化表单组件
					this.$refs['feedback-info'].initSet( res );
    			}
    			
			});
        },
        columnInit(){
			
			// 用户头像 + 名称
			this.columns[0].render = (h, params) => {
				var row = params.row.user_info;
			    return h('Row', {
			    		props: {
			    			type:"flex",
			    		}
			    	},[
			    	h('Col', {
							width:'40px',
						},
			    		[h('Avatar', {
			                props: {
			                    src: (row.wx_avatar != '' && row.wx_avatar != null ? row.wx_avatar : ( typeof(row.photo_format) != 'undefined' ? row.photo_format : '' ) ),
			                    icon:'md-person',
			                    size: 'large',
			                },
			                style:{
			                	marginRight:'5px',
			                	marginTop:'10px',
			                	marginBottom:'10px',
								display: (row.length == 0 ? 'none':'block'),
			                },
			        	}),
			        ]),
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
								overflow: 'hidden',
								textOverflow:'ellipsis',
								whiteSpace: 'nowrap',
			            	}
			            }, ( typeof(row.wx_nick_name) != 'undefined' && row.wx_nick_name != null ? row.wx_nick_name : '' ) + 
							( row.real_name != null && row.real_name != '' ? ' [ '+row.real_name+' ]' : '' )
							+ ( row.length == 0 ? '无关联' : '')
						),
			            h('div',{
			            	style:{
			            		overflow: 'hidden',
			            		textOverflow:'ellipsis',
			            		whiteSpace: 'nowrap',
			            	}
			            }, row.card_num != null && row.card_num != '' ? '卡号：' + row.card_num : '' ),
			        ]),
			    ]);
			};
			
			// 指派人头像 + 名称
			this.columns[1].render = (h, params) => {
				var row = params.row;
				if( row != null ){
					return h('div',{},[
						h('div',{}, ( row.get_creater_info.name !='' && row.get_creater_info.name != null ? row.get_creater_info.name :'') ),
						h('div',{}, ( row.get_creater_info.real_name !='' && row.get_creater_info.real_name != null ? '[ ' + row.get_creater_info.real_name + ' ]' :'') ),
					]);
				}
				else{
					return h('span', {} , '-');
				}
			};
				
			// 指派人头像 + 名称
			this.columns[2].render = (h, params) => {
				var row = params.row.get_handler_info;
				if( row != null ){
					return h('Row', {
							props: {
								type:"flex", 
								justify:"start",
							}
						},[
						h('Col', {
								width:'40px',
							},
							[h('Avatar', {
								props: {
									src: (row.wx_avatar != '' && row.wx_avatar != null ? row.wx_avatar : row.photo_format ),
									icon:'md-person',
									size: 'large',
								},
								style:{
									marginRight:'5px',
									marginTop:'10px',
									marginBottom:'10px',
								},
							}),
						]),
						h('Col', {
							style:{
								padding:'8px 5px 5px 5px',
								flex: '1 1 0%',
							}},
							[
								h('div',{
									style:{
										overflow: 'hidden',
										textOverflow:'ellipsis',
										whiteSpace: 'nowrap',
									}
								}, row.name != null  ? row.name : '' ),
								h('div', {
								style:{
									fontWeight: 'blod',
									overflow: 'hidden',
									display: '-webkit-box',
									'-webkit-line-clamp': 2,
									'-webkit-box-orient': 'vertical',
									wordBreak: 'break-all',
									overflow: 'hidden',
									textOverflow:'ellipsis',
									whiteSpace: 'nowrap',
								}
							}, ( typeof(row.wx_nick_name) != 'undefined' && row.wx_nick_name != null ? row.wx_nick_name : '-' ) + 
								( row.real_name != null && row.real_name != '' ? ' [ '+row.real_name+' ]' : '-' )
							),
							
						]),
					]);
				}
				else{
					return h('span', {} , '未指派');
				}
			};
			
			// 工单号 + 分类
			this.columns[ 3 ]['render'] = (h, params) => {
				var arrContent = [];

				arrContent.push(h('div', {
					style:{}
				}, params.row.code ));
			    
				arrContent.push(
					h('div', {
						style:{
							fontWeight: 'bold'
						}
					}, ( params.row.get_cat != null ? '分类：'+ params.row.get_cat.name : '') )
				);
				
				arrContent.push(
					h('Tag', {
						props: {
							color: this.levelList[ params.row.level ].color,
						},
						style:{
						},
					}, this.levelList[ params.row.level ].name )
				);

			    return h('div', arrContent);
			};
			
        	// 内容加入图片
			this.columns[ 4 ]['render'] = (h, params) => {
				var arrContent = [];
				var arrImg = [];
				for(var k in params.row.fb_images){
					arrImg.push( h('div', {
						attrs: {
                            src: params.row.fb_images[k],
                       	},
                       	on:{
                       		click: () => {
                       			this.$util.viewImage( params.row.fb_images[k], this );
				          	}
                       	},
                        style:{
							background: 'url('+params.row.fb_images[k]+') center center no-repeat',
							backgroundSize: '100% auto',
                        	marginTop: '5px',
                        	marginRight:'5px',
                        	width:'50px',
							height: '50px',
                        	cursor:'pointer',
							float: 'left',
							border: '1px solid #eee',
                        },
                    }));	
				}
				arrContent.push( h('div', {
					style:{
						float:'left',
                    }
				},arrImg) );
				
				arrContent.push(h('div', {
					style:{
						paddingTop: '5px',
						paddingBottom: '3px',
						width: '100%',
						overflow: 'hidden',
						textOverflow:'ellipsis',
						//whiteSpace: 'nowrap',
					}
				}, '[ ' + params.row.content_type_format + ' ] ' + params.row.content));
                
				if( params.row.admin_remark != '' && params.row.admin_remark != null ){
					arrContent.push(h('div', {
						style:{
							paddingTop: '5px',
							paddingBottom: '3px',
							width: '100%',
							overflow: 'hidden',
							textOverflow:'ellipsis',
							color: 'red',
						}
					},'审核备注：'+params.row.admin_remark));
				}
				
                return h('div', arrContent);
            };
            
			// 状态标识
			this.columns[ (this.columns.length-3) ]['render'] = (h, params) => {
                const row = params.row;
                const color = this.statusList[ row.fb_status ]['color'];
                const text = this.statusList[ row.fb_status ]['name'];

                return h('Tag', {
                    props: {
                        type: 'dot',
                        color: color
                    }
                }, text);
            };
            
            // 操作按钮
			this.columns[ (this.columns.length-1) ]['render'] = (h, params) => {
                var buttons = [];

                if( params.row.handle.edit ){
                	// 按钮
					buttons.push(
						h('span',
							{	
								attrs:{
									title:'查看'
								}
							},
					        [ h('span', {
					            class:'table-handle-button',
					            on: {
					                click: () => {
					                    this.editFeedback(params.index, params.row)
					                }
					            }
					        },'查看') ]
						) 
					);
                }

                return h('div',{style:{textAlign:'center'}},buttons);
            };
        },
        // 切换分页
        changePage ( page ) {
			this.tableLoading = true;
            // ajax 请求获取数据，然后动态更新下面数据源
        	this.$ajax.post( this.$api.feedbackList, {
        		page:page,
        		searchq: this.formSearch.searchq,
        		fbStatus: this.formSearch.fbStatus,
        		user_id: this.formSearch.userSearchId,
				content_types: this.contentType,
				sortColumn: this.sortColumn,
				sortVal: this.sortVal,
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
        	this.$ajax.post( this.$api.feedbackList, {
        		searchq: this.formSearch.searchq,
        		fbStatus: this.formSearch.fbStatus,
        		user_id: this.formSearch.userSearchId,
				content_types: this.contentType,
				handler_admin_id: this.formSearch.handler_admin_id,
				cat_id: this.formSearch.cat_id,
				sortColumn: this.sortColumn,
				sortVal: this.sortVal,
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
		// 页面排序
		sortPage( val ){
			this.sortColumn = val.key;
			this.sortVal = val.order;

			this.changePage ( 0 );
		},
		// 创建员工工单
		addTask(){
			this.$refs['staff-feedback-form'].openModal( this.catTree, this.levelList );
		},
        // 编辑按钮
        editFeedback(index,row){
        	this.modalEditIndex = index;
        	this.showFeedbackList = false;
        	this.$refs['feedback-info'].openModal(index,row);
        },
        // 查看按钮处理
        viewMessage (index,row) {
            this.editFeedback( index,row);
        },
        // 表单关闭回调函数
        formClose(){
        	this.showFeedbackList = true;
        },
        // 表单保存的回调函数
        formSave( obj ){
			// 重新加载列表
			this.init();
			
			this.showFeedbackList = true;
        },
		// 清除选中的用户
		userClose(){
			this.formSearch.userSearchName = '';
			this.formSearch.userSearchId = 0;
		},
		// 打开用户选择器
		onSelectUser(){
			this.$refs['user-select'].openModal( [], 'radio' );
		},
		// 选用户的组件的 回调
		onSelectOk( items ){
			if( items.length > 0 ){console.log( items );
				this.$set( this.formSearch, 'userSearchId', items[0]['id'] );
				this.$set( this.formSearch, 'userSearchName', items[0]['wx_nick_name']+'/'+items[0]['real_name'] );
			}
		},
    },
    mounted () {
        this.init();
    },
}
</script>
