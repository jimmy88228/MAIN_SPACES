<style lang="less">
.weixin-native-setting{
	.box{
		width:550px;
		float:left;
		margin:10px;
	}
	.default-input{
		width:300px;
	}
	.default-txt{
		margin-left:10px;
	}
}	
</style>	

<template>
	<div class="weixin-native-setting">
		<div class="box">
			<Card>
		        <p slot="title">微信公众号原生设置</p>
		        
		        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
		        	<FormItem label="开发者ID（AppID）" prop="app_id">
		        		<Input v-model="formItem.app_id" class="default-input" placeholder=""></Input>
		        	</FormItem>
					<FormItem label="开发者密码（AppSecret）" prop="secret">
						<Input v-model="formItem.secret" class="default-input" placeholder=""></Input>
					</FormItem>
					
					<Divider orientation="left">把下面内容填入到微信后台对应的地方</Divider>
					
					<FormItem label="白名单IP地址">
						<span class="default-txt">{{whiteBookIp}}</span>
					</FormItem>
					<FormItem label="服务器地址（URL）">
						<span class="default-txt">{{serverUrl}}</span>
					</FormItem>
					<FormItem label="令牌 Token">
						<span class="default-txt">{{formItem.token}}</span>
					</FormItem>
					<FormItem label="消息加解密密钥">
						<span class="default-txt">{{formItem.aes_key}}</span>
					</FormItem>
					<FormItem label="消息加解密方式">
						<span class="default-txt">请勾选：安全模式</span>
					</FormItem>
		        </Form>	
				
				<div style="text-align: center;border-top:1px solid #eee;padding-top:10px;margin-top:10px;">
					<Button type="primary" @click="modalOk">保存</Button>
				</div>
				
		    </Card>
			
			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>
		</div>
	</div>
</template>	

<script>
import util from '@/libs/util.js';

/**
 * 原生授权设置
 */
export default {
	name: 'weixinNative',
    components: {
    	
    },
    data () {
    	return {
			formItem: {
				app_id: '',
				secret: '',
				token: '',
				aes_key: '',
			},
			
			// 服务器地址
			serverUrl: '',
			whiteBookIp: '',
			
			// 表单数据规则
			ruleValidate:{
				app_id: [{ required: true, message: '不能为空', trigger: 'blur' }], 
				secret:[{ required: true, message: '不能为空', trigger: 'blur' }],
			},
			
			spinShow: false,
		}
	},
	methods: {
		// 初始化方法
	    init ( config ) {
			this.whiteBookIp = config.whiteBookIp;
			this.serverUrl = config.serverUrl;
			this.formItem = config.nativeConfig;
		},
		modalOk(){
			this.$refs['formValidate'].validate((valid) => {
			    if (valid) {
			    	this.spinShow = true;
			    	// ajax 保存数据，
			    	util.ajax.post( util.apiUrl.weixinNativeSave, 
						this.formItem
					)
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
		}
	},
	mounted () {
		// 在父组件触发 this.init();
	},
}
</script>