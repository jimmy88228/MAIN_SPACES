<style lang="less">
.reset-pwd{

}
.forget-password-modal{

    .ivu-modal-footer{
        display:none;
    }

    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .tran-resetform-enter-active {
      transition: all .3s ease;
    }
    .tran-resetform-leave-active {
      transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .tran-resetform-enter, .tran-resetform-leave-to{
      transform: translateX(10px);
      opacity: 0;
    }
}
.ext-txt{
	color:#c3c3c3;
	font-size:12px;
	margin-top:20px;
	text-align: center;
	cursor: pointer;

	span:hover{
        color: #0077AA;
    }
}
</style>

<template>
	<div class="reset-pwd">
		<Modal
	        v-model="modalShow"
	        :title="modalTitle"
	        :loading="modalLoading"
	        :styles="{top: '25%'}"
	        :width="320"
	        :closable="modelCloseable"
	        :mask-closable="modelMaskClosable"
	        :mask="showMask"
	        class="forget-password-modal">

			<Form v-if="formGetPasswordShow" ref="formValidate" :model="formGetPassword" :rules="ruleGetPassword" :label-width="60">
	        	<FormItem prop="mobile" label="手机">
	                <Input v-model="formGetPassword.mobile" placeholder="请输入手机号"></Input>
	            </FormItem>

	            <FormItem prop="validateCode" label="验证码">
	                <Row>
		                <Col span="11">
			                <Input v-model="formGetPassword.validateCode" placeholder="请输入验证码" clearable></Input>
		                </Col>
		                <Col span="12" offset="1">
		                    <Button type="info" @click="sendCode" :disabled="sendButtonDisabled">{{getCodeName}}</Button>
		                </Col>
		            </Row>
	            </FormItem>

	            <div style="text-align:center;">
	            	<Divider />
	            	<Button v-if="modelCloseable" type="default" @click="codeCancel" style="width:80px;">取消</Button>
		            <Button type="primary" @click="codeSubmit" style="width:90px;">确定</Button>
		        </div>
	        </Form>

			<div class="ext-txt" v-if="!modelCloseable">
				<span @click="goLogin">登录</span>
				<template v-if="canRegister">
				<Divider type="vertical" />
				<span @click="goRegister">注册</span>
				</template>
			</div>

			<transition name="tran-resetform">
			<Form v-if="formResetShow" ref="resetValidate" :model="formReset" :rules="ruleReset" :label-width="80">
				<FormItem prop="newPassword" label="新密码">
	                <Input type="password" v-model="formReset.newPassword" placeholder="请输入新密码"></Input>
	            </FormItem>

	            <!--密码强度提示组件-->
		        <passwordString ref="password-string"></passwordString>

	            <FormItem prop="confirmPassword" label="确认密码">
	                <Input type="password" v-model="formReset.confirmPassword" placeholder="再次输入新密码"></Input>
	            </FormItem>

	            <div style="text-align:center;">
	            	<Divider />
	            	<Button type="default" @click="resetCancel">取消</Button>
		            <Button type="primary" @click="resetSubmit">重置密码</Button>
		        </div>
			</Form>
			</transition>

			<Spin size="large" fix v-if="spinShow"></Spin>

			<div slot="footer"></div>

	    </Modal>

	    <!--图片验证码-->
	    <Modal
	        v-model="captchaShow"
	        :title="captchaTitle"
	        :loading="captchaLoading"
	        :styles="{top: '25%'}"
	        :width="320"
	        @on-ok="captchaOk">

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
import Cookies from 'js-cookie';
import passwordString from './password-strong';

/**
 * 忘记密码组件
 */
export default {
  name: 'resetPwd',
  components: {
 		passwordString
  },
  data () {
    	const checkConfirmPassword = (rule, val, callback) => {
        	if (val == this.formReset.newPassword) {
            	callback();
      } else {
    			callback(new Error('两次输入的密码不一样'));
      }
    };
    const checkMobile = (rule, val, callback) => {
    		if (/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(val)) {
            	callback();
      } else {
    			callback(new Error('格式有误'));
      }
    };

    	return {
    		// 找回密码模态框
      modalShow: false,
      modalTitle: '',
      modalLoading: true,
      modelCloseable: true,
      modelMaskClosable: true,
      showMask: true,

      canRegister: false,

    		getCodeName: '获取验证码',

    		 // 找回密码表单数据规则
        	ruleGetPassword: {
        		mobile: [{ required: true, message: '手机不能为空', trigger: 'blur' },
        				{ validator: checkMobile, message: '格式有误', trigger: 'blur' }],
        		validateCode: []
        	},

        	// 加载进度层
      spinShow: false,

      // 重设密码表单，绑定数据
      formReset: {
            	newPassword: '',
            	confirmPassword: '',
            	resetToken: ''
      },

      // 重设密码的规则
 			ruleReset: {
        		newPassword: [{ required: true, message: '不能为空', trigger: 'blur' },
        					{ type: 'string', min: 6, message: '密码长度不能少于6位', trigger: 'blur' }],
        		confirmPassword: [{ required: true, message: '不能为空', trigger: 'blur' },
        						{ type: 'string', min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
        						{ validator: checkConfirmPassword, message: '两次输入的密码不一样', trigger: 'blur' }]
        	},

        	// 图片验证码规则
        	ruleCaptcha: {
        		captcha: [{ required: true, message: '图片验证码不能为空', trigger: 'blur' },
        				{ type: 'string', min: 4, message: '图片验证码不能少于4位', trigger: 'blur' }]
        	},
        	// 图片验证码表单内容
        	formCaptcha: {
        		captcha: '',
        		src: '',
        		captchaKey: ''
        	},

        	// 图片验证码模态框
      captchaShow: false,
      captchaTitle: '图片验证码',
      captchaLoading: true,
      captchaSpinShow: false,

    		// form 绑定的数据
        	formGetPassword: {
        		mobile: '',
        		validateCode: ''
        	},
        	formGetPasswordShow: true,
        	sendButtonDisabled: false,

        	formResetShow: false,

        	// 倒计时
        	vclock: {}
    	}
  },
  methods: {
    	init () {
    		this.canRegister = util.canRegister;
    	},
    	// 获取短信验证码
    sendCode () {
        	// 动态设定input 输入规则
	        this.$set(this.ruleGetPassword, 'validateCode', []);

        	this.$refs.formValidate.validate((valid) => {
        		// 验证表单
        		if (valid && this.sendButtonDisabled == false) {
	        		// 判断是否输入了图片验证码
	    			if (this.formCaptcha.captcha == '') {
		        		this.captchaShow = true;
		        		this.captchaInit();
	    			} else {
	                	// 把按钮disable
	                	this.sendButtonDisabled = true;
	                	this.captchaLoading = true;

	                	// ajax 发送验证码
	                	util.ajax.post(util.apiUrl.sendVcode, {
						    mobile: this.formGetPassword.mobile,
						    captcha: this.formCaptcha.captcha,
						    captchaKey: this.formCaptcha.captchaKey
            })
			    		.then((response) => {
			    			var res = response.data;
			    			if (res.code) {
			    				this.$Message.success(res.message);

			    				this.captchaShow = false;

			    				// 发送成功，激活倒计时
			    				var second = Cookies.get('sendCodeTime') != null ? Number(Cookies.get('sendCodeTime')) : 180;
			                	Cookies.set('sendCodeTime', second, { expires: second });
			                	this.vcodeClock(second);
			    			} else {
			    				this.$Message.error(res.message);
			    				this.sendButtonDisabled = false;

			    				this.captchaShow = true;
			                    this.captchaLoading = false;

			                    setTimeout(() => {
				                    this.captchaLoading = true;
				                }, 50);
			    			}
			    		});
               		}
    			} else {

        }
         	});
    },
    // 打开忘记密码模态框
    forgetPasswordModal (mobile, isPage) {
        	this.modalTitle = '找回密码';
        	this.modalShow = true;

        	if (isPage) {
        		// 独立页使用
        		this.modelCloseable = false;
        		this.modelMaskClosable = false;
        		this.showMask = false;
        	}

        	// 重置表单
        	this.$refs.formValidate.resetFields();

        	this.formGetPassword.mobile = mobile;
        	this.formGetPassword.validateCode = '';

        	// 判断倒计时是否还在
      if (Cookies.get('sendCodeTime') != null) {
        this.sendButtonDisabled = true;
        this.vcodeClock(Cookies.get('sendCodeTime'));
      }
    },
    // 倒计时
    vcodeClock (second) {
        	this.vclock = setInterval(() => {
        		if (second == 0) {
        			clearInterval(this.vclock);
        			Cookies.remove('sendCodeTime');
        			this.sendButtonDisabled = false;
        			this.getCodeName = '获取验证码';
        		} else {
            		this.getCodeName = '重新发送(' + second + ')';
            		second--;
            		Cookies.set('sendCodeTime', second);
        		}
        	}, 1000);
    },
    // 取消按钮
    codeCancel () {
        	this.modalShow = false;
    },
    // 提交验证码
    codeSubmit () {
        	this.$set(this.ruleGetPassword, 'validateCode', [{ required: true, message: '验证码不能为空', trigger: 'blur' }]);
        	this.$set(this.ruleGetPassword, 'email', []);

        	this.$refs.formValidate.validate((valid) => {
        if (valid) {
                	// 验证成功
                	// 显示加载层
                	this.spinShow = true;

                	// ajax 发送验证码
                	util.ajax.post(util.apiUrl.postCode, {
					    mobile: this.formGetPassword.mobile,
					    vcode: this.formGetPassword.validateCode
          })
		    		.then((response) => {
		    			var res = response.data;
		    			if (res.code) {
		    				// 关闭加载层
			    			this.spinShow = false;

			    			// 过渡动画
			    			this.formGetPasswordShow = false;
			    			// 打开重置密码 模态框
	                		this.formResetShow = true;

	                		// 获取重置token
	                		this.formReset.resetToken = res.data;
	                		this.formReset.newPassword = '';
            				this.formReset.confirmPassword = '';

	                		this.modalTitle = '重设密码';
		    			} else {
		    				this.$Message.error(res.message);

		    				// 关闭加载层
		    				this.spinShow = false;
		    			}
		    		});
        } else {

        }
      });
    },
    // 重置密码
    resetSubmit () {
        	this.$refs.resetValidate.validate((valid) => {
        if (valid) {
                	// 显示加载层
                	this.spinShow = true;

                	// ajax 发送重置的密码
                	util.ajax.post(util.apiUrl.resetPassword, {
					    password: this.formReset.newPassword,
					    password_confirmation: this.formReset.confirmPassword,
					    resetToken: this.formReset.resetToken
          })
		    		.then((response) => {
		    			var res = response.data;
		    			if (res.code) {
		    				this.$Message.success(res.message);

		    				// 关闭倒计时钟
		    				clearInterval(this.vclock);
		    				this.vcodeClock(0);

		    				// 关闭加载层
			    			this.spinShow = false;

	                		// 重设模态框顺序
	                		this.formGetPasswordShow = true;
	                		this.formResetShow = false;

	                		// 关闭模态框
	                		this.modalShow = false;

	                		// 通知父组件，重设成功
	                		this.$emit('reset-success', {});
		    			} else {
		    				this.$Message.error(res.message);
		    				this.spinShow = false;
		    			}
		    		});
        } else {

        }
      });
    },
    // 取消按钮
    resetCancel () {
        	// 关闭模态框
	        this.modalShow = false;
    },
    // 图片验证码初始化
    captchaInit () {
        	this.captchaSpinShow = true;
        	// 重置图片验证码表单
        	this.$refs.captchaValidate.resetFields();

        	// ajax 发送重置的密码
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
    // 图片验证码确认按钮
    captchaOk () {
        	this.$refs.captchaValidate.validate((valid) => {
        if (valid) {
		        	// 获取手机验证码的请求
		        	this.sendCode();
	        	} else {
                	// 验证失败，不关闭模态框
                	this.captchaShow = true;
          this.captchaLoading = false;

          setTimeout(() => {
	                    this.captchaLoading = true;
	                }, 50);
        }
	         });
    },
    // 跳转去登录
    goLogin () {
        	this.$router.push('/login');
    },
    goRegister () {
        	this.$router.push('/register');
    }
  },
  watch: {
    	// 检测密码的强度
    	'formReset.newPassword' (newVal, oldVal) {
    		this.$refs['password-string'].initSet(newVal);
    	}
  },
  mounted () {
    this.init();
  }
}
</script>
