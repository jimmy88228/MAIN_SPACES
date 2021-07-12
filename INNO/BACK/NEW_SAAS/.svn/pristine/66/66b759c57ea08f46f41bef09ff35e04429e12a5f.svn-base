<style lang="less">
</style>

<template>
	<div>
		<!--图片验证码-->
	    <Modal
	        v-model="captchaShow"
	        :title="captchaTitle"
	        :loading="captchaLoading"
	        :styles="{top: '25%'}"
	        :width="320"
	        :closable="false"
	        :mask-closable="false"
	        @on-ok="captchaOk"
	        @on-cancel="captchaCancel">

	        <Form ref="captchaValidate" :model="formCaptcha" :rules="ruleCaptcha">
	        	<FormItem prop="captcha">
					<Row>
		                <Col span="13">
			                <Input v-model="formCaptcha.captcha" placeholder="请输入图片验证码" clearable></Input>
						</Col>
		                <Col span="10" offset="1">
		                    <img :src="formCaptcha.src" @click="updateCaptcha" style="cursor: pointer;" />
						</Col>
					</Row>
	            </FormItem>
	        </Form>

	        <Spin size="large" fix v-if="captchaSpinShow"></Spin>
	    </Modal>
	</div>
</template>

<script>
import util from '@/libs/util.js';

/**
 * 用户注册图形验证码
 */
export default {
  name: 'registerCaptcha',
  components: {

  },
  data () {
    return {
        	// 图片验证码表单内容
        	formCaptcha: {
        		captcha: '',
        		src: '',
        		captchaKey: ''
        	},

        	registerMobile: '',

        	// 图片验证码规则
        	ruleCaptcha: {
        		captcha: [{ required: true, message: '图片验证码不能为空', trigger: 'blur' },
        				{ type: 'string', min: 4, message: '图片验证码不能少于4位', trigger: 'blur' }]
        	},

        	// 图片验证码模态框
      captchaShow: false,
      captchaTitle: '输入图片验证码',
      captchaLoading: true,
      captchaSpinShow: false
    }
  },
  methods: {
    	init () {

    	},
    	 // 图片验证码初始化
    captchaInit (mobile) {
        	this.captchaShow = true;
        	this.captchaSpinShow = true;
        	this.registerMobile = mobile;

        	// 重置图片验证码表单
        	this.$refs.captchaValidate.resetFields();

        	// ajax 获取图形验证码
        	util.ajax.post(util.apiUrl.getCaptcha, {
      })
    		.then((response) => {
    			var res = response.data;
    			if (res.code) {
    				// 关闭加载层
	    			this.captchaSpinShow = false;

	    			// 初始化图片验证码
	    			this.formCaptcha.src = res.data.img;
	    			this.formCaptcha.captchaKey = res.data.key;
    			} else {
    				this.$Message.error(res.message);
    				this.captchaSpinShow = false;
    			}
    		});
    },
    // 更新图片验证码
    updateCaptcha () {
        	this.captchaInit();
    },
    // 取消按钮
    captchaCancel () {
        	this.$emit('on-cancel', {});
    },
    // 图片验证码确认按钮
    captchaOk () {
        	this.captchaLoading = true;

        	this.$refs.captchaValidate.validate((valid) => {
        if (valid) {
                	// ajax 发送图形验证码给服务器，让服务器判断发送手机验证码，
                	util.ajax.post(util.apiUrl.sendRegisterVcode, {
					    mobile: this.registerMobile,
					    captcha: this.formCaptcha.captcha,
					    captchaKey: this.formCaptcha.captchaKey
          })
		    		.then((response) => {
		    			var res = response.data;
		    			if (res.code) {
		    				this.$Message.success(res.message);

		    				// 短信验证码发送成功，可以关闭图形验证码的输入框
		    				this.captchaShow = false;

		    				// 通知父级，短信已经发送成功
		    				this.$emit('on-send', { code: true });
		    			} else {
		    				this.$Message.error(res.message);

		    				// 通知父级，短信已经发送失败
		    				this.$emit('on-send', { code: false });

		    				this.captchaShow = true;
		                    this.captchaLoading = false;

		                    setTimeout(() => {
			                    this.captchaLoading = true;
			                }, 50);
		    			}
		    		});
	        	} else {
                	// 验证失败，不关闭模态框
                	this.captchaShow = true;
          this.captchaLoading = false;

          setTimeout(() => {
	                    this.captchaLoading = true;
	                }, 50);
        }
	         });
    }
  },
  mounted () {
    this.init();
  }
};
</script>
