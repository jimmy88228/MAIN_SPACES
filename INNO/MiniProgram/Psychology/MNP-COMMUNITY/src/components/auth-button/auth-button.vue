<template>
	<view class="custom-btn-area">
		<slot></slot>
		<template v-if="!auth">
			<button class="custom-auth-btn" :style="customStyle" :disabled="disabled" @click="onClick" :open-type="openType" :type="type" >
				
			</button>
		</template>
		<template v-else-if="openType == 'getPhoneNumber'">
			<button class="custom-auth-btn" :style="customStyle" @click="onClick" :disabled="disabled" @getphonenumber="onGetphonenumber" :open-type="openType" :type="type" >
				<!-- <slot></slot> -->
			</button>
		</template>
		<template v-else-if="openType == 'getUserInfo'" >
			<!-- <slot></slot> -->
			<button class="custom-auth-btn" :style="customStyle" :disabled="disabled" :loading="isLoading" :open-type="openType" :type="type" @click="onAuth">
				
			</button>
		</template>
		<template v-else-if="openType == 'chooseAvatar'" >
			<!-- <slot></slot> -->
			<button class="custom-auth-btn" :style="customStyle" :disabled="disabled" :loading="isLoading" :open-type="openType" :type="type" @chooseavatar="chooseavatar">
				
			</button>
		</template>
		<template v-else-if="openType == 'contact'" >
			<button class="custom-auth-btn" :style="customStyle" :disabled="disabled" :loading="isLoading" :open-type="openType" @contact="onContact" :type="type">
				<!-- <slot></slot> -->
			</button>
		</template>
	</view>
</template>

<script>
  import UniApi from "@/common/support/tools/uni-api-promise.js";
	import appUtil from "../../common/support/utils.js";
	import Conf from "../../config/config.js";
	import SMH from "@/common/helper/show-msg-handler.js"
	const app = getApp();
	const pageOption = Page.BaseComp({
		props: {
			type: {
				type: String,
				default: "default"
			},
			size: {
				type: String,
				default: "default"
			},
			openType: {//按钮类型
				type: String,
				default: ""
			},
			auth: {
				type: Boolean,
				default: true
			},
			disabled: {//失效按钮
				type: Boolean,
				default: false
			},
			onlyPath:{
				type:Boolean,
				default:false
			},
			
			limitTime: {
				type: Number | String,
				default: Conf.clickLimitTime || 2000
			},
			customStyle : {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				isLoading: false
			}
		},
		methods:{
			onClick(){
				this.$emit("clicked", { openType: this.openType });
			},
			onContact(e){
				console.log("onContact", e)
				this.$emit("contact", { openType: this.openType,e });
			},
			onGetuserinfo(e){
					this.$emit("getuserinfo", { openType: this.openType, e });
			},
			clickButton(){
					this.$emit("click")
			},
			onGetphonenumber(e){
				console.log("onGetphonenumber", e)
				// if(e.detail && !e.detail.code){
				// 	SMH.showToast({
				// 		title:"请先升级最新的微信客户端"
				// 	})
				// 	return
				// }
				if(e.detail.iv){
					this.$emit("getphonenumber", { openType: this.openType,e })
				}else{
					this.$emit("getphonenumberErr",{e})
				}
			},
			// 头像选择功能
			chooseavatar({detail}){
				// console.log(detail.avatarUrl,this.$Apis.uploadWxAvatarUrl,"获取用户头像")
				let imageUrl = {
					path:'',
					url:''
				}

				let params = {
						url:this.$Apis.uploadWxAvatarUrl.u,
						filePath:detail.avatarUrl,
						name:'image',
            header:{
							'content-type':'multipart/form-data',
              userToken:app.LM.userToken||"",
              platformType:Conf.platformSrc||"",
              appCode:Conf.brandCode||""
            },
						formData:{
							sessionId: app.LM.sessionId || 0
						}
				}

				UniApi.uploadFile({
					...params
				}).then(res=>{
					imageUrl = JSON.parse(res.data).data || ""
					if(!this.onlyPath){
						appUtil.throttle(()=>{
							app.LM.updateUserProfile(true,imageUrl.path).then((res)=>{
								this.$emit("authed", { res, openType: this.openType,url:imageUrl.url });
							})
							
						}, this.limitTime)()
					}
					this.$emit("chooseavatar",imageUrl)
				})
			},
			onAuth(e){
				appUtil.throttle(()=>{
					app.LM.updateUserProfile().then((res)=>{
						console.log("app.LM.updateUserProfile", res);
						this.$emit("authed", { res, openType: this.openType });
					})
					
				}, this.limitTime)()
			}
		},
	})
	export default pageOption;
</script>

<style scoped lang="scss">
	.custom-btn-area {
		width:100%;
		height:100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		background: none;
		margin: 0;
		padding: 0;
		white-space: nowrap;
		border: none;
		border-radius: 0;
		box-sizing: border-box;
		text-align: center;
		text-decoration: none;
		line-height: 2.55555556;
		-webkit-tap-highlight-color: transparent;
		position: relative !important;
		overflow: hidden;
		color: #000000;
		button {
			background: unset;
		}
		.custom-auth-btn {
			width:100%;
			height:100%;
			font-size: 26rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			opacity: 0;
			// float: left;
			top: 0;
			left: 0;
			// width: 100%;
			// height: 100%;
			// background: none !important;
		}

		.custom-auth-btn::after {
			// content: none;
			// border: 0;
			// background: none !important;
		}
	}

</style>
