<style lang="less">
.weixin-pay-basic{
	.box{
		width:550px;
		float:left;
		margin:10px;
	}
	.default-input{
		width:300px;
	}
}
</style>

<template>
	<div class="weixin-pay-basic">
		<div class="box">
			<Card>
		        <p slot="title">微信支付设置</p>
				
				<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
					<FormItem label="商户号" prop="mch_id">
						<Input v-model="formItem.mch_id" class="default-input" placeholder=""></Input>
					</FormItem>
					<FormItem label="API 密钥" prop="key">
						<Input v-model="formItem.key" class="default-input" placeholder="" maxlength="32" show-word-limit></Input>
						<div>点击 <span style="color:#2d8cf0;cursor:pointer;" @click="viewImage">这里</span> 查看微信支付后台设置说明</div>
					</FormItem>
					
					<Divider orientation="left">公众号支付</Divider>
					<FormItem label="公众号APP ID" prop="jsapi_app_id">
						<Input v-model="formItem.jsapi_app_id" class="default-input" placeholder=""></Input>
						<div>（如果启用了公众号支付，请填入公众号的APP ID）</div>
					</FormItem>
					
					<Divider orientation="left">小程序支付</Divider>
					<FormItem label="小程序APP ID" prop="weiapp_app_id">
						<Input v-model="formItem.weapp_app_id" class="default-input" placeholder=""></Input>
						<div>（如果启用了小程序支付，请填入小程序的APP ID）</div>
					</FormItem>
					
					<Divider orientation="left">APP支付</Divider>
					<FormItem label="APP ID" prop="app_app_id">
						<Input v-model="formItem.app_app_id" class="default-input" placeholder=""></Input>
						<div>（如果启用了APP支付，请填入开放平台绑定的APP 对应的APP ID）</div>
					</FormItem>
				</Form>	
				<div style="text-align: center;border-top:1px solid #eee;padding-top:10px;margin-top:10px;">
					<Button type="primary" @click="modalOk">保存</Button>
				</div>
				
			</Card>
		</div>

		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>

<script>
import util from '@/libs/util.js';

/**
 * 绑定小程序
 */
export default {
	name: 'weixinPayBasic',
    components: {
    	
    },
    data () {
    	return {
			formItem: {
				mch_id: '',
				key: '',
				jsapi_app_id: '',
				weapp_app_id: '',
				app_app_id: '',
			},
			
			// 表单数据规则
			ruleValidate:{
				mch_id: [{ required: true, message: '商户号不能为空', trigger: 'blur' }], 
				key:[{ required: true, message: 'API 密钥不能为空', trigger: 'blur' }],
			},
			
			spinShow: false,
		}
	},
	methods: {
		// 初始化方法(父组件调用)
		init ( config ) {
			this.formItem = config;
		},
		modalOk(){
			this.$refs['formValidate'].validate((valid) => {
			    if (valid) {
			    	this.spinShow = true;
			    	// ajax 保存数据，
			    	util.ajax.post( util.apiUrl.weixinPaySettingSave, {
						mch_id: this.formItem.mch_id,
						key: this.formItem.key,
						jsapi_app_id: this.formItem.jsapi_app_id,
						weapp_app_id: this.formItem.weapp_app_id,
						app_app_id: this.formItem.app_app_id,
					})
					.then( (response) => {
						this.spinShow = false;
						var res = response.data;
						
						if( res.code ){
							// 保存成功
			                this.$Message.success( res.message );
			            }
						else{
			        		this.$Message.error( res.message );
						}
					});
					
			    } 
			    else {
			    	// 验证失败
			        this.$Message.error('必填项不能为空！');
			    }
			});
		},
		// 查看说明图
		viewImage(){

			var imgSrc = util.apiHost + '/../assets/images/pay-tips.jpg';
			this.$Modal.info({
				title: '',
				width: '950',
				content: '<div style="width:100%;height:350px;background:url('+imgSrc+') center center no-repeat;background-size:100% auto;"></div>',
				closable: true,
				'footer-hide': true,
				'mask-closable': true,
			});
			
			this.$nextTick(()=>{
				document.querySelector('.ivu-modal-confirm-body').style.paddingLeft = '0';
			});
		   	
		}
	},
}
</script>	