<style lang="less">
.weixin-author{
	.box{
		width:500px;
		float:left;
		margin:10px;
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
	<div class="weixin-author">
		<div class="box">
			<Card>
	            <p slot="title">微信公众号授权设置</p>

	            <Form ref="formValidate" :label-width="100">
	            	<FormItem label="公众号">
                  <!--
	            		<span v-if="(qrcodeUrl!=''?true:false)"  @click="showQrcode(qrcodeUrl)" style="cursor:pointer;" title="点击查看公众号二维码">
	            			<Avatar size="large" icon="" class="ionmy ion-my-qrcode xicon" shape="square" />
	            		</span>
                  -->
	            		微信号：{{userName}}
                  <!--
	            		<span v-if="(alias!=''?true:false)">
	            			( {{alias}} )
	            		</span>-->

                  <b v-if="authorEnable==1" style="color:green;"> [授权正常]</b>
                  <b v-else style="color:red"> [用户取消了授权 或未授权]</b>
	            	</FormItem>
                <FormItem label="APPID">
                  {{appId}}
                </FormItem>
	            	<FormItem v-if="(authorUrl==''?false:true)" label="授权状态">
	            		<span v-if="(userName=='未获取'?true:false)"><a :href="authorUrl" target="_blank" style="color:#2d8cf0">请点击这里</a>，进行微信授权</span>
	            		<span v-else>如果您在微信公众后台已取消授权，请 <a :href="authorUrl" target="_blank" style="color:#2d8cf0">重新授权</a></span>
	            	</FormItem>
	            </Form>

				<template v-if="(authorUrl==''?false:true)">
					<div class="tips">
						<div>你已获得该公众号的所有接口权限，可以正常对接微信</div>
						<div>如果使用中发现接口有异常，请点此 <a :href="authorUrl" target="_blank" style="color:#2d8cf0">重新授权</a></span></div>
					</div>
				</template>
	        </Card>
        </div>

        <Modal v-model="showCropedImageModal">
	        <p slot="header">预览图片</p>
	        <img :src="showUrl" style="width: 100%;">
	    </Modal>
	</div>
</template>

<script>
import util from '@/libs/util.js';
import Cookies from 'js-cookie';

export default {
	name: 'weixinAuthor',
    components: {

    },
    data () {
    	return {
    		showCropedImageModal:false,
    		showUrl:'',

    		// 是否启用了第三方授权
    		authorEnable: 0,
    		authorUrl:'',
    		userName:'',
    		alias:'',
    		nickName:'',
    		principalName:'',
    		headImg:'',
    		qrcodeUrl:'',
        appId: '',
    	}
    },
    methods: {
    	// 初始化方法
        init () {
        	// ajax 请求获取初始化数据，然后动态更新下面数据源
        	util.ajax.post( util.apiUrl.weixinOauthList, {

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
                    this.appId = res.data.appId;

    			}
    			else{
    				this.$Notice.error({
	                    title: '出错了',
	                    desc: res.message
	                });
    			}
			});
        },
        showCropedImage( url ){
			this.showUrl = url;
        	this.showCropedImageModal = true;
        },
        // 因为二维码地址是被微信服务器防盗链的，所以只能在新窗口打开
        showQrcode( url ){
        	window.open( url );
        }
    },
    mounted () {
        // 放到了父组件触发 this.init();
    },
}
</script>
