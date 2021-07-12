<style lang="less">
/*导入自定义的图标*/
@import '../../styles/myIcon.less';

body{
    font-family: '微软雅黑','宋体',Arial,sans-serif;
}
.register-buser{
	width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    position: relative;

    .reg-box{
    	display: flex;
        align-items: center;
        justify-content: center;
        padding-top:100px;

	    .reg-card{
	    	width:350px;

	    	.enterprise-user{
	    		font-size:18px;
	    	}
	    }

	    .reg-txt{
	    	font-size:12px;
	    	margin-bottom: 30px;
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
}
</style>

<template>
	<div class="register-buser">
		<div class="reg-box">
			<Card class="reg-card">
				<div slot="title">
					<Icon custom="ionmy ion-my-enterprise-user" class="enterprise-user"></Icon> 企业用户注册
				</div>

				<Form ref="formValidate" :model="formRegister" :rules="ruleRegister" :label-width="80">
		        	<FormItem prop="mobile" label="手机号">
		                <Input v-model="formRegister.mobile" placeholder="请输入手机号" clearable></Input>
		            </FormItem>

		            <FormItem prop="validateCode" label="验证码">
		                <Row>
			                <Col span="11">
				                <Input v-model="formRegister.validateCode" placeholder="请输入验证码" clearable></Input>
			                </Col>
			                <Col span="12" offset="1">
			                    <Button type="info" @click="sendCode" :disabled="sendButtonDisabled">{{getCodeName}}</Button>
			                </Col>
			            </Row>
		            </FormItem>

		            <FormItem prop="brandName" label="品牌名称">
		                <Input v-model="formRegister.brandName" placeholder="请输入品牌名称" clearable></Input>
		            </FormItem>

		            <FormItem prop="userName" label="用户名">
		                <Input v-model="formRegister.userName" placeholder="请输入用户名" clearable></Input>
		            </FormItem>
		            <FormItem prop="password" label="密码">
		                <Input type="password" v-model="formRegister.password" placeholder="请输入密码"></Input>
		            </FormItem>

		            <!--密码强度提示组件-->
		            <passwordString ref="password-string"></passwordString>

		            <FormItem prop="confirmPassword" label="确认密码">
		                <Input type="password" v-model="formRegister.confirmPassword" placeholder="再次输入密码"></Input>
		            </FormItem>

	            	<div class="reg-txt">同意并接受<a @click="openRegisterService">《服务条款》</a></div>
		            <div style="text-align:center;">
		            	<Divider />
			            <Button type="primary" :loading="registerButtonLoading" @click="registerSubmit" style="width:80px;">注册</Button>
			        </div>

		        </Form>

		        <div class="ext-txt">
					<span @click="goLogin">用户登录</span>
					<Divider type="vertical" />
					<span @click="goForgetPassword">找回密码</span>
				</div>
			</Card>
		</div>

		<!--注册图形验证码组件-->
		<registerCaptcha ref="register-captcha" @on-send="sendSmsCallback" @on-cancel="captchaCancelCallback"></registerCaptcha>

	    <!--服务条款组件-->
	    <registerService ref="register-service"></registerService>

	</div>
</template>

<script>
import util from '@/libs/util.js';
import Cookies from 'js-cookie';
import registerCaptcha from './register-captcha';
import registerService from './register-service';
import passwordString from './password-strong';

/**
 * 企业用户注册
 */
export default {
  components: {
    registerCaptcha,
    registerService,
    passwordString
  },
  data () {
    	// 密码匹对
    	const checkConfirmPassword = (rule, val, callback) => {
        	if (val == this.formRegister.password) {
            	callback();
      } else {
    			callback(new Error('两次输入的密码不一样'));
      }
    };
    // 检查用户
    const checkUsername = (rule, val, callback) => {
        	if (/^[a-zA-Z0-9_]{4,20}$/.test(val)) {
            	callback();
      } else {
    			callback(new Error('用户名只能由英文字符数字和‘_’组成'));
      }
    };
    // 检查手机号
    	const checkMobile = (rule, val, callback) => {
    		if (/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(val)) {
            	callback();
      } else {
    			callback(new Error('格式有误'));
      }
    };

    return {
      // 倒计时
        	vclock: {},

        	getCodeName: '获取验证码',

        	sendButtonDisabled: false,

        	registerButtonLoading: false,

        	// 用户注册表单内容
        	formRegister: {
        		mobile: '',
        		validateCode: '',
        		userName: '',
        		brandName: '',
        		password: '',
        		confirmPassword: ''
        	},

        	 // 找回密码表单数据规则
        	ruleRegister: {
        mobile: [{ required: true, message: '手机不能为空', trigger: 'blur' },
        				{ validator: checkMobile, message: '格式有误', trigger: 'blur' }],
        		validateCode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
        		brandName: [{ required: true, message: '品牌名不能为空', trigger: 'blur' },
        				{ type: 'string', max: 30, message: '大于30个字符', trigger: 'blur' }],
        		userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' },
        					{ type: 'string', min: 4, max: 20, message: '用户名不能少于4个字符，大于20个字符', trigger: 'blur' },
        					{ validator: checkUsername, message: '用户名只能由英文字符数字和‘_’组成', trigger: 'blur' }],
        		password: [{ required: true, message: '不能为空', trigger: 'blur' },
        					{ type: 'string', min: 6, message: '密码长度不能少于6位', trigger: 'blur' }],
        		confirmPassword: [{ required: true, message: '不能为空', trigger: 'blur' },
        						{ type: 'string', min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
        						{ validator: checkConfirmPassword, message: '两次输入的密码不一样', trigger: 'blur' }]
        	}
    }
  },
  methods: {
    	init () {
      // 重置表单
        	this.$refs.formValidate.resetFields();

        	// 判断倒计时是否还在
      if (Cookies.get('sendRegCodeTime') != null) {
        this.sendButtonDisabled = true;
        this.vcodeClock(Cookies.get('sendRegCodeTime'));
      }
    	},
    	// 获取短信验证码
    sendCode () {
      // 验证手机号
      if (/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.formRegister.mobile) == false) {
        this.$Message.error('手机号格式有误！');
      } else if (this.sendButtonDisabled == false) {
    			// 把按钮disable
            	this.sendButtonDisabled = true;

            	// 调用组件，发送短信验证码
        this.$refs['register-captcha'].captchaInit(this.formRegister.mobile);
      } else {

      }
    },
    // 发送图形验证码成功的回调
    sendSmsCallback (obj) {
        	if (obj.code) {
        		// 锁定按钮
        		this.sendButtonDisabled = true;

            	// 发送成功，开启计数器
	        	var second = Cookies.get('sendRegCodeTime') != null ? Number(Cookies.get('sendRegCodeTime')) : 180;
		        Cookies.set('sendRegCodeTime', second, { expires: second });
		        this.vcodeClock(second);
	        } else {
        		// 解锁按钮
        		this.sendButtonDisabled = false;
        	}
    },
    // 发送图形验证码取消的回调
    captchaCancelCallback (obj) {
        	this.sendButtonDisabled = false;
    },
    // 倒计时
    vcodeClock (second) {
        	this.vclock = setInterval(() => {
        		if (second == 0) {
        			clearInterval(this.vclock);
        			Cookies.remove('sendRegCodeTime');
        			this.sendButtonDisabled = false;
        			this.getCodeName = '获取验证码';
        		} else {
            		this.getCodeName = '重新发送(' + second + ')';
            		second--;
            		Cookies.set('sendRegCodeTime', second);
        		}
        	}, 1000);
    },
    // 提交验证码
    registerSubmit () {
        	this.$refs.formValidate.validate((valid) => {
        if (valid) {
                	// 显示加载层
                	this.spinShow = true;
          this.registerButtonLoading = true;

                	// ajax 发送验证码
                	util.ajax.post(util.apiUrl.bUserRegister, {
					    mobile: this.formRegister.mobile,
					    vcode: this.formRegister.validateCode,
					    name: this.formRegister.userName,
					    brandName: this.formRegister.brandName,
					    password: this.formRegister.password,
					    password_confirmation: this.formRegister.confirmPassword
          })
		    		.then((response) => {
		    			var res = response.data;
		    			this.registerButtonLoading = false;

		    			if (res.code) {
		    				// 删除倒计时cookie
		    				Cookies.remove('sendRegCodeTime');

		    				// 写入 临时登录token
		    				Cookies.set('access', 1);
		    				Cookies.set('accessToken', res.accessToken);

		    				// 模态框提示注册成功
		    				this.$Modal.success({
		    					title: '企业用户注册成功',
		    					content: res.message,
		    					onOk: () => {
		    						this.goRegisterResult();
		    					}
		    				});

		    				// 关闭加载层
			    			this.spinShow = false;
		    			} else {
		    				this.$Message.error({
		    					content: res.message,
		    					duration: 4
		    				});

		    				// 关闭加载层
		    				this.spinShow = false;
		    			}
		    		});
        } else {
                	// 验证失败，直接返回就可以

        }
      });
    },
    // 跳转到忘记密码页面
    goForgetPassword () {
        	this.$router.push('/forget-password');
    },
    // 跳转到注册审核流程页
    goRegisterResult () {
        	this.$router.push('/register-result');
    },
    // 跳转去登录
    goLogin () {
      this.$router.push('/login');
    },
    // 打开服务条款
    openRegisterService () {
        	this.$refs['register-service'].openService();
    }
  },
  watch: {
    	// 检测密码的强度
    	'formRegister.password' (newVal, oldVal) {
    		this.$refs['password-string'].initSet(newVal);
    	}
  },
  mounted () {
    this.init();
  }
};
</script>
