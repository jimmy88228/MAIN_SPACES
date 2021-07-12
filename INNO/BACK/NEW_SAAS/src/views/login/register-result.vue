<style lang="less">
body{
    font-family: '微软雅黑','宋体',Arial,sans-serif;
}

.register-result{
	width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow:auto;

    .con{
    	display: flex;
        align-items: center;
        justify-content: center;
        padding-top:50px;

        .result-card{
            width:700px;
        }
    }

    .steps{
    	margin:40px 30px 80px;
    }
    .btn-box{
    	text-align: center;
    }
}
</style>

<template>
	<div class="register-result">
		<div class="con">
			<Card class="result-card">
				<div slot="title">
					<Icon type="md-checkmark-circle-outline" /> 用户审核结果
				</div>

				<a slot="extra" @click="logout">
					退出 <Icon type="md-exit" size="16"/>
				</a>

				<Steps :current="currentStep" class="steps">
			        <Step title="注册" content="账号注册已完成"></Step>
			        <Step title="补充资料" content="补充企业相关资料"></Step>
			        <Step title="资料审核"></Step>
			        <Step title="注册完成"></Step>
			    </Steps>

			    <!--补充资料（第二步）-->
			    <registerResultForm v-show="currentStep==1?true:false" ref="result-form" @next-step="nextStep"></registerResultForm>

			    <!--审核结果（第三步）-->
			    <registerResultLog v-show="currentStep==2?true:false" ref="result-log" @pre-step="preStep"></registerResultLog>

			    <Spin size="large" fix v-if="spinShow"></Spin>
			</Card>
		</div>

		<!--单点退出js加载点-->
		<div id="logoutssojs"></div>

	</div>
</template>

<script>
import util from '@/libs/util.js';
import registerResultForm from './register-result-form';
import registerResultLog from './register-result-log';

/**
 * 企业用户 审核结果页面
 * 只有审核中 和 审核不通过的，才来到这个页面
 */
export default {
  components: {
    registerResultForm,
    registerResultLog
  },
  data () {
    return {
        	spinShow: false,

        	// 当前步骤
        	currentStep: 0
    }
  },
  methods: {
    	init () {
    		util.ajax.post(util.apiUrl.registerResult, {

      })
    		.then((response) => {
    			var res = response.data;

    			if (res.code) {
    				this.$refs['result-form'].initSet(res);
    				this.$refs['result-log'].initSet(res);

    				if (res.data.get_verify_log.length > 0) {
    					this.currentStep = 2;
    				} else {
    					this.currentStep = 1;
    				}
    			}
    		});
    	},
    	// 下一步(回调函数)
    	nextStep (obj) {
    		this.currentStep = 2;
    	},
    	// 上一步(回调函数)
    	preStep (obj) {
    		this.currentStep = 1;
    	},
    	// 注销退出
    	logout () {
    		this.spinShow = true;

    		// ajax 发送验证码
        	util.ajax.post(util.apiUrl.logout, {

      })
    		.then((response) => {
    			var res = response.data;
    			this.registerButtonLoading = false;

    			if (res.code) {
    				// 是否开启单点登录
    				if (res.sso != '' && res.sso != null) {
    					for (var i in res.sso) {
    						this.loadScript(res.sso[i], () => {
    							if ((i + 1) == res.sso.length) {
    								// 模态框提示注册成功
    								this.$Message.success(res.message);

    								// 加载完最后一个 js 才跳转路由
    								this.logoutJump();
    							}
    						});
    					}
    				} else {
    					// 模态框提示注册成功
    					this.$Message.success(res.message);

    					// 无单点注销的情况
    					this.logoutJump();
    				}
    			} else {
    				// ajax 退出失败，不理会，客户端直接退出
    				this.logoutJump();
    			}
    		});
    	},
    	// 注销成功的跳转
    logoutJump () {
        	this.spinShow = false;

        	// 注销/退出登录
      this.$store.commit('logout', this);
      this.$store.commit('clearOpenedSubmenu');

      // 清理掉缓存
      util.cache.remove('mainFrameData');

      // 跳转到登录页面
      this.$router.push('/login');
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
      document.getElementById('logoutssojs').appendChild(script);
    }
  },
  mounted () {
    this.init();
  }
};
</script>
