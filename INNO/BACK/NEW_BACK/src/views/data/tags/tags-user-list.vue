<style lang="less">
.user-list{

	.table-topbar{
	    .ivu-form-item{
	        margin-bottom: 10px;
	    }
	    .ivu-input-icon-clear{
	    	right:50px;
	    }
	}

	.member-export-box{
		padding:5px 0;
		text-align: center;
		overflow:hidden;

		.col-box{
			background: #efefef;
			padding:15px;

			.title{
				font-size:14px;
			}
			.desc{
				font-size:12px;
				margin:10px 0;
			}
		}
	}
}
</style>

<template>
	<div class="user-list">
		<Card v-show="showList">
			<div class="table-topbar">
		    	<Row type="flex">
			        <Col style="flex:1 1 0%;">
			        	<Form ref="formSearch" :model="formSearch" inline>
                  <FormItem class="icard-header">
                    <Tooltip content="返回" placement="bottom-start">
                      <Icon type="ios-arrow-dropleft" @click="goBack" class="card-back" />
                    </Tooltip>
                  </FormItem>
                  <FormItem>
                    当前标签：<Tag size="large" color="blue">{{tagInfo.name}}</Tag>
                  </FormItem>
				  <!--
			        		<FormItem>
			        			公众号：
			        			<Select v-model="formSearch.wx_subscribe" placeholder="关注公众号" style="width:110px" clearable>
			        				<Option value="-1">不限状态</Option>
							        <Option value="0">未关注</Option>
							        <Option value="1">已关注</Option>
							        <Option value="2">取消关注</Option>
							    </Select>
					        </FormItem>
					        <FormItem>
					        	状态：
			        			<Select v-model="formSearch.status" placeholder="用户状态" style="width:110px" clearable>
			        				<Option value="-1">全部状态</Option>
			        				<Option v-for="(item, key) in statusList" :value="key" :key="key">{{item}}</Option>
							    </Select>
					        </FormItem>
			        		<FormItem>
					            <Input v-model="formSearch.searchq" :style="{width: ( formSearch.searchq != '' ? 300 : 250) +'px'}" placeholder="" clearable search enter-button
								    @on-search="searchPage"
								    @on-clear="searchPage"
								    @keydown.native.enter.prevent ="searchPage">
					            	<Select v-model="formSearch.searchqType" slot="prepend" style="width:100px">
							            <Option value="nickName">微信昵称</Option>
							            <Option value="mobile">手机号</Option>
							            <Option value="cardNum">卡号</Option>
							            <Option value="userName">用户名</Option>
							        </Select>
					            </Input>
					        </FormItem>
							-->
			        	</Form>
			        </Col>
			        <Col style="width:110px;text-align:right;">

			        </Col>
			    </Row>
			</div>

			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
			<div v-show="pageTotal>0" class="table-pager-footer">
		        <div style="float: right;">
		            <Page show-total show-elevator show-sizer
					:total="pageTotal"
					:page-size="pageSize"
					:current="1"
					@on-change="changePage"
					@on-page-size-change="handlePageSize"></Page>
		        </div>
		    </div>
	    </Card>

	</div>
</template>

<script>

export default {
	name: 'tagsUserList',
    components: {

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
			tagInfo:{},

        	statusList:[],
        	canExport: false,

        	// 搜索表单
        	formSearch:{
        		wx_subscribe:-1,
        		searchq:'',
        		searchqType: 'nickName',
        		time:[],
        	},
			
			searchTime:[],
			
			// 当前标签ID
			tagId: 0,

        	showList: true,
			exportDisable: false,
			showPop: false,
        };
    },
    methods: {
		init(){
			this.tagId = this.$route.params.id;
			if( this.$route.query != null ){
				if( this.$route.query.searchTimeFrom != null && this.$route.query.searchTimeFrom != '' ){
					this.searchTime[0] = this.$route.query.searchTimeFrom;
				}
				if( this.$route.query.searchTimeTo != null && this.$route.query.searchTimeTo != '' ){
					this.searchTime[1] = this.$route.query.searchTimeTo;
				}
			}
			this.initData();
		},
    	// 初始化方法
        initData() {
        	// 动态计算表高度
        	this.tableHeight = document.body.clientHeight - 210;

			this.tableLoading = true;
			// ajax 请求获取初始化数据
        	this.$ajax.post( this.$api.tagsUserList, {
        		isInit: 1,
				pageSize: this.pageSize,
				tagId: this.tagId,
				searchTime: this.searchTime,
        	})
    		.then( (response) => {
				this.tableLoading = false;
    			var res = response.data;

    			if( res.code ){

    				this.columns = res.data.columns;

    				// 用户头像 + 名称
					this.columns[0].render = (h, params) => {
		                return h('Row', {
		                		props: {
		                			type:"flex",
		                			justify:"start",
		                		}
		                	},[
		                	h('Col', {},
		                		[h('Avatar', {
	                                props: {
	                                    src: (params.row.wx_avatar != '' && params.row.wx_avatar != null ? params.row.wx_avatar : ( typeof(params.row.photo_format) != 'undefined' ? params.row.photo_format : '' ) ),
	                                    icon:'md-person',
	                                    size: 'large',
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
										'-webkit-line-clamp': 2,
		  								'-webkit-box-orient': 'vertical',
		  								wordBreak: 'break-all',
		  								overflow: 'hidden',
										textOverflow:'ellipsis',
										whiteSpace: 'nowrap',
			                    	}
			                    }, ( typeof(params.row.wx_nick_name) != 'undefined' && params.row.wx_nick_name != null ? params.row.wx_nick_name : '' ) +
		                    		( typeof(params.row.nick_name) != 'undefined' && params.row.nick_name != null ? params.row.nick_name : '' ) +
		                    		( typeof(params.row.real_name) != 'undefined' && params.row.real_name != null ? params.row.real_name : '' ) ),
			                    h('div',{
			                    	style:{
			                    		overflow: 'hidden',
										textOverflow:'ellipsis',
										whiteSpace: 'nowrap',
			                    	}
			                    }, params.row.name ),
		                    ]),
		                ]);
		           	};

    				// 关注微信
    				this.columns[ (this.columns.length-5) ]['render'] = (h, params) => {
                        const row = params.row;
                        const color = row.wx_subscribe == 1 ? 'green' : row.wx_subscribe == 2 ? 'red' : 'orange';
                        const text = row.wx_subscribe == 1 ? '已关注' : row.wx_subscribe == 2 ? '取消关' : '未关注';

                        return h('Tag', {
                            props: {
                                type: 'border',
                                color: color
                            }
                        }, text);
                    };

    				// 状态标识
    				this.columns[ (this.columns.length-2) ]['render'] = (h, params) => {
                        const row = params.row;
                        const color = row.status == 1 ? 'success' : row.status == 2 ? 'error' : 'error';
                        const text = row.status == 1 ? '正常' : row.status == 2 ? '已锁定' : '未知';

						return h('Tag', {
						    props: {
						        type: 'dot',
						        color: color
						    },
						}, text);
                    };

                    // 操作按钮
    				this.columns[ (this.columns.length-1) ]['render'] = (h, params) => {
                        var buttons = [];

						// 查看按钮
						buttons.push(
							h('span',
								{
									attrs:{
										title:'查看用户详情'
									}
								},
								[ h('span', {
									class:'table-handle-button',
									on: {
										click: () => {
											this.viewUser(params.index, params.row)
										}
									}
								}, '查看详情') ]
							)
						);
                        return h('div',buttons);
                    }

    				// 初始化表数据
    				this.data = res.data.items;
    				this.pageTotal = Number( res.data.total );
    				this.pageSize = Number( res.data.pageSize );
    				this.canExport = res.data.canExport;
            this.tagInfo = res.data.tagInfo;

    				this.statusList =  res.data.statusList;
    			}

			});

        },
        // 切换分页
        changePage ( page ) {

			this.tableLoading = true;
            // ajax 请求获取数据，
        	this.$ajax.post( this.$api.tagsUserList, {
        		wx_subscribe: this.formSearch.wx_subscribe,
        		searchq: this.formSearch.searchq,
        		searchqType: this.formSearch.searchqType,
        		tagId: this.tagId,
        		page:page,
				pageSize: this.pageSize,
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
		handlePageSize (pageSize) {
		    this.pageSize = pageSize;
			this.$util.cache.set('user-list-page-size', pageSize);
		    this.initData();
		},
        // 搜索
        searchPage(){

        	this.tableLoading = true;
        	// ajax 请求获取数据，然后动态更新下面数据源
        	this.$ajax.post( this.$api.tagsUserList, {
        		wx_subscribe: this.formSearch.wx_subscribe,
        		searchq: this.formSearch.searchq,
        		searchqType: this.formSearch.searchqType,
        		tagId: this.tagId,
        		status: this.formSearch.status,
				pageSize: this.pageSize,
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
        viewUser(index,row){
        	this.$router.push('/user/user-view/'+row.id );
        },
        goBack(){
          this.$router.back();
        }
    },
	created() {
		var pageSize = this.$util.cache.get('user-list-page-size');
		this.pageSize = pageSize == null ? 20 : pageSize;
	},
    mounted () {
        this.init();
    },
}
</script>
