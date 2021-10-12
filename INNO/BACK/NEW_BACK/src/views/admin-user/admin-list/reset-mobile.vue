<style lang="less">
</style>

<template>
    <div>
    	<Modal v-model="modalShow"
    		:loading="modalLoading"
    		:width="380"
    		title="重设管理员手机号"
	    	@on-ok="modalOk">

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
	        	<FormItem v-if="formItem.oldMobile!=''" label="旧手机号" prop="oldMobile">
	        		<Input v-model="formItem.oldMobile" placeholder="请输入当前管理员手机号"></Input>
	        	</FormItem>
	        	<FormItem v-if="formItem.oldMobile!=''" label="验证码" prop="oldVcode">
	        		<Row :gutter="8">
	        			<Col span="11"><Input v-model="formItem.oldVcode" placeholder="请输入验证码"></Input></Col>
	        			<Col span="12"><Button type="info" @click="sendOldSms" :disabled="sendOldButtonDisabled">{{sendOldButtonName}}</Button></Col>
	        		</Row>
	        	</FormItem>

	        	<Divider v-if="formItem.oldMobile!=''" />

	        	<FormItem label="新手机号" prop="mobile">
	        		<Input v-model="formItem.mobile" placeholder="请输入当前管理员手机号"></Input>
	        	</FormItem>
	        	<FormItem label="验证码" prop="vcode">
	        		<Row :gutter="8">
	        			<Col span="11"><Input v-model="formItem.vcode" placeholder="请输入验证码"></Input></Col>
	        			<Col span="12"><Button type="info" @click="sendSms" :disabled="sendButtonDisabled">{{sendButtonName}}</Button></Col>
	        		</Row>
	        	</FormItem>
	        </Form>

	    </Modal>
    </div>
</template>

<script>
import util from '@/libs/util.js';
import Cookies from 'js-cookie';

export default {
  name: 'resetMobile',
  components: {

  },
  data () {
    	const checkAdminMobile = (rule, val, callback) => {
        	if (/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(val)) {
            	callback();
      } else {
    			callback(new Error('手机号码格式不正确。'));
      }
    };

    	return {
    		modalShow: false,
    		modalLoading: true,
    		adminId: 0,
    		index: 0,

    		// 发送按钮
    		sendButtonName: '获取验证码',
    		sendButtonDisabled: false,
    		// 发送旧手机按钮
    		sendOldButtonName: '获取验证码',
    		sendOldButtonDisabled: false,

    		formItem: {
    			oldMobile: '',
    			oldVcode: '',
    			mobile: '',
    			vcode: ''
    		},

    		// 表单数据规则
        	ruleValidate: {
        		mobile: [{ required: true, message: '管理员手机号不能为空', trigger: 'blur' },
        					{ validator: checkAdminMobile, message: '手机号格式不正确', trigger: 'blur' }],
        		vcode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
        	},

        	// 倒计时
        	newTimer: {},
        	oldTimer: {}
    	}
  },
  methods: {
    	openModal (index, row) {
    		this.modalShow = true;
    		this.adminId = row.user_id;
    		this.index = index;

    		// 重置表单
        	this.$refs.formValidate.resetFields();

        	this.formItem.oldMobile = (row.mobile == null ? '' : row.mobile);
    	},
    	// 发送旧手机验证码
    	sendOldSms () {
    		if (/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.formItem.oldMobile) == false) {
    			this.$Message.error('旧手机号有误！');
    		} else {
	    		util.ajax.post(util.apiUrl.adminUserSendSms, {
	    			mobile: this.formItem.oldMobile,
	    			adminId: this.adminId
	    		})
	    		.then((response) => {
	    			var res = response.data;
	    			if (res.code) {
	    				Cookies.set('oldSmsSendTime', Date.parse(new Date()) / 1000, { expires: 180 });
	    				this.sendOldTimer();
	    				this.$Message.success(res.message);
	    			} else {
	    				this.$Message.error(res.message);
	    			}
	    		});
    		}
    	},
    	// 发送验证码
    	sendSms () {
    		if (/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.formItem.mobile) == false) {
    			this.$Message.error('手机号有误！');
    		} else {
	    		util.ajax.post(util.apiUrl.adminUserSendSms, {
	    			mobile: this.formItem.mobile,
	    			adminId: this.adminId
	    		})
	    		.then((response) => {
	    			var res = response.data;
	    			if (res.code) {
	    				Cookies.set('smsSendTime', Date.parse(new Date()) / 1000, { expires: 180 });
	    				this.sendTimer();
	    				this.$Message.success(res.message);
	    			} else {
	    				this.$Message.error(res.message);
	    			}
	    		});
    		}
    	},
    	// 倒计时
    	sendTimer () {
    		if (Cookies.get('smsSendTime') == null) {
    			this.sendButtonName = '获取验证码';
    			this.sendButtonDisabled = false;
    		} else {
    			var second = 180;
    			this.newTimer = window.setInterval(() => {
    				this.sendButtonName = '重新发送(' + second + ')';
    				this.sendButtonDisabled = true;

    				second--;
    				if (second <= 0) {
    					window.clearInterval(this.newTimer);

    					this.sendButtonName = '获取验证码';
    					this.sendButtonDisabled = false;
    				}
    			}, 1000);
    		}
    	},
    	// 倒计时
    	sendOldTimer () {
    		if (Cookies.get('oldSmsSendTime') == null) {
    			this.sendOldButtonName = '获取验证码';
    			this.sendOldButtonDisabled = false;
    		} else {
    			var second = 180;
    			this.oldTimer = window.setInterval(() => {
    				this.sendOldButtonName = '重新发送(' + second + ')';
    				this.sendOldButtonDisabled = true;

    				second--;
    				if (second <= 0) {
    					window.clearInterval(this.oldTimer);

    					this.sendOldButtonName = '获取验证码';
    					this.sendOldButtonDisabled = false;
    				}
    			}, 1000);
    		}
    	},
    	modalOk () {
    		this.$refs.formValidate.validate((valid) => {
        if (valid) {
		    		// ajax 请求获取数据，然后动态更新下面数据源
		        	util.ajax.post(util.apiUrl.adminUserSetMobile, {
		        		id: this.adminId,
		        		mobile: this.formItem.mobile,
		        		vcode: this.formItem.vcode,
		        		oldMobile: this.formItem.oldMobile,
		        		oldVcode: this.formItem.oldVcode
		        	})
		    		.then((response) => {
		    			var res = response.data;
		    			if (res.code) {
		    				this.$Message.success(res.message);
		    				this.modalShow = false;

		    				// 删除cookie
		    				window.clearInterval(this.newTimer);
		    				window.clearInterval(this.oldTimer);
		    				Cookies.remove('smsSendTime');
		    				Cookies.remove('oldSmsSendTime');
		    				this.sendTimer();
		    				this.sendOldTimer();

		    				// 回调
		    				this.$emit('on-success', { index: this.index, mobile: this.formItem.mobile });
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
