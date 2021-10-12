<style lang="less">
.cs-comment-log-list{
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
	<Card class="cs-comment-log-list">
		<div class="table-topbar">
			<Row type="flex">
				<Col style="flex:1 1 0%;">
					<Form ref="formSearch" :model="formSearch" inline>
						<FormItem>
							<DatePicker v-model="formSearch.searchTime" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="日志时间"
						:style="{width: formSearch.searchTime[0] != '' ? '290px':'100px'}"></DatePicker>
						</FormItem>
						<FormItem>
							客服人员：
							<Tag v-if="formSearch.adminSearchName!='' " closable @on-close="workerClose" size="large">{{formSearch.adminSearchName}}</Tag>
							<Button v-else @click="onSelectWorker">选择客服人员...</Button>
						</FormItem>
						<FormItem>
							<!--
							<Input v-model="formSearch.searchq" placeholder="日志内容" style="width:190px" clearable search enter-button
							@on-search="searchPage"
							@on-clear="searchPage"
							@keydown.native.enter.prevent ="searchPage"></Input>-->
							<Button type="primary" icon="ios-search" @click="searchPage">搜索</Button>
						</FormItem>
					</Form>
				</Col>
				<Col style="width:100px;text-align: right;">
					<Button icon="md-refresh" shape="circle" @click="init" title="刷新列表"></Button>
				</Col>
			</Row>	
		</div>

		<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData"></Table>
		<div v-show="pageTotal" class="list_page">
			<Page
			:total="pageTotal"
			:page-size="pageSize"
			:current="currentPage"
			:page-size-opts="[20]"
			@on-change="e => changePage(e)"
			@on-page-size-change="ps => handlePageSize(ps)"
			show-elevator
			show-total
			show-sizer></Page>
		</div>
		<!-- <div v-show="pageTotal>0" class="table-pager-footer">
	        <div style="float: right;">
	            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
	        </div>
	    </div> -->

	   	<!--选择在线客服-->
	   	<csWorkerSelect ref="cs-worker-select" :canSelectAll="true" @on-ok="onSelectOk"></csWorkerSelect>
	</Card>
</template>

<script>
import csWorkerSelect from '@/views/my-components/cs-worker-select/cs-worker-select';
import PageHelper from '@/libs/page-helper.js';
export default {
		mixins: [PageHelper],
    components: {
        csWorkerSelect,
    },
    data () {
        return {
        	// columns:[],
        	// data:[],
        	// tableHeight: 500,
        	// tableLoading: false,
        	// pageTotal: 0,
        	// pageSize: 20,

        	adminUserList: [],
        	formSearch:{
        		searchq:'',
        		searchTime:'',
        		// 搜索管理员关键词
        		adminSearch:'',
        		adminSearchId: '',
        		adminSearchName:'',
        	}

        }
    },
    methods:{
    	init () {
   //  		// 动态计算表高度
   //      	this.tableHeight = document.body.clientHeight - 200;

			// this.tableLoading = true;
   //      	// ajax 请求获取初始化数据，然后动态更新下面数据源
   //      	this.$ajax.post( this.$api.csCommentLogList, {
   //      		isInit: 1,
   //      	})
   //  		.then( (response) => {
			// 	this.tableLoading = false;
   //  			var res = response.data;

   //  			if( res.code ){
			// 		// 初始化表头
   //                  this.initColumn( res );

   //  				// 初始化表数据
   //  				this.data = res.data.items;
   //  				this.pageTotal = Number( res.data.total );
   //  				this.pageSize = Number( res.data.pageSize );
   //  			}

			// });
			this.loadData();
    },
		onLoadData(page, extData){
			// ajax 请求获取初始化数据，然后动态更新下面数据源
			return	this.$ajax.post( this.$api.csCommentLogList, {
					isInit: 1,
					searchq: this.formSearch.searchq,
					searchWorkerId: (this.formSearch.adminSearchId !='' && this.formSearch.adminSearch !='' ? this.formSearch.adminSearchId : ''),
					searchTime: this.formSearch.searchTime,
					...extData
				}).then( (response) => {
					// this.tableLoading = false;
					var res = response.data;
					if( res.code ){
						// 初始化表头
						this.initColumn( res );
						let data = res.data || {};
						// 初始化表数据
						this.data = {
							total: data.total,
							items: data.items
						}
						// this.pageTotal = Number( res.data.total );
						// this.pageSize = Number( res.data.pageSize );
					}
				});
		},
		// 初始化表头
		initColumn( res ){
			this.columns = res.data.columns;

			// 用户头像
			this.columns[ 0 ]['render']= (h, params) => {
			    return h('div', [
			        h('Avatar', {
			            props: {
			                src: params.row.get_member_info.wx_avatar,
			                icon:'md-person',
			            },
			            style:{
			            	marginRight:'5px'
			            },
			        }),
			        h('strong', {
			        	style:{
			        		overflow: 'hidden',
							textOverflow:'ellipsis',
							whiteSpace: 'nowrap',
			        	}
			        },params.row.get_member_info.wx_nick_name)
			    ]);
			};

			// 客服头像
			this.columns[ 1 ]['render']= (h, params) => {
				return h('Row', {
						props: {
							type:"flex",
							justify:"start",
						}
					},[
					h('Col', {},
						[h('Avatar', {
				            props: {
				                src: params.row.get_worker_info.avatar_format,
				                icon:'md-person',
								shape: "square",
				            },
				            style:{
				            	marginRight:'10px',
				            	marginTop:'10px',
				            	marginBottom:'10px',
				            },
				    	}),
				    ]),
				    h('Col', {
				    	style:{
				    		padding:'8px 5px 5px 0px',
				    		width: '80%',
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
								lineHeight: 1.5
				        	}
				        }, params.row.get_worker_info.nick_name ),
                h('div',{
                	overflow: 'hidden',
                	display: '-webkit-box',
                	'-webkit-line-clamp': 1,
                	'-webkit-box-orient': 'vertical',
                	wordBreak: 'break-all',
                	textOverflow:'ellipsis',
                	whiteSpace: 'nowrap',
                	lineHeight: 1.5
                }, params.row.get_worker_info.get_admin_info.user_name),
				    ]),
				]);
			};

			// 评分
			this.columns[ 2 ]['render']= (h, params) => {
				if( params.row.score > 0 ){
					return h('div', {}, '评分：' + params.row.score+' / 满分：'+params.row.full_score );
				}
				else{
					return h('div', {}, '用户未评分' );
				}
			};

			// 操作按钮
			this.columns[ (this.columns.length-1) ]['render']= (h, params) => {
				var buttons = [];
				buttons.push(
					h('span',
						{
							attrs:{
								title:'查看聊天记录'
							}
						},
						[ h('span', {
							class:'table-handle-button',
							on: {
								click: () => {
									this.$store.commit('setSelectedCsSession', {
									  id: params.row.session_id,
									  user_id: params.row.get_member_info.id,
									  in_history: true,
									  get_user_info: params.row.get_member_info,
									  get_session_info:{
										id: params.row.session_id,
										worker_id: params.row.worker_id,
									  }
									});

									this.$router.push('/plugins/cs-session');
								}
							}
						}, '查看聊天记录') ]
					)
				);
				return h('div',buttons);
			};
		},
   //      // 切换分页
   //      changePage ( page ) {

			// this.tableLoading = true;
   //          // ajax 请求获取数据，然后动态更新下面数据源
   //      	this.$ajax.post( this.$api.csCommentLogList, {
   //      		searchq: this.formSearch.searchq,
   //      		searchWorkerId: (this.formSearch.adminSearchId !='' && this.formSearch.adminSearch !='' ? this.formSearch.adminSearchId : ''),
   //      		searchTime: this.formSearch.searchTime,
   //      		page:page,
   //      	})
   //  		.then( (response) => {
   //  			var res = response.data;
   //  			if( res.code ){
   //  				// 初始化表数据
   //  				this.data = res.data.items;
   //  				this.pageTotal = Number( res.data.total );
   //  				this.pageSize = Number( res.data.pageSize );
   //  			}

   //  			this.tableLoading = false;
			// });

   //      },
       // 搜索日志
       searchPage(){

				this.tableLoading = true;
				// ajax 请求获取数据，然后动态更新下面数据源
				this.$ajax.post( this.$api.csCommentLogList, {
					searchq: this.formSearch.searchq,
					searchWorkerId: (this.formSearch.adminSearchId !=''  ? this.formSearch.adminSearchId : ''),
					searchTime: this.formSearch.searchTime,
				})
			.then( (response) => {
						var res = response.data;
						if( res.code ){
							// 初始化表数据
							let data = res.data || {};
							
							this.data = {
								total: data.total,
								items: data.items
							}
							// this.pageTotal = Number( res.data.total );
							// this.pageSize = Number( res.data.pageSize );
						}

						this.tableLoading = false;
				});
			},
        // 清除选中的客服人员
    	workerClose(){
    		this.formSearch.adminSearchName = '';
    		this.formSearch.adminSearchId = 0;
    	},
    	// 打开客服选择器
        onSelectWorker(){
			this.$refs['cs-worker-select'].openModal( [], 'radio' );
        },
        // 选客服的组件的 回调
        onSelectOk( items ){
        	if( items.length > 0 ){
				this.$set( this.formSearch, 'adminSearchId', items[0]['id'] );
				this.$set( this.formSearch, 'adminSearchName', items[0]['nick_name'] );
			}
        },
    },
    mounted () {
        this.init();
    },
};
</script>
