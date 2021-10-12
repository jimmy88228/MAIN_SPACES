<style lang="less">
body{
    font-family: '微软雅黑','宋体',Arial,sans-serif !important;
}
.login{
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    position: relative;
		.login-con-box{
			position:fixed;
			top:0;
			left:50%;
			transform: translate(-50%, 0);
			z-index:3;
			.login-con{
			    display: flex;
			    align-items: center;
			    justify-content: center;
			    // padding-top:200px;
			
			    &-header{
			        font-size: 16px;
			        font-weight: 300;
			        text-align: center;
			        padding: 30px 0;
			    }
			    .login-card{
			      width:350px;
			      border-radius: 10px;
			      border:1px solid rgba(255,255,255,0.6);
			      box-shadow: 0 0 4px 3px rgba(0,0,0,.1);
			    }
			    .form-con{
			        padding: 10px 0 0;
			    }
			    .ext-txt{
			        color:#555;
			        font-size:12px;
			        margin-top:20px;
			        text-align: center;
			        cursor: pointer;
			
			        span:hover{
			            color: #0077AA;
			        }
			    }
			
			}
		}
    

    .ivu-form-item-content{
    	line-height:20px;
    }

	.footer-box{
		text-align: center;
		color: #fff;
		position: fixed;
		width: 100%;
		bottom: 20px;
	}
}

