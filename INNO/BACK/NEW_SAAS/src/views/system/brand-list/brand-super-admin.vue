<style lang="less">
.brand-super-admin{
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
	<div class="brand-super-admin">
		<Card v-show="showList">
			<div class="table-topbar">
		    	<Row type="flex">
			        <Col style="flex:1 1 0%;">
			        	<Form ref="formSearch" :model="formSearch" inline>
			        		<FormItem>
					            <Input v-model="formSearch.searchq" style="width:300px;" placeholder="" clearable search enter-button
								@on-search="searchPage"
								@on-clear="searchPage"
								@keydown.native.enter.prevent ="searchPage">
									<Select v-model="formSearch.searchqType" slot="prepend" style="width:80px">
										<Option value="userName">用户名</Option>
										<Option value="nickName">昵称</Option>
										<Option value="mobile">手机号</Option>
									</Select>
								</Input>

					        </FormItem>
							<FormItem>
								<helpTips tipsContent="一个品牌只能有一个超级管理员账号" placement="bottom-start"></helpTips>
							</FormItem>
			        	</Form>
			        </Col>
			        <Col style="width:60px;text-align: right;">
						<Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
					</Col>
			    </Row>
			</div>

			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
			<div v-show="pageTotal>0" style="margin: 10px;overflow: hidden">
		        <div style="float: right;">
		            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
		        </div>
		    </div>
	    </Card>

	</div>
</template>

<script>
import util from '@/libs/util.js';
import helpTips from '@/views/my-components/help-tips/help-tips';
import Cookies from 'js-cookie';

export default {
    components: {
		helpTips,
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

        	// 搜索表单
        	formSearch:{
        		searchq:'',
				searchqType: 'userName',
        	},

        	showList: true,
        };
    },
    methods: {
    	// 初始化方法
        init () {
        	// 动态计算表高度
        	this.tableHeight = document.body.clientHeight - 210;

			this.tableLoading = true;
			// ajax 请求获取初始化数据，然后动态更新下面数据源
        	util.ajax.post( util.apiUrl.buserList, {
        		isInit: 1,
        	})
    		.then( (response) => {
			this.tableLoading = false;
    			var res = response.data;

    			if( res.code ){

    				this.columns = res.data.columns;

    				// 用户头像
    				this.columns[ 2 ]['render']= (h, params) => {
                        return h('div', [
                            h('Avatar', {
                                props: {
                                    src: params.row.wx_avatar,
                                    icon:'md-person',
                                    size: 'large',
                                },
                                style:{
                                	marginRight:'10px',
                                	marginTop:'10px',
                                	marginBottom:'10px',
                                },
                            }),
                            h('strong', {
                            	style:{
                            		overflow: 'hidden',
									textOverflow:'ellipsis',
									whiteSpace: 'nowrap',
                            	}
                            }, params.row.user_name != null ? params.row.user_name : '' )
                        ]);
                    };

    				// 状态标识
    				this.columns[ (this.columns.length-2) ]['render'] = (h, params) => {
                        const row = params.row;
                        const color = row.status == 1 ? 'success' : row.status == 2 ? 'error' : 'error';
                        const text = row.status == 1 ? '正常' : row.status == 2 ? '锁定' : '未知';

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

						// 编辑按钮
						buttons.push( h('Button', {
							props: {
								type: 'error',
								size: 'small'
							},
							style: {
								marginRight: '5px'
							},
							on: {
								click: () => {
									this.viewUser(params.index, params.row)
								}
							}
						}, '进入品牌后台') );

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
            // ajax 请求获取数据，然后动态更新下面数据源
        	util.ajax.post( util.apiUrl.buserList, {
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
        	util.ajax.post( util.apiUrl.buserList, {
        		searchq: this.formSearch.searchq,
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
        // 进入品牌后台
        viewUser(index,row){
        	this.$Modal.confirm({
        	    title: '操作警告',
        	    content: '你即将进入品牌的后台，只能查看，禁止在后台有任何修改操作，任何操作都有历史记录被检索到。',
        	    okText: '进入',
        	    cancelText: '取消',
        	    onOk: () => {

					this.tableLoading = true;
					// ajax 请求获取数据，
					util.ajax.post( util.apiUrl.getBrandSuperAdminToken, {
						user_id: row.user_id,
						brand_id: row.brand_id,
					})
					.then( (response) => {
						var res = response.data;
						if( res.code ){
							// 登录
							// user 是必选写入的cookie，否则就当登录不成功
							Cookies.set('user', res.adminName);
							Cookies.set('access', 1 );
							Cookies.set('accessToken', res.accessToken );
							Cookies.set('cbURL', '');

							// 头像 写入到 store
							this.$store.commit('setAvator', res.avatar );

							// 删除图形验证码缓存
							util.cache.remove('password_error_lock');

							// 删除初始化缓存，让初始化在登录时候重新加载一次
							util.cache.remove('mainFrameData');

							this.$router.push('/home');
							window.location.reload();
						}

						this.tableLoading = false;
					});

				},
			});
        },
    },
    mounted () {
        this.init();
    },
}
</script>
