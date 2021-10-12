<style lang="less">
</style>

<template>
    <div>
    	<Modal v-model="modalShow"
    		:loading="modalLoading"
    		:draggable="true"
    		title="重设管理员密码"
	    	@on-ok="modalOk">

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
	        	<FormItem label="新密码" prop="newPassword">
	        		<Input v-model="formItem.newPassword" placeholder="请输入当前管理员新密码"></Input>
	        	</FormItem>
	        </Form>

	    </Modal>
    </div>
</template>

<script>
import util from '@/libs/util.js';

export default {
  name: 'resetPassword',
  components: {

  },
  data () {
    	return {
    		modalShow: false,
    		modalLoading: true,
    		adminId: 0,

    		formItem: {
    			newPassword: ''
    		},

    		// 表单数据规则
        	ruleValidate: {
        		newPassword: [{ required: true, message: '密码不能为空', trigger: 'blur' },
        					{ type: 'string', min: 6, message: '密码不能小于6个字符！', trigger: 'blur' }]
        	}
    	}
  },
  methods: {
    	openModal (id) {
    		this.modalShow = true;
    		this.adminId = id;

    		this.formItem.newPassword = '';
    		// 重置表单
        	this.$refs.formValidate.resetFields();
    	},
    	modalOk () {
    		this.$refs.formValidate.validate((valid) => {
        if (valid) {
		    		// ajax 请求获取数据，然后动态更新下面数据源
		        	util.ajax.post(util.apiUrl.adminUserResetPassword, {
		        		id: this.adminId,
		        		newPassword: this.formItem.newPassword
		        	})
		    		.then((response) => {
		    			var res = response.data;
		    			if (res.code) {
		    				this.$Message.success(res.message);
		    				this.modalShow = false;
		    			} else {
		    				this.modalShow = true;
		                    this.$Message.error(res.message);
		                    this.modalLoading = false;

		                    setTimeout(() => {
			                    this.modalLoading = true;
			                }, 50);
		    			}
            });
        } else {
                	// 验证失败，不关闭模态框
          this.$Message.error('必填项不能为空！');

          setTimeout(() => {
                    	// 主要是第一次自动关闭
                    	this.modalShow = true;
          }, 50);

          setTimeout(() => {
	                    this.modalLoading = false;
	                    this.$nextTick(() => {
	                    	this.modalLoading = true;
	                    });
	                }, 500);
        }
      });
    	}
  }
}
</script>
