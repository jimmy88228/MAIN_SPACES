<style lang="less">
.cuser-list{
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
	<div class="cuser-list">
		<div v-show="showList">
			<div class="table-topbar">
		    	<Row>
			        <Col span="20">
			        	<Form ref="formSearch" :model="formSearch" inline>
			        		<FormItem>
					            <Input v-model="formSearch.searchq" style="width:250px;" placeholder="用户名/昵称/手机号 模糊查询" clearable search enter-button
						    @on-search="searchPage"
						    @on-clear="searchPage"
						    @keydown.native.enter.prevent ="searchPage"></Input>
					        </FormItem>
			        	</Form>
			        </Col>
			        <Col span="4"></Col>
			    </Row>
			</div>

			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
			<div v-show="pageTotal>0" style="margin: 10px;overflow: hidden">
		        <div style="float: right;">
		            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
		        </div>
		    </div>
	    </div>

		<!--用户详情组件-->
	    <cuserForm ref="cuser-form" @on-close="closeUserForm" @on-save="saveUserForm"></cuserForm>
	</div>
</template>

<script>
import util from '@/libs/util.js';
import cuserForm from './cuser-form';

export default {
  components: {
    cuserForm
  },
  data () {
    return {
        	// 列表
        	columns: [],
        	data: [],

        	tableHeight: 500,
        	tableLoading: false,
        	pageTotal: 0,
        	pageSize: 20,

        	// 搜索表单
        	formSearch: {
        		searchq: ''
        	},

        	showList: true
    };
  },
  methods: {
    	// 初始化方法
    init () {
        	// 动态计算表高度
        	this.tableHeight = document.body.clientHeight - 170;

      this.tableLoading = true;
      // ajax 请求获取初始化数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.cuserList, {
        		isInit: 1
        	})
    		.then((response) => {
          this.tableLoading = false;
    			var res = response.data;

    			if (res.code) {
    				this.columns = res.data.columns;

    				// 头像
    				this.columns[0].render = (h, params) => {
              return h('div', [
                h('Avatar', {
                  props: {
                    src: params.row.wx_avatar,
                    icon: 'md-person',
                    size: 'large'
                  },
                  style: {
                                	marginRight: '10px',
                                	marginTop: '10px',
                                	marginBottom: '10px'
                  }
                }),
                h('strong', {
                            	style: {
                            		overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                            	}
                }, params.row.wx_nick_name + (params.row.name != null ? ' / ' + params.row.name : ''))
              ]);
            };

    				// 关注微信
    				this.columns[(this.columns.length - 4)].render = (h, params) => {
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
    				this.columns[(this.columns.length - 2)].render = (h, params) => {
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
    				this.columns[(this.columns.length - 1)].render = (h, params) => {
              var buttons = [];
              if (params.row.handle.view) {
                        	// 编辑按钮
                buttons.push(h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editUser(params.index, params.row)
                    }
                  }
                }, '查看'));
              }
              return h('div', buttons);
            }

    				// 初始化表数据
    				this.data = res.data.items;
    				this.pageTotal = Number(res.data.total);
    				this.pageSize = Number(res.data.pageSize);
    				this.canCreate = res.data.canCreate;
    			}
        });
    },
    // 切换分页
    changePage (page) {
      this.tableLoading = true;
      // ajax 请求获取数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.cuserList, {
        		page: page
        	})
    		.then((response) => {
    			var res = response.data;
    			if (res.code) {
    				// 初始化表数据
    				this.data = res.data.items;
    				this.pageTotal = Number(res.data.total);
    				this.pageSize = Number(res.data.pageSize);
    			}

    			this.tableLoading = false;
        });
    },
    // 搜索
    searchPage () {
        	this.tableLoading = true;
        	// ajax 请求获取数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.cuserList, {
        		searchq: this.formSearch.searchq
        	})
    		.then((response) => {
    			var res = response.data;
    			if (res.code) {
    				// 初始化表数据
    				this.data = res.data.items;
    				this.pageTotal = Number(res.data.total);
    				this.pageSize = Number(res.data.pageSize);
    			}

    			this.tableLoading = false;
        });
    },
    // 编辑按钮
    editUser (index, row) {
        	this.showList = false;

        	this.$refs['cuser-form'].editUser(index, row);
    },
    // 回调关闭表单
    closeUserForm (obj) {
        	this.showList = true;
    },
    // 编辑内容，保存完毕的回调
    saveUserForm (obj) {
        	// 修改：更新data 数据即可,更新数据用 this.$set()
        	for (var i in obj.data) {
        		this.$set(this.data[obj.index], i, obj.data[i]);
        	}
    }
  },
  mounted () {
    this.init();
  }
}
</script>
