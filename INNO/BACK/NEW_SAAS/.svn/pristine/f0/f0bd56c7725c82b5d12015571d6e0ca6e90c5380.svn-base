<style lang="less">
.test-email{
	.default-input{
		width:300px;
	}
}
</style>

<template>
	<div class="test-email">
		<Modal
	        v-model="modalShow"
	        :title="modalTitle"
	        :loading="modalLoading"
	        @on-ok="sendMail">

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">

		        <FormItem label="收件人邮箱" prop="testEmail">
					<Input v-model="formItem.testEmail" class="default-input" placeholder="收件人邮箱地址" clearable></Input>
		        </FormItem>
		        <FormItem label="内容" prop="testContent">
					<Input v-model="formItem.testContent" type="textarea" class="default-input" placeholder="邮件内容"></Input>
		        </FormItem>

		    </Form>

	    </Modal>
	</div>
</template>

<script>
import util from '@/libs/util.js';

export default {
  name: 'testEmail',
  components: {

  },
  data () {
    	return {
    		modalShow: false,
    		modalTitle: '发送测试邮件',
    		modalLoading: true,

    		// 表单内容
        	formItem: {
        		testEmail: '',
        		testContent: '你好，这是一封测试邮件。收到邮件后请不要回复！'
        	},

    		// 表单数据规则
        	ruleValidate: {
        testEmail: [{ required: true, message: '测试收件人邮箱 不能为空', trigger: 'blur' }],
        testContent: [{ required: true, message: '测试邮件内容 不能为空', trigger: 'blur' }]
        	}
    	}
  },
  methods: {
    	init () {
    	},
    	openModel () {
    		this.modalShow = true;
    	},
    	// 发送邮件事件
    	sendMail () {
    		this.$refs.formValidate.validate((valid) => {
        if (valid) {
                	// ajax 保存数据
                	util.ajax.post(util.apiUrl.sendTestEmail, {
                		sendTo: this.formItem.testEmail,
        				content: this.formItem.testContent
	            	})
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
		    				// 保存成功
	                        this.$Message.success(res.message);
	                        this.modalShow = false;
	                    } else {
		    				this.modalShow = true;

                    		this.$Message.error({
                    			content: res.message,
                    			duration: 5
                    		});

                    		this.modalLoading = false;
		                    setTimeout(() => {
			                    this.modalLoading = true;
			                }, 50);
		    			}
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
