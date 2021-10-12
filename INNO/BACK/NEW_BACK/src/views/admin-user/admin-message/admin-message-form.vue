<style lang="less">
.admin-message{
	.message-form{
		.ivu-select-dropdown{
			z-index: 1000;
		}
	}
	.editor-box{
		.ivu-form-item-content{
			line-height:1;
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
}
</style>

<template>
	<div class="admin-message">
		<Card v-show="modalShow">

	        <div slot="title">
				<Tooltip content="返回">
					<Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/>
				</Tooltip>
			</div>
			<div slot="extra">
				<Button v-if="(formItem.handle.edit || canCreate) && readOnly == false" type="primary" size="small" @click="modalOk">保存</Button>
			</div>

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100" class="message-form">

		        <FormItem label="消息标题" prop="messageTitle">
		            <Input v-model="formItem.messageTitle" placeholder="请输入消息标题" clearable style="width:400px;"></Input>
		        </FormItem>
		        <FormItem label="消息分类" prop="messageType">
		            <Select v-model="formItem.messageType" ref="formMessageType" placeholder="请选择消息分类" style="width:100px;" @on-change="messageTypeChange">
		                <Option v-for="(cat,key) in catList" :name="key" :key="key" :value="key">{{cat}}</Option>
		            </Select>
		        </FormItem>
		        <FormItem label="发送对象" prop="userType">
					<RadioGroup v-model="formItem.userType" type="button" @on-change="userTypeChange">
				        <Radio label="all">所有会员</Radio>
				        <Radio label="related">指定会员</Radio>
				    </RadioGroup>
			    </FormItem>

			    <transition name="tran-resetform">
			    <FormItem label="选择会员" prop="userIds" v-show="formItem.showAdminIds">
			    	<Row v-if="formItem.user.length > 0">
			    		<Col v-for="(user,index) in formItem.user" :name="index" :key="index" :span="4">
					    	<Avatar v-if="user.id != 0 " :src="user.wx_avatar" icon="md-person" style="margin:0 5px 0 0;"></Avatar>
					    	{{user.wx_nick_name}} ({{user.id}})
			    		</Col>
			    	</Row>
		        	<Button @click="onSelectUser" size="small" type="info">选择用户...</Button>
			    </FormItem>
			    </transition>

			    <div class="editor-box">
				    <FormItem label="">
			        	<UEditor ref="ueditor"></UEditor>
			    	</FormItem>
		    	</div>

				<div v-if="(formItem.handle.edit || canCreate) && readOnly == false" style="text-align: center;border-top:1px solid #eee;padding-top:10px;">
			    	<Button @click="goBack">取消</Button>
			    	<Button type="primary" @click="modalOk">保存</Button>
			    </div>
	        </Form>

	        <!--绑定微信用户的选择器-->
	   		<userSelect ref="user-select" @on-ok="onUserOk"></userSelect>
	    </Card>

	</div>
</template>

<script>
import util from '@/libs/util.js';
import UEditor from '@/views/my-components/ueditor/ueditor.vue';
import userSelect from '@/views/my-components/user-select/user-select';

export default {
  name: 'adminMessageForm',
  components: {
    UEditor,
    userSelect
  },
  data () {
    	return {
    		canCreate: true,
    		readOnly: false,

    		modalShow: false,
    		catList: [],

    		// ueditor 配置
        	ueditorConfig: {
        		initialFrameWidth: 670,
      			initialFrameHeight: 320,
      			autoFloatEnabled: false, // 取消工具条悬浮
      			toolbars: [], // 工具条配置

      			// 图片上传接口(必须初始会的)
      			serverUrl: ''
        	},

        	modalEditIndex: '',

        	// 表单内容
        	formItem: {
        		messageId: 0,
        		messageTitle: '',
        		messageContent: '',
        		messageType: '',
        		messageStatus: 0,
        		userType: '',
        		userIds: [],
        		showAdminIds: false,
        		user: [],
        		handle: {
        			edit: false
        		}
        	},

        	// 表单数据规则
        	ruleValidate: {
        messageTitle: [{ required: true, message: '消息标题不能为空', trigger: 'blur' }],
        messageType: [{ required: true, message: '消息分类不能为空', trigger: 'blur' }],
        userType: [{ required: true, message: '发送对象不能为空', trigger: 'blur' }]
        	}
    	};
  },
  methods: {
    	init () {

    	},
    	// 父组件调用 初始化
    	initSet (res) {
    		this.ueditorConfig.serverUrl = res.data.uploadServer;
        	this.ueditorConfig.toolbars = res.data.toolbars;
        	this.canCreate = res.data.canCreate;
        	this.catList = res.data.catList;

    		// 配置加载完毕，才初始化 ueditor
      this.$refs.ueditor.init(this.ueditorConfig);
    	},
    	// 打开模态框
    openModal (row, showButton) {
        	this.modalShow = true;
    		// 重置表单
        	this.$refs.formValidate.resetFields();
        	if (showButton == false) {
        		this.readOnly = true;
        	} else {
        		this.readOnly = false;
        	}

    		// 初始化表单数据
        	// 如果是新增 roleId = 0;否则就是大于0
        	this.formItem.messageId = typeof (row.id) !== 'undefined' ? Number(row.id) : 0;
        	if (this.formItem.messageId == 0) {
        		// 新建时候的初始化数据
        		this.formItem.messageTitle = '';
        		this.formItem.messageContent = '';
        		this.formItem.messageType = '';
        		this.formItem.userType = '';
        		this.formItem.userIds = [];
        		this.formItem.showAdminIds = false;
        		this.formItem.user = [];

        		// 重设select 控件
        		window.setTimeout(() => {
        			this.$refs.formMessageType.clearSingleSelect();
        		}, 500);
        	} else {
        		// 编辑时候的初始化数据
        		this.formItem.messageTitle = row.message_title;
        		this.formItem.messageContent = row.message_content;
        		this.formItem.messageStatus = row.message_status == 1 ? '已发送' : '编辑中';
        		this.formItem.messageType = row.message_type;
        		this.formItem.userType = row.user_type;
        		this.formItem.userIds = row.user_ids;
        		this.formItem.handle = row.handle;
        		this.formItem.user = row.user;

        		if (row.user_type.indexOf('all') == -1) {
        			this.formItem.showAdminIds = true;
        		} else {
        			this.formItem.showAdminIds = false;
        		}
        	}

    		// 让ueditor 加入编辑的内容
      var ue = this.$refs.ueditor.getUE();
      ue.setContent(this.formItem.messageContent);
    },
    // 模态框确认事件
    modalOk () {
        	this.$refs.formValidate.validate((valid) => {
        if (valid) {
                	// 获取组件的信息
          this.formItem.messageContent = this.$refs.ueditor.getUEContent();

                	util.ajax.post((this.formItem.messageId == 0 ? util.apiUrl.adminMessageAdd : util.apiUrl.adminMessageEdit), {
                		messageId: this.formItem.messageId,
                		messageTitle: this.formItem.messageTitle,
                		messageContent: this.formItem.messageContent,
                		messageType: this.formItem.messageType,
                		userType: this.formItem.userType,
                		userIds: this.formItem.userIds
                	})
                	.then((response) => {
		    			var res = response.data;
		    			if (res.code) {
		    				this.$emit('on-save', res, this.formItem.messageId);
		    				this.$Message.success(res.message);
                this.goBack();
		    			} else {
                    		this.$Message.error(res.message);
		    			}
            });
        } else {
                	// 验证失败，不关闭模态框
                	this.modalShow = true;
          this.$Message.error('必填项不能为空！');
        }
      });
    },
    // 返回列表
    goBack () {
        	this.modalShow = false;
        	this.$emit('on-close', {});
    },
    // radio 发生变化处理函数
    messageTypeChange (value) {
      // 检查某个字段
      this.$refs.formValidate.validateField('messageType', (msg) => {});
    },
    userTypeChange (value) {
        	this.formItem.showAdminIds = (value != 'all');

        	// 检查某个字段
        	this.$refs.formValidate.validateField('userType', (msg) => {});
    },
    // 用户选择
    onSelectUser () {
        	this.$refs['user-select'].openModal((this.formItem.user == null ? [] : [this.formItem.user]), 'multi');
    },
    // 选用户的组件的 回调
    onUserOk (items) {
      if (items.length > 0) {
        this.formItem.userIds = [];
        this.formItem.user = [];

        for (var i in items) {
          if (typeof (items[i].id) !== 'undefined') {
            this.formItem.user.push(items[i]);
            this.formItem.userIds.push(items[i].id);
          }
        }
      }
    }
  },
  mounted () {
    this.init();
  }
}
</script>