/*登录框模式*/
.loginBox{
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
	<div :class="(isLoginBox==false?'login':'loginBox')" :style="loginBg">
		<circle-animate>
	    <div @keydown.enter="handleSubmit" class="login-con-box" :style="{'margin-top': paddingTop +'px'}">
	        <div :class="(isLoginBox==false?'login-con':'')" >
	            <Card :bordered="false" class="login-card">
	                <p slot="title">登录</p>

                    <!--微信二维码扫码登录组件-->
	                <loginByQrcode ref="login-by-qrcode" @on-switch="qrcodeSwitch" @on-success="successJump"></loginByQrcode>

	                <div class="form-con" v-show="(loginSwitch=='password'?true:false)">
	                    <Form ref="loginForm" :model="form" :rules="ruleValidate">
	                        <FormItem prop="adminName">
	                            <Input v-model="form.adminName" placeholder="请输入用户名或手机号" size="large" clearable>
	                                <span slot="prepend">
	                                    <Icon :size="22" type="ios-person"></Icon>
	                                </span>
	                            </Input>
	                        </FormItem>
	                        <FormItem prop="adminPassword">
	                            <Input type="password" v-model="form.adminPassword" placeholder="请输入密码" size="large" clearable>
	                                <span slot="prepend">
	                                    <Icon :size="21" type="md-lock"></Icon>
	                                </span>
	                            </Input>
	                        </FormItem>
	                        <FormItem prop="captcha" v-if="captchaShow">
	                        	<Row>
															<Col span="11">
																			<Input v-model="form.captcha" placeholder="请输入图形验证码" size="large" clearable></Input>
																	</Col>
															<Col span="11" offset="1">
																	<img :src="form.src" @click="updateCaptcha" style="cursor: pointer;" />
																	<!--图形验证码加载提示-->
																	<Spin v-if="captchaSpinShow"></Spin>
															</Col>
														</Row>
	                        </FormItem>
	                        <FormItem>
	                            <Button @click="handleSubmit" type="primary" :loading="form.loading" size="large" long>
	                            	<span v-if="!form.loading">登录</span>
																<span v-else>Loading...</span>
																				</Button>
																		</FormItem>
																</Form>
																<div class="ext-txt">
																	<template v-if="canRegister">
													<span @click="goRegister">用户注册</span>
													<Divider type="vertical" />
												</template>
												<span @click="goForgetPassword">找回密码</span>
											</div>
	                </div>

	            </Card>
	        </div>
	    </div>
			<div class="footer-box" :style="{color:footer_text_color}">{{footer_copy_right}}</div>
   		<!--单点登录的js加载点-->
   		<div id="ssojs"></div>

   		<!--登录特效
   		<loginTx v-if="isLoginBox == false && showLoginTx == true"></loginTx>
-->
			<!--弹出的滑块验证-->
			<Modal title="请完成完全验证" v-model="verifyModalShow"
			:loading="verifyModalLoading"
			:width="343" :footer-hide="true"
			@on-cancel="onCancelVerify">
				<!--组件的参数说明，请看 https://gitee.com/monoplasty/vue-monoplasty-slide-verify -->
				<slide-verify
					:l="42"
					:r="10"
					:w="310"
					:h="155"
					slider-text="向右滑动"
					ref="slideblock"
					:imgs="verifyImages"
					@success="onVerifySuccess"
					@fail="onVerifyFail"
					@refresh="onVerifyRefresh"
					@again="onAgain">
				</slide-verify>
			</Modal>
		</circle-animate>
  </div>
</template>

<script>
import util from '@/libs/util.js';
import Cookies from 'js-cookie';
import loginByQrcode from './login-by-qrcode';
import loginTx from './login-tx';
import circleAnimate from '@/views/main-components/circle-animate.vue';

export default {
  name: 'login',
  components: {
 		loginByQrcode,
 		loginTx,
		circleAnimate
  },
  props: {
    	isLoginBox: {
    		type: Boolean,
    		default: false
    	}
  },
  data () {
    return {
      form: {
            	loading: false,
        adminName: '',
        adminPassword: '',
        captcha: '',
        captchaKey: '',
        src: ''
      },
      ruleValidate: {
        adminName: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        adminPassword: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        captcha: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
      },

      sendButtonDisabled: false,

      canRegister: false,

        	loginBg: '',
      loginSwitch: '',
      showLoginTx: false,
      paddingTop: 200,

      footer_copy_right:'',
      footer_text_color: '',
      
        	// 图片验证码模态框
      captchaShow: false,
      captchaSpinShow: false,

			// 滑动验证框
			verifyModalShow: false,
			verifyModalLoading: false,
			verifyImages: [],
			verifySuccess: false,
    };
  },
  created() {
  	// 从100 张图片中，随机获取 10张图片
  	this.verifyImages = [];
  	for(var i=0; i<10; i++){
  		var num = Math.random();
  		num = num * 100;
  		num = Math.floor( num ) + 100 ;
  		this.verifyImages.push( util.apiHost + '/../image/show/assets-images-slideVerifyImages-'+num+'.jpg' );
  	}
  },
  methods: {
    	init () {
    		// 如果已经登录，跳出此页
    		if (Cookies.get('accessToken') != null && Cookies.get('accessToken') != '') {
    			// 似乎会影响到跳转 this.$router.push('/home');
    		}

        // 计算登录框出现在黄金分割点的位置
        this.paddingTop = this.isLoginBox == false ? (document.body.clientHeight - 304) / 2 * 0.618 : 0;

    		this.canRegister = util.canRegister;

    		// 初始化二维码扫码组件,默认是密码登录
    		this.$refs['login-by-qrcode'].initSet('password');

    		// 如果出现过错误的，显示验证码
    		if (util.cache.get('password_error_lock') == 1) {
    			this.updateCaptcha();
    		}

    		this.loginBg = this.isLoginBox==false? {} : '';
			this.loginSwitch = 'password';

			this.showLoginTx = util.showLoginBoxTx;

			if( Cookies.get('accessToken') == null || Cookies.get('accessToken') == '' ){
				// 初始化登录的前的信息
				util.ajax.post( util.apiUrl.loginInit,{

				})
				.then( (response) => {
					// 用ajax 返回的参数替换组件的默认数据
					var res = response.data;
					if( res.code ){
						//this.verifyImages = res.data.verify_images;
						this.loginBg = res.data.login_bg != '' ? {'background-image': 'url('+res.data.login_bg+')'} : {};
						this.footer_copy_right = res.data.footer_copy_right;
            this.footer_text_color = res.data.footer_text_color == null || res.data.footer_text_color == '' ? '#fff' : res.data.footer_text_color;
					}
				});
			}
    	},
		// 提交用户名表单
        handleSubmit () {

      this.$refs.loginForm.validate((valid) => {
        if (valid) {
                	if (this.form.loading == true) {
                		// 防止多次触发
                		return false;
                	} else {
                		this.form.loading = true;
                	}
			if( this.verifySuccess == false ){
				// 打开滑动验证器
				this.verifyModalShow = true;
				return ;
			}

                	// ajax 登录
                	util.ajax.post(util.apiUrl.login, {
					    adminName: this.form.adminName,
					    adminPassword: this.form.adminPassword,
					    captcha: this.form.captcha,
					    captchaKey: this.form.captchaKey
          })
		    		.then((response) => {
		    			// 用ajax 返回的参数替换组件的默认数据
		    			var res = response.data;
		    			if (res.code) {
		    				this.$Message.success(res.message);

		    				// user 是必选写入的cookie，否则就当登录不成功
		    				Cookies.set('user', this.form.adminName);
		    				Cookies.set('access', 1 );
		    				Cookies.set('accessToken', res.accessToken );

							// 判断 adminCode
							if( Cookies.get('adminCode') != res.adminCode ){
								// 产出cbUrl 免得产生 430 错误
								Cookies.remove('cbURL');
							}
							// 写入新的adminCode
							Cookies.set('adminCode', res.adminCode , {expires:(3600*24*3)} );


		    				// 头像 写入到 store
		    				this.$store.commit('setAvator', res.avatar);

		    				// 删除图形验证码缓存
		    				util.cache.remove('password_error_lock');

		    				// 删除初始化缓存，让初始化在登录时候重新加载一次
		    				util.cache.remove('mainFrameData');

		    				this.form.loading = false;

		    				// 是否开启单点登录
		    				if (res.sso != '' && res.sso != null) {
		    					for (var i in res.sso) {
		    						this.loadScript(res.sso[i], () => {
		    							if ((i + 1) == res.sso.length) {
		    								// 加载完最后一个 js 才跳转路由
		    								this.successJump();
		    							}
		    						});
		    					}
		    				} else {
		    					// 登录成功，跳转路由
		    					this.successJump();
		                  	 }
		    			} else {
		    				// 密码验证失败
		    				if (res.errorNum > 2) {
		    					// 显示图形验证码
		    					this.updateCaptcha();

		    					// 记录缓存
		    					util.cache.set('password_error_lock', 1);
		    				}

		    				this.form.loading = false;

							// 重设滑动验证器
							this.verifySuccess = false;
							this.$refs['slideblock'].reset();

		    				this.$Message.error( res.message );
		    			}
            });
        }
      });
    },
    // 登录成功的跳转
    successJump () {
		// 作为组件的时候，提交事件给父组件
        	this.$emit('login-success', {});

        	// 路由 跳转
      var cbURL = Cookies.get('cbURL');
      if (cbURL != null && cbURL != '') {
        if (cbURL != '/login') {
          this.$router.push('/home');

          // 异步的方式跳转到上次浏览过的地方，这样可以防止页面未初始化好
          window.setTimeout(() => {
            this.$router.push(cbURL.replace('#login', ''));
          }, 1000);
               	}
        Cookies.remove('cbURL');
      } else {
        this.$router.push('/home');
           	}
    },
    // 用户注册
    goRegister () {
        	this.$router.push('/register');
    },
    goForgetPassword () {
        	this.$router.push('/forget-password');
    },
    // 图片验证码初始化
    captchaInit (mobile) {
        	this.captchaShow = true;
        	this.captchaSpinShow = true;

        	// ajax 获取图形验证码
        	util.ajax.post(util.apiUrl.getCaptcha, {
      })
    		.then((response) => {
    			var res = response.data;
    			if (res.code) {
    				// 关闭加载层
	    			this.captchaSpinShow = false;

	    			// 初始化图片验证码
	    			this.form.src = res.data.img;
	    			this.form.captchaKey = res.data.key;
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
    // 二维码登录，回调
    qrcodeSwitch (obj) {
        	this.loginSwitch = obj.name;
    },

    // 加载外部js
    	loadScript (url, callback) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      if (typeof (callback) !== 'undefined') {
        if (script.readyState) {
          script.onreadystatechange = function () {
		    			if (script.readyState == 'loaded' || script.readyState == 'complete') {
		        			script.onreadystatechange = null;
		        			callback();
		        		}
		      		};
		    	} else {
		    		script.onload = function () {
			        	callback();
			      	};
		    	}
      }
      script.src = url;
      document.getElementById('ssojs').appendChild(script);
    },
    // 滑动验证成功
	onVerifySuccess(){
		this.verifySuccess = true;
		this.verifyModalShow = false;
		this.form.loading = false;

		// 重新出发提交表单
		this.handleSubmit();
	},
	// 滑动验证失败
	onVerifyFail(){
		this.verifySuccess = false;
	},
	// 滑动验证刷新
	onVerifyRefresh(){
		this.verifySuccess = false;
	},
	// 检查到非人为操作的回调
	onAgain(){
		this.form.loading = false;
	},
	// 关闭验证的框
	onCancelVerify(){
		this.form.loading = false;
	}
  },
  mounted () {
    this.init();
  }
};
</script>
