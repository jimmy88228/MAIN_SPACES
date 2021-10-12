<style lang="less">
.weixin-pay-refund{
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
	<div class="weixin-pay-refund">
		<div class="box">
			<Card>
		        <p slot="title">退款设置</p>
				
				<Alert show-icon>
					退款设置提示
					<template slot="desc">
						如果业务上需要在后台进行微信退款、发红包等，请配置下面的支付证书
						<div>点击 <span style="color:#2d8cf0;cursor:pointer;" @click="viewImage">这里</span> 查看微信支付后台设置说明</div>
					</template>
				</Alert>
				<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
					<FormItem label="CERT证书">
						<Upload 
							name="pem_file"
							:action="uploadUrl"
							:data='{type:"cert"}'
							:max-size="500"
							:format="['pem']"
							accept=".pem"
							:on-exceeded-size="posterMaxSize"
							:on-format-error="posterFormatError" 
							:on-success="posterUploadSuccess">
							<Button icon="ios-cloud-upload-outline">请上传 apiclient_cert.pem 文件</Button>
						</Upload>
						<div v-if="formItem.has_cert_file" style="color:#009900">已上传成功</div>
					</FormItem>
					<FormItem label="KEY证书">
						<Upload 
							name="pem_file"
							:action="uploadUrl"
							:data='{type:"key"}'
							:max-size="500"
							:format="['pem']"
							accept=".pem"
							:on-exceeded-size="posterMaxSize"
							:on-format-error="posterFormatError" 
							:on-success="posterUploadSuccess">
							<Button icon="ios-cloud-upload-outline">请上传 apiclient_key.pem 文件</Button>
						</Upload>
						<div v-if="formItem.has_key_file" style="color:#009900">已上传成功</div>
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
import Cookies from 'js-cookie';

/**
 * 绑定小程序
 */
export default {
	name: 'weixinPayRefund',
    components: {
    	
    },
    data () {
    	return {
			formItem: {

			},
			
			// 表单数据规则
			ruleValidate:{
			},
			
			uploadUrl: '',
			
			spinShow: false,
		}
	},
	methods: {
		// 初始化方法(父组件调用)
		init ( config ) {
			this.formItem = config;
			
			this.uploadUrl = util.apiUrl.weixinRefundSettingSave+'?access-token='+Cookies.get('accessToken');
		},
		modalOk(){
			this.$refs['formValidate'].validate((valid) => {
			    if (valid) {
			    	this.spinShow = true;
			    	// ajax 保存数据，
			    	util.ajax.post( util.apiUrl.weixinRefundSettingSave, {
						
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
		// 图片上传处理
		posterMaxSize (file) {
		    this.$Notice.warning({
		        title: '超过了最大文件限制',
		        desc: '文件  ' + file.name + ' 超过了最大限制.'
		    });
		},
		posterFormatError(file){
			this.$Notice.warning({
		        title: '文件格式错误',
		        desc: '文件 ' + file.name + ' 格式不正确, 请选择 jpg/gif/png 图片文件'
		   });
		},
		// 文件上传成功
		posterUploadSuccess(res, file){
			if( res.data == 'cert' ){
				this.formItem.has_cert_file = true;
			}
			else if( res.data == 'key' ){
				this.formItem.has_key_file = true;
			}
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