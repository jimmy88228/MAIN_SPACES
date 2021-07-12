<style lang="less">
.weixin-mini{
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
	.tips{
		width: 380px;
	    padding: 15px;
	    background: #f8f8f8;
	    border: 1px solid #E5E5E5;
		margin: 20px auto;
		font-size:12px;
	}
	
	.xicon{
		font-size: 38px;
		color: #333;
		line-height: 30px;
		padding-top: 7px;
	}
}	
</style>	

<template>
	<div class="weixin-mini">
		<div class="box">
			<Card>
		        <p slot="title">微信小程序授权设置</p>
		        
				<template v-if="openWeixinNative">
					<!--原生授权的小程序-->
					<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
						<FormItem label="小程序（AppID）" prop="app_id">
							<Input v-model="formItem.app_id" class="default-input" placeholder=""></Input>
						</FormItem>
						<FormItem label="小程序（AppSecret）" prop="secret">
							<Input v-model="formItem.secret" class="default-input" placeholder=""></Input>
						</FormItem>
					</Form>	
					<div style="text-align: center;border-top:1px solid #eee;padding-top:10px;margin-top:10px;">
						<Button type="primary" @click="modalOk">保存</Button>
					</div>
				</template>
				
				<template v-else>
					<!--第三方授权小程序-->
					<Form ref="formValidate" :label-width="100">
						<FormItem label="小程序号">
							<span v-if="(qrcodeUrl!=''?true:false)"  @click="showQrcode(qrcodeUrl)" style="cursor:pointer;" title="点击查看公众号二维码">
								<Avatar size="large" icon="" class="ionmy ion-my-qrcode xicon" shape="square" /> 
							</span>
							
							{{userName}} 
							<span v-if="(alias!=''?true:false)">
								( {{alias}} )
							</span>
						</FormItem>
						<FormItem label="公众号昵称">
							<span v-if="(headImg!=''?true:false)" @click="showCropedImage(headImg)" style="cursor:pointer;">
								<Avatar :src="headImg" size="large" shape="square" /> 
							</span>
							
							{{nickName}}
							
							<b v-if="authorEnable==1" style="color:green;"> [授权正常]</b>
							<b v-else-if="authorEnable==2" style="color:red"> [用户取消了授权]</b>
						</FormItem>
						<FormItem label="微信帐号类型">
							{{principalName}} 
						</FormItem>
						<FormItem v-if="(authorUrl==''?false:true)" label="授权状态">
							<span v-if="(userName=='未获取'?true:false)"><a :href="authorUrl" target="_blank" style="color:#2d8cf0">请点击这里</a>，进行小程序授权</span>
							<span v-else>如果您在小程序后台已取消授权，请 <a :href="authorUrl" target="_blank" style="color:#2d8cf0">重新授权</a></span>
						</FormItem>
					</Form>	
					
					<template v-if="(authorUrl==''?false:true)">
						<div class="tips">
							<div>你已获得该小程序的所有接口权限，可以正常对接小程序</div>
							<div>如果使用中发现接口有异常，请点此 <a :href="authorUrl" target="_blank" style="color:#2d8cf0">重新授权</a></span></div>		
						</div>
					</template>
					
				</template>
		    </Card>
			
			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>
		</div>
	</div>
</template>	

<script>
import util from '@/libs/util.js';

/**
 * 绑定小程序
 */
export default {
	name: 'weixinMini',
    components: {
    	
    },
    data () {
    	return {
			formItem: {
				app_id: '',
			},
			
			openWeixinNative: false,
			
			// 是否启用了第三方授权
			authorEnable: 0,
			authorUrl:'',
			userName:'',
			alias:'',
			nickName:'',
			principalName:'',
			headImg:'',
			qrcodeUrl:'',
			
			// 表单数据规则
			ruleValidate:{
				app_id: [{ required: true, message: 'app_id不能为空', trigger: 'blur' }], 
				secret: [{ required: true, message: 'secret不能为空', trigger: 'blur' }],
			},
			
			spinShow: false,
		}
	},
	methods: {
		// 初始化方法
	    init ( config ) {
			this.formItem = config.miniConfig;
			this.openWeixinNative = config.openWeixinNative;
			
			// ajax 请求获取初始化数据，然后动态更新下面数据源
			util.ajax.post( util.apiUrl.weixinMiniInfo, {
				
			})
			.then( (response) => {
				var res = response.data;
				
				if( res.code ){
			        // 初始化数据
			        this.authorUrl = res.data.author_url; // 授权地址
					
			        this.authorEnable = res.data.author_enable;
					
			        this.userName = res.data.user_name;
			        this.alias = res.data.alias;
			        this.nickName = res.data.nick_name;
			        this.principalName = res.data.principal_name;
			        this.headImg = res.data.head_img;
			        this.qrcodeUrl = res.data.qrcode_url;
				}
				else{
					this.$Notice.error({
			            title: '出错了',
			            desc: res.message
			        });
				}
			});
		},
		modalOk(){
			this.$refs['formValidate'].validate((valid) => {
			    if (valid) {
			    	this.spinShow = true;
			    	// ajax 保存数据，
			    	util.ajax.post( util.apiUrl.weixinMiniSave, 
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
		},
		// 因为二维码地址是被微信服务器防盗链的，所以只能在新窗口打开
		showQrcode( url ){
			window.open( url );
		}
	},
	mounted () {
		// 在父组件触发 this.init();
	},
}
</script>