<style lang="less">
</style>

<template>
    <div>
    	<Modal
    		v-model="showModal"
    		:loading="modalLoading"
    		:title="modalTitle"
	    	@on-ok="updateEmail">

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">
	        	<FormItem label="Email地址" prop="email">
		            <Input v-model="formItem.email" type="email" placeholder="请输入email地址" style="width:300px;"></Input>
		        </FormItem>
		        <FormItem label="验证码" prop="vcode">
		        	<Row>
		                <Col span="11">
		            		<Input v-model="formItem.vcode" placeholder="请输入邮件验证码"></Input>
		            	</Col>
		            	<Col span="11" offset="1">
		                    <Button type="info" @click="sendMail" :disabled="sendButtonDisabled">{{getCodeName}}</Button>
						</Col>
					</Row>
		        </FormItem>
	        </Form>

	        <Spin size="large" fix v-if="spinShow"></Spin>

	    </Modal>
    </div>
</template>

<script>
import util from '@/libs/util.js';
import Cookies from 'js-cookie';

export default {
  name: 'bindEmail',
  components: {

  },
  data () {
    	return {
    		showModal: false, // 模态框
    		modalTitle: '绑定Email',
    		modalLoading: true,
      spinShow: false,

      formItem: {
            	email: '',
            	vcode: ''
      },

      // 找回密码表单数据规则
        	ruleValidate: {
        		email: [{ required: true, message: 'email不能为空', trigger: 'blur' }],
        		vcode: []
        	},

      getCodeName: '发送验证邮件',
      sendButtonDisabled: false,

      // 倒计时
        	vclock: {}
    	}
  },
  methods: {
    	init () {
    		// 判断倒计时是否还在
      if (Cookies.get('sendEmailCodeTime') != null) {
        this.sendButtonDisabled = true;
        this.vcodeClock(Cookies.get('sendEmailCodeTime'));
      }
    	},
    	// 提供给父组件使用
    	openModal () {
        	this.showModal = true;
    },
    // 倒计时
    vcodeClock (second) {
        	this.vclock = setInterval(() => {
        		if (second == 0) {
        			clearInterval(this.vclock);
        			Cookies.remove('sendEmailCodeTime');
        			this.sendButtonDisabled = false;
        			this.getCodeName = '发送验证邮件';
        		} else {
            		this.getCodeName = '重新发送(' + second + ')';
            		second--;
            		this.sendButtonDisabled = true;
            		Cookies.set('sendEmailCodeTime', second);
        		}
        	}, 1000);
    },
    // 发送email
    sendMail () {
        	if (this.formItem.email == '') {
        		this.$Notice.error({
          title: '发送失败',
          desc: 'Email 不能为空！'
        });
        		return;
        	}

        	this.spinShow = true;

        	// ajax 发送验证码邮件
        	util.ajax.post(util.apiUrl.sendEmailCode, {
   				email: this.formItem.email
        	})
    		.then((response) => {
    			var res = response.data;

    			if (res.code) {
            this.$Notice.success({
	                    title: '发送成功',
	                    desc: res.message
	                });

	                // 发送成功，激活倒计时
    				var second = Cookies.get('sendEmailCodeTime') != null ? Number(Cookies.get('sendEmailCodeTime')) : 180;
                	Cookies.set('sendEmailCodeTime', second, { expires: second });
                	this.vcodeClock(second);
    			} else {
    				this.$Notice.error({
	                    title: '操作失败',
	                    desc: res.message
	               });
    			}
    			this.spinShow = false;
        });
    },
    // ajax 更新修改当前用户的email
    updateEmail () {
        	this.$refs.formValidate.validate((valid) => {
        if (valid) {
                	this.modalLoading = true;

                	// ajax 请求更新email
		        	util.ajax.post(util.apiUrl.bindEmail, {
		   				email: this.formItem.email,
		   				vcode: this.formItem.vcode
		        	})
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
		                    this.$Notice.success({
			                    title: '操作成功',
			                    desc: res.message
			                });

			                this.modalShow = false;
		    			} else {
		    				this.$Notice.error({
			                    title: '操作失败',
			                    desc: res.message
			                });

		    				// 验证失败，不关闭模态框
		                	this.modalShow = true;
		                    this.modalLoading = false;

		                    setTimeout(() => {
			                    this.modalLoading = true;
			                }, 50);
		    			}
            });
	        	} else {
                	// 验证失败，不关闭模态框
                	this.modalShow = true;
          this.modalLoading = false;

          setTimeout(() => {
	                    this.modalLoading = true;
	                    this.openModal();
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
