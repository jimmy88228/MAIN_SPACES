<style lang="less">
.login-by-qrcode{
	.login-switch{
        position: absolute;
        right: 0;
        top:0;
        cursor: pointer;

        .icon{
            height:50px;
            width:50px;
            background: no-repeat center center / 80% auto;

			&.qrcode{
				background-image: url('../../../static/images/login-qrcode.png');
			}
			&.pwd{
				background-image: url('../../../static/images/login-password.png');
			}
        }

        .ivu-poptip-popper{
            min-width: 100px;
        }
    }

    .form-con{
        padding: 10px 0 30px 0;
        text-align: center;
    }

	.select-user-box{
		background-color: #fff;
		text-align: left;
	}

	/* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .tran-qrcode-enter-active {
      transition: all .3s ease;
    }
    .tran-qrcode-leave-active {
      transition: all 0s ease;
    }
    .tran-qrcode-enter{
      opacity: 0;
    }
}
</style>

<template>
	<div class="login-by-qrcode">
		<div class="login-switch" :title="loginSwitchContent" @click="goLoginSwitch">
        	<div :class="'icon '+loginSwitchStyle"></div>
        </div>

		<transition name="tran-qrcode">
        	<div class="form-con" v-show="(loginSwitch=='qrcode'?true:false)">
				<template v-if="loginSuccess == false">
					<img v-if="loginQrcode != '' " :src="loginQrcode" width="230" />
					<div>{{qrcodeTxt}}</div>
				</template>
				<template v-else-if="selectUser == true">
					<div class="select-user-box">
						<Card title="请选择账号" icon="ios-options" :padding="0" shadow>
							<CellGroup>
								<Cell v-for="(item,index) in selectUserList" :key="index"
								:title="item.brand_name+' / '+ item.admin_name"
								@click.native="checkQrcodeReturn( item.admin_id )">
								</Cell>
							</CellGroup>
						</Card>
					</div>
				</template>
				<template v-else>
					<Icon type="ios-checkmark-circle" size="60" color="#19be6b"></Icon>
					<div>成功</div>
				</template>

				<Spin size="large" fix v-if="loadingQrcode"></Spin>
        	</div>
        </transition>
	</div>
</template>

<script>
import util from '@/libs/util.js';
import Cookies from 'js-cookie';

export default {
	name: 'loginByQrcode',
	components: {
	},
	data () {

        return {
        	iTimer:0,
        	jTimer:0,

        	loginQrcode:'',
        	loadingQrcode:false,
        	qrcodeTxt:'',
        	randCode: '',

        	// 扫码登录
        	loginSwitch:'',
        	loginSwitchContent:'',
        	loginSwitchStyle:'',

			loginSuccess: false,
			selectUser: false,
			selectUserList: [],
        }
   	},
  destroyed () {
    clearInterval(this.iTimer);
    clearInterval(this.jTimer);
  },
   	methods: {
    	init () {
    		this.loginSuccess = false;
    	},
    	// 提供给父组件调用
    	initSet (typeName) {
    		this.loginSwitch = typeName;
    	},
    	// 扫码登录切换
    goLoginSwitch () {
        	if (this.loginSwitch == 'password') {
        		this.loginSwitch = 'qrcode';

  				// 触发组件
        		this.flashQrcode();

        		// 2分钟刷新一次二维码
        		this.iTimer = window.setInterval(() => {
        			this.flashQrcode();
        		}, 120000);

        		// 通知父组件
        		this.$emit('on-switch', { name: this.loginSwitch });
        	} else {
        		this.loginSwitch = 'password';
        		clearInterval(this.iTimer);
        		clearInterval(this.jTimer);

        		// 通知父组件
        		this.$emit('on-switch', { name: this.loginSwitch });
        	}
    },
    	// 刷新二维码
    flashQrcode () {
        	this.qrcodeTxt = '正在加载...';
        	this.loadingQrcode = true;

        	this.randCode = Math.random().toString(36).substr(2);
        	// ajax 发送获取微信二维码
        	util.ajax.post( util.apiUrl.getLoginQrcode, {
			    randCode: this.randCode,
			})
    		.then( (response) => {
    			this.loadingQrcode = false;
    			var res = response.data;
    			if( res.code ){
    				this.loginQrcode = res.data ;
    				this.qrcodeTxt = '请用微信“扫一扫”扫描登录';

    				clearInterval(this.jTimer);
    				this.jTimer = window.setInterval( ()=>{
	    				this.checkQrcodeReturn();
		    		}, 3000);

    			}
    			else{
					this.loginQrcode = '';
					this.qrcodeTxt = '获取微信二维码失败，暂时无法扫码登录，请使用密码登录。';
    			}

    		});
        },
		// ajax 监测二维码是否已经扫码
		checkQrcodeReturn( admin_id = 0 ){

			// ajax 定时检测二维码是否已经扫了
			util.ajax.post( util.apiUrl.loginSSE, {
				randCode: this.randCode,
				admin_id: admin_id,
			})
			.then( (response) => {
				var res = response.data;
				if( res.code && res.scanResult ){

					// 关闭全部的定时器
					clearInterval(this.iTimer);
					clearInterval(this.jTimer);

					if( res.message == 'select-user' ){
						// 多个账号的情况下，选择账号
						this.selectUser = true;
						this.loginSuccess = true;
						this.selectUserList = res.data;
					}
					else{
						// user 是必选写入的cookie，否则就当登录不成功
						Cookies.set('user', res.adminName);
						Cookies.set('access', 1 );
						Cookies.set('accessToken', res.accessToken );

						// 头像 写入到 store
						this.$store.commit('setAvator', res.avatar );

						// 删除图形验证码缓存
						util.cache.remove('password_error_lock');

						// 删除初始化缓存，让初始化在登录时候重新加载一次
						util.cache.remove('mainFrameData');

						// 标识登录成功
						this.loginSuccess = true;
						this.selectUser = false;
						window.setTimeout( ()=>{
							// 路由 跳转
							this.successJump();
						},3000);
					}
				}
				else{
					// 失败不用处理
				}
			});
		},
		// 登录成功的跳转
		successJump(){
      this.$emit('on-success', {});
    }
  },
  watch: {
    	loginSwitch (to) {
    		if (this.loginSwitch == 'password') {
    			this.loginSwitchContent = '微信扫描登录';
    			this.loginSwitchStyle = 'qrcode';
    		} else if (this.loginSwitch == 'qrcode') {
    			this.loginSwitchContent = '密码登录';
    			this.loginSwitchStyle = 'pwd';
    		}
    	}
  },
  mounted () {
    this.init();
  }
};
</script>
