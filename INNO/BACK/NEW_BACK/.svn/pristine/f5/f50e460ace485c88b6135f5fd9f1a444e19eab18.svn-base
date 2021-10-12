<style lang="less">
.admin-message{
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
	<div class="admin-message">
		<div v-show="showMessageList">

			<div class="table-topbar">
		    	<Row>
			        <Col span="20">
			        	<!--搜索表单-->
						<searchForm ref="search-form" @on-search="searchPage"></searchForm>
			        </Col>
			        <Col span="4">
			        	<Button type="info" icon="md-add" @click="openModal" style="float:right" v-if="canCreate">添加消息</Button>
			        </Col>
			    </Row>
			</div>

			<!--列表-->
			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
			<div v-show="pageTotal>0" style="margin: 10px;overflow: hidden">
		        <div style="float: right;">
		            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
		        </div>
		    </div>
	    </div>

	    <!--表单组件-->
	    <adminMessageForm ref="admin-message-form" @on-save="formSave" @on-close="formClose"></adminMessageForm>

	</div>
</template>

<script>
import util from '@/libs/util.js';
import adminMessageForm from './admin-message-form';
import searchForm from './search-form';

export default {
  components: {
    adminMessageForm,
    searchForm
  },
  data () {
    	return {
    		columns: [],
        	data: [],
        	tableHeight: 500,
        	tableLoading: false,
        	pageTotal: 0,
        	pageSize: 20,
        	canCreate: true,
        	showMessageList: true,

        	modalEditIndex: ''
    	}
  },
  methods: {
    	// 初始化方法
    init () {
        	// 动态计算表高度
        	this.tableHeight = document.body.clientHeight - 170;

        	this.initData();
    },
    initData () {
        	this.tableLoading = true;
      // ajax 请求获取初始化数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.adminMessageList, {
        		isInit: 1
        	})
    		.then((response) => {
    			this.tableLoading = false;
    			var res = response.data;

    			if (res.code) {
    				this.columns = res.data.columns;

    				// 状态标识
    				this.columns[(this.columns.length - 2)].render = (h, params) => {
              const row = params.row;
              const color = row.message_status == 0 ? 'warning' : row.message_status == 1 ? 'success' : 'error';
              const text = row.message_status == 0 ? '未发送' : row.message_status == 1 ? '已发送' : '未知状态';

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
              if (params.row.handle.send && params.row.message_status == 0) {
                        	// 编辑按钮
                buttons.push(h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.sendMessage(params.index, params.row, true)
                    }
                  }
                }, '发送'));
              }
              if (params.row.handle.edit && params.row.message_status == 0) {
                        	// 编辑按钮
                buttons.push(h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editMessage(params.index, params.row, true)
                    }
                  }
                }, '编辑'));
              }
              if (params.row.handle.view && params.row.message_status > 0) {
                // 查看按钮
                buttons.push(h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.viewMessage(params.index, params.row)
                    }
                  }
                }, '查看'));
              }
              if (params.row.handle.remove && params.row.message_status == 0) {
                // 删除
                buttons.push(h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.removeMessage(params.index, params.row)
                    }
                  }
                }, '删除'));
              }
              return h('div', { style: { textAlign: 'center' } }, buttons);
            }

    				// 初始化表数据
    				this.data = res.data.items;
    				this.pageTotal = Number(res.data.total);
    				this.pageSize = Number(res.data.pageSize);
    				this.canCreate = res.data.canCreate;

    				// 初始化ueditor 编辑器
    				this.$refs['admin-message-form'].initSet(res);

    				// 初始化搜索头组件
    				this.$refs['search-form'].initData(res.data.catList);
    			}
        });
    },
    // 切换分页
    changePage (page) {
      this.tableLoading = true;
      // ajax 请求获取数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.adminMessageList, {
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
    // 搜索 - 回调
    searchPage (searchForm) {
        	this.tableLoading = true;
        	// ajax 请求获取数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.adminMessageList, searchForm)
    		.then((response) => {
    			this.tableLoading = false;
    			var res = response.data;
    			if (res.code) {
    				// 初始化表数据
    				this.data = res.data.items;
    				this.pageTotal = Number(res.data.total);
    				this.pageSize = Number(res.data.pageSize);
    			}
        });
    },
    // 编辑按钮
    editMessage (index, row, showButton) {
        	this.modalEditIndex = index;
        	// 打开编辑模态框
      this.openModal(row, showButton);
    },
    // 查看按钮处理
    viewMessage (index, row) {
      this.editMessage(index, row, false);
    },
    openModal (row, showButton) {
        	this.showMessageList = false;
        	this.$refs['admin-message-form'].openModal(row, showButton);
    },
    // 发送消息
    sendMessage (index, row) {
        	this.$Modal.confirm({
        title: '发送消息',
        content: '确定发送消息吗？',
        okText: '确定发送',
        cancelText: '取消',
        onOk: () => {
	            	this.tableLoading = true;

	            	// ajax 请求获取数据，然后动态更新下面数据源
	            	util.ajax.post(util.apiUrl.adminMessageSend, {
	            		messageId: row.id
	            	})
		    		.then((response) => {
		    			var res = response.data;
		    			if (res.code) {
		    				// 初始化表数据
		    				this.data[index].message_status = 1;
		    				this.data[index].handle.edit = false;
		    				this.data[index].handle.send = false;
		    				this.data[index].handle.remove = false;
		    			}

		    			this.tableLoading = false;
            });
        }
      });
    },
    // 删除管理员
    removeMessage (index, row) {
        	this.$Modal.confirm({
        title: '删除消息',
        content: '确定删除消息吗？删除后不能恢复！确定吗？',
        okText: '确定删除',
        cancelText: '取消',
        onOk: () => {
                	this.tableLoading = true;
	            	// ajax 请求获取数据，然后动态更新下面数据源
	            	util.ajax.post(util.apiUrl.adminMessageRemove, {
	            		messageId: row.id
	            	})
		    		.then((response) => {
		    			var res = response.data;
		    			if (res.code) {
		    				// 修改表数据
		    				this.pageTotal--;
		    				this.$delete(this.data, index);
		    				this.$Message.success(res.message);
		    			} else {
		    				this.$Message.error(res.message);
		    			}
		    			this.tableLoading = false;
            });
        }
      });
    },
    // 表单关闭回调函数
    formClose () {
        	this.showMessageList = true;
    },
    // 表单保存的回调函数
    formSave (obj, editId) {
        	if (editId == 0) {
        // 新增： 给列表数组加入新数据
        this.data.unshift(obj.data);

        // 初始化表数据
	    		this.pageTotal = Number(obj.total);
      } else {
            	// 编辑
	        	for (var i in obj.data) {
		        	// 修改：更新data 数据即可,更新数据用 this.$set()
		            this.$set(this.data[this.modalEditIndex], i, obj.data[i]);
	        	}
        	}
    }
  },
  mounted () {
    this.init();
  }
}
</script>
