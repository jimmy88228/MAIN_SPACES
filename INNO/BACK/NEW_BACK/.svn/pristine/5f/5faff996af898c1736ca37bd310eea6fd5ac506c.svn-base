<style lang="less">
.user-message{
	.table-topbar{
	    .ivu-form-item{
		margin-bottom: 10px;
	    }
	    .ivu-input-icon-clear{
		right:50px;
	    }
	}
	.message-list-noshow-footer .ivu-modal-footer{
	    display: none;
	}
	.message-form{
		.ivu-select-dropdown{
			z-index: 1000;
		}
	}
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.tran-resetform-enter-active {
  transition: all .3s ease;
}
.tran-resetform-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.tran-resetform-enter, .tran-resetform-leave-to{
  transform: translateY(20px);
  opacity: 0;
}
</style>

<template>
	<div class="user-message">
		<div class="table-topbar">
	    	<Row>
		        <Col span="20">
		        	<Form ref="formSearch" :model="formSearch" inline>
		        		<FormItem>
				            <Input v-model="formSearch.searchq" placeholder="消息标题 模糊查询" clearable search enter-button
					    @on-search="searchPage"
					    @on-clear="searchPage"
					    @keydown.native.enter.prevent ="searchPage"></Input>
				        </FormItem>
		        	</Form>
		        </Col>
		        <Col span="4">
		        	<Button type="info" icon="md-add" @click="openModal" style="float:right" v-if="canCreate">添加消息</Button>
		        </Col>
		    </Row>
		</div>

		<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
		<div v-show="pageTotal>0" style="margin: 10px;overflow: hidden">
	        <div style="float: right;">
	            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
	        </div>
	    </div>

	    <Modal
	        v-model="modalShow"
	        :title="modalTitle"
	        :loading="modalLoading"
	        :styles="{top:'20px'}"
	        :class="modalClass"
	        :width="700"
	        @on-ok="modalOk">

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100" class="message-form">

		        <FormItem label="消息标题" prop="messageTitle">
		            <Input v-model="formItem.messageTitle" placeholder="请输入消息标题"></Input>
		        </FormItem>
		        <FormItem label="消息分类" prop="catId">
		            <Select v-model="formItem.catId" placeholder="请选择消息分类" :clearable="true" ref="formCatId">
		                <Option v-for="(cat,key) in catList" :name="key" :key="key" :value="key">{{cat.title}}</Option>
		            </Select>
		        </FormItem>
		        <FormItem label="发送对象" prop="type">
					<RadioGroup v-model="formItem.type" type="button" @on-change="messageTypeChange">
				        <Radio :label="typeLabel1"></Radio>
				        <Radio :label="typeLabel2"></Radio>
				    </RadioGroup>
			    </FormItem>
			    <transition name="tran-resetform">
			    <FormItem label="选择用户" prop="userIds" v-show="formItem.showUserIds">
			    	<AutoComplete
				        v-model="formItem.userSearch"
				        :data="userList2"
						:clearable="true"
				        @on-search="searchUser"
				        @on-select="selectUser"
				        placeholder="输入用户名/昵称/手机选择会员"
				        icon="md-person"
				        style="width:200px"></AutoComplete>

				    <Button type="success" @click="addSelectUser">
			            	添加
			            <Icon type="chevron-right"></Icon>
			        </Button>
				    <Select v-model="formItem.userIds" multiple style="width:290px">
				        <Option v-for="item in formItem.userList" :value="item.user_id" :key="item.user_id">{{ item.user_name }}</Option>
				    </Select>
			    </FormItem>
			    </transition>
		        <UEditor ref="ueditor"></UEditor>
	        </Form>
	    </Modal>

	</div>
</template>

<script>
import util from '@/libs/util.js';
import UEditor from '../../my-components/ueditor/ueditor.vue';

export default {
  components: {
    UEditor
  },
  data () {
        	const checkUserIds = (rule, val, callback) => {
	        	if ((this.formItem.userIds.length > 0 && this.formItem.type == this.typeLabel2) || this.formItem.type == this.typeLabel1) {
	            	callback();
	            } else {
	    			callback(new Error('指定发送的会员不能为空'));
	            }
	        };
        	return {
        		columns: [],
            	data: [],
            	tableHeight: 500,
            	tableLoading: false,
            	pageTotal: 0,
            	pageSize: 20,
            	canCreate: true,
            	catList: [],
            	userList: [],
            	userList2: [],
            	typeLabel1: '所有会员',
            	typeLabel2: '指定会员',

            	// 搜索表单
            	formSearch: {
            		searchq: ''
            	},

            	// ueditor 配置
            	ueditorConfig: {
            		initialFrameWidth: 670,
          			initialFrameHeight: 320,
          			// 图片上传接口(必须初始会的)
          			serverUrl: ''
            	},

            	// 模态框
            	modalShow: false,
            	modalTitle: '',
            	modalLoading: true,
            	modalEditIndex: '',
            	modalClass: '',

            	// 表单内容
            	formItem: {
            		messageId: 0,
            		messageTitle: '',
            		messageContent: '',
            		messageCat: 1,
            		messageStatus: 0,
            		catId: 0,
            		type: '',
            		userIds: [],
            		showUserIds: false,

            		// 搜索会员关键词
            		userSearch: '',
            		userSearchId: '',
            		// 搜索会员的临时索引
            		userSearchIndex: []
            	},

            	// 表单数据规则
            	ruleValidate: {
        messageTitle: [{ required: true, message: '消息标题不能为空', trigger: 'blur' }],
        catId: [{ required: true, message: '消息分类不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '发送类型不能为空', trigger: 'blur' }],
        userIds: [{ validator: checkUserIds, message: '指定发送的会员不能为空', trigger: 'click' }]
            	}
        	}
  },
  methods: {
        	// 初始化方法
    init () {
            	// 动态计算表高度
            	this.tableHeight = document.body.clientHeight - 210;

      this.tableLoading = true;
      // ajax 请求获取初始化数据，然后动态更新下面数据源
            	util.ajax.post(util.apiUrl.userMessageList, {
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
              const color = row.message_status == 1 ? 'green' : row.message_status == 0 ? 'red' : 'red';
              const text = row.message_status == 0 ? '编辑中' : row.message_status == 1 ? '已发送' : '未知状态';

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
              if (params.row.handle.send) {
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
                      this.sendMessage(params.index, params.row, true)
                    }
                  }
                }, '发送'));
              }
              if (params.row.handle.edit) {
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
                      this.editMessage(params.index, params.row, true)
                    }
                  }
                }, '编辑'));
              }
              if (params.row.handle.view) {
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
              if (params.row.handle.remove) {
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
	    				this.catList = res.data.catList;

	    				this.ueditorConfig.serverUrl = res.data.uploadServer;
	    				// 配置加载完毕，才初始化 ueditor
            this.$refs.ueditor.init(this.ueditorConfig);
	    			}
        });
    },
    // 切换分页
    changePage (page) {
      this.tableLoading = true;
      // ajax 请求获取数据，然后动态更新下面数据源
            	util.ajax.post(util.apiUrl.userMessageList, {
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
            	util.ajax.post(util.apiUrl.userMessageList, {
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
    editMessage (index, row, showFooter) {
            	this.modalEditIndex = index;
            	// 打开编辑模态框
      this.openModal(row);

      if (showFooter == true) {
                	this.modalClass = '';
                	this.modalTitle = '修改消息';
      } else {
                	// 屏蔽 确定按钮
                	this.modalClass = 'message-list-noshow-footer';
                	this.modalTitle = '查看消息';
      }
    },
    // 查看按钮处理
    viewMessage (index, row) {
      this.editMessage(index, row, false);
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
		            	util.ajax.post(util.apiUrl.userMessageSend, {
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
    // 删除用户
    removeMessage (index, row) {
            	this.$Modal.confirm({
        title: '删除消息',
        content: '确定删除消息吗？删除后不能恢复！确定吗？',
        okText: '确定删除',
        cancelText: '取消',
        onOk: () => {
                    	this.tableLoading = true;
		            	// ajax 请求获取数据，然后动态更新下面数据源
		            	util.ajax.post(util.apiUrl.userMessageRemove, {
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
    // 打开模态框
    openModal (row) {
            	this.modalShow = true;
        		// 重置表单
            	this.$refs.formValidate.resetFields();

        		// 初始化表单数据
            	// 如果是新增 roleId = 0;否则就是大于0
            	this.formItem.messageId = typeof (row.id) !== 'undefined' ? Number(row.id) : 0;
            	if (this.formItem.messageId == 0) {
            		this.modalTitle = '添加消息';
        			this.modalClass = '';

            		// 新建时候的初始化数据
            		this.formItem.messageTitle = '';
            		this.formItem.messageContent = '';
            		this.formItem.catId = 0;
            		this.formItem.userIds = [];
            		this.formItem.type = '';
            		this.formItem.showUserIds = false;
            		this.formItem.userSearch = '';
            		this.formItem.userList = [];

            		// 重设select 控件
            		window.setTimeout(() => {
            			this.$refs.formCatId.clearSingleSelect();
            		}, 500);
            	} else {
            		this.modalTitle = '修改消息';

            		// 编辑时候的初始化数据
            		this.formItem.messageTitle = row.message_title;
            		this.formItem.messageContent = row.message_content;
            		this.formItem.messageStatus = row.message_status == 1 ? '已发送' : '编辑中';
            		this.formItem.catId = row.cat_id;
            		this.formItem.userIds = row.user_ids;
            		this.formItem.userSearch = '';
            		this.formItem.userList = row.userList;
            		if (row.user_ids.indexOf('all') == -1) {
            			this.formItem.showUserIds = true;
            			this.formItem.type = this.typeLabel2;
            		} else {
            			this.formItem.type = this.typeLabel1;
            			this.formItem.showUserIds = false;
            		}
            	}

        		// 让ueditor 加入编辑的内容
    			var ue = this.$refs.ueditor.getUE();
    			ue.setContent(this.formItem.messageContent);
    },
    // radio 发生变化处理函数
    messageTypeChange (value) {
            	if (value == this.typeLabel1) {
            		this.formItem.showUserIds = false;
            	} else {
            		this.formItem.showUserIds = true;
            	}
    },
    // 模态框确认事件
    modalOk () {
            	this.$refs.formValidate.validate((valid) => {
        if (valid) {
                    	// 获取组件的信息
          this.formItem.messageContent = this.$refs.ueditor.getUEContent();
          if (this.formItem.type == this.typeLabel1) {
            this.formItem.userIds = 'all';
          }
                    	util.ajax.post((this.formItem.messageId == 0 ? util.apiUrl.userMessageAdd : util.apiUrl.userMessageEdit), {
                    		messageId: this.formItem.messageId,
                    		messageTitle: this.formItem.messageTitle,
                    		messageContent: this.formItem.messageContent,
                    		catId: this.formItem.catId,
                    		userIds: this.formItem.userIds
                    	})
                    	.then((response) => {
			    			var res = response.data;
			    			if (res.code) {
			    				// 初始化表数据
			    				this.pageTotal = Number(res.data.total);
			    				this.modalShow = false;

			    				this.$Message.success(res.message);

			    				if (this.formItem.messageId == 0) {
			                        // 新增： 给列表数组加入新数据
			                        this.data.unshift(res.data);
		                        } else {
		                        	// 修改：更新data 数据即可,更新数据用 this.$set()
		                        	this.$set(this.data, this.modalEditIndex, res.data);
		                        }
			    			} else {
			    				this.$Message.error(res.message);
			    			}
			    			this.tableLoading = false;
            });
        } else {
                    	// 验证失败，不关闭模态框
                    	this.modalShow = true;
          this.$Message.error('必填项不能为空！');
                    	this.modalLoading = false;

          setTimeout(() => {
		                    this.modalLoading = true;
		                }, 50);
        }
      });
    },
    // 搜索用户
    searchUser () {
            	// ajax 请求获取数据，然后动态更新下面数据源
            	util.ajax.post(util.apiUrl.userList, {
            		searchq: this.formItem.userSearch,
            		isInit: 1
            	})
	    		.then((response) => {
	    			var res = response.data;
	    			if (res.code) {
	    				// 初始化表数据
	    				var arrData = [];
	    				this.formItem.userSearchIndex = [];
	    				for (var i in res.data.items) {
	    					arrData[i] = res.data.items[i].user_name + res.data.items[i].mobile + '/' + res.data.items[i].nick_name;
	    					// 做索引，提供给选中的时候用
	    					this.formItem.userSearchIndex[arrData[i]] = res.data.items[i].user_id;
	    				}
	    				this.userList2 = arrData;
	    			}
        });
    },
    // 选中autocomplete
    selectUser (val) {
            	this.formItem.userSearchId = this.formItem.userSearchIndex[val];
    },
    // 添加到多选select控件
    addSelectUser () {
            	if (this.formItem.userIds.indexOf(this.formItem.userSearchId) == -1) {
	            	this.formItem.userList.push({
	            		user_id: this.formItem.userSearchId,
	            		user_name: this.formItem.userSearch
	            	});
	            	this.formItem.userIds.push(this.formItem.userSearchId);
            	}
    }
  },
  mounted () {
    this.init();
  }
}
</script>
