<style lang="less">
.feedback-form{
	.ivu-select-dropdown{
		z-index: 1000;
	}
}
</style>

<template>
	<div class="feedback-form">
		<Card v-show="modalShow">
			<div slot="title">
				<Tooltip content="返回">
					<Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/>
				</Tooltip>
			</div>
			<div slot="extra">
				<Button v-if="formItem.handle.edit" type="primary" @click="modalOk">保存</Button>
			</div>

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">

		        <FormItem label="反馈内容">
		        	用户：{{formItem.userName}}
		        	<br />
		            {{formItem.fbContent}}
		            <br >
		            <img v-for="(item,index) in formItem.fbImages" :name="index" :key="index" :src="item" style="width:50px;cursor:pointer;" @click="showImageview(item)" />
		        </FormItem>
		        <FormItem label="反馈状态" prop="fbStatus">
					<Select v-model="formItem.fbStatus" placeholder="请选择状态" style="width:130px">
				        <Option v-for="(item, index) in statusList" :value="index" :key="index">{{ item }}</Option>
				    </Select>
			    </FormItem>

			    <!--编辑器组件-->
				<UEditor ref="ueditor"></UEditor>

	        </Form>

	   	</Card>
	</div>
</template>

<script>
import util from '@/libs/util.js';
import UEditor from '@/views/my-components/ueditor/ueditor.vue';

export default {
  name: 'feedbackForm',
  components: {
    UEditor
  },
  data () {
    	// const checkUserIds = (rule, val, callback) => {
    //   	if ((this.formItem.userIds.length > 0 && this.formItem.type == this.typeLabel2) || this.formItem.type == this.typeLabel1) {
    //       	callback();
    // } else {
    	// 		callback(new Error('指定发送的会员不能为空'));
    // }
    // };

    return {
        	// 模态框
        	modalShow: false,
        	modalEditIndex: '',

        	// 表单内容
        	formItem: {
        		fbId: 0,
        		fbImages: '',
        		fbContent: '',
        		fbStatus: 0,
        		userName: '',
        adminRemark: '',
        handle: {
          edit: false
        }
        	},

        	// 表单数据规则
        	ruleValidate: {
        // messageTitle:[{ required: true, message: '消息标题不能为空', trigger: 'blur' },],
        	},

        	// ueditor 配置
        	ueditorConfig: {
        		initialFrameWidth: 670,
      			initialFrameHeight: 280,
      			autoFloatEnabled: false, // 取消工具条悬浮
      			toolbars: [], // 工具条配置

      			// 图片上传接口(必须初始会的)
      			serverUrl: ''
        	},

        	statusList: []
    };
  },
  methods: {
    	init () {
    	},
    	// 外部 初始化组件方法
    initSet (res) {
        	this.ueditorConfig.serverUrl = res.data.uploadServer;
        	this.ueditorConfig.toolbars = res.data.toolbars;
        	this.statusList = res.data.statusList;

      // 配置加载完毕，才初始化 ueditor
      this.$refs.ueditor.init(this.ueditorConfig);
    },
    // 返回列表
    goBack () {
        	this.modalShow = false;
        	this.$emit('on-close', {});
    },
    // 编辑按钮
    editFeedback (index, row) {
        	this.modalEditIndex = index;
        	// 打开编辑模态框
      this.openModal(row);
    },
    // 打开模态框
    openModal (row) {
        	this.modalShow = true;

    		// 重置表单
        	this.$refs.formValidate.resetFields();

    		// 编辑时候的初始化数据
    		this.formItem.fbId = row.id;
    		this.formItem.fbContent = row.fb_content;
    		this.formItem.fbStatus = Number(row.fb_status);
    		this.formItem.adminRemark = (row.admin_remark == null ? '' : row.admin_remark);
        	this.formItem.userName = row.user_name;
        	this.formItem.fbImages = row.fb_images;
        	this.formItem.handle = row.handle;

    		// 让ueditor 加入编辑的内容
      var ue = this.$refs.ueditor.getUE();
      ue.setContent(this.formItem.adminRemark);
    },
    	// 模态框确认事件
    modalOk () {
        	this.$refs.formValidate.validate((valid) => {
        if (valid) {
                	util.ajax.post(util.apiUrl.feedbackEdit, {
                		id: this.formItem.fbId,
                		fbStatus: this.formItem.fbStatus,
                		adminRemark: this.$refs.ueditor.getUEContent()
                	})
                	.then((response) => {
		    			var res = response.data;
		    			if (res.code) {
		    				this.$Message.success(res.message);
		    				// 通知父级回调
		    				this.$emit('on-save', res.data);
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
    }
  },
  mounted () {
    this.init();
  }
}
</script>
