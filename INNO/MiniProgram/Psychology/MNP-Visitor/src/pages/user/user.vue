<template>
	<view class="user">
		<custom-page :isCommissioner="authUserInfo.background == 1" :userInfo="authUserInfo" :isTransparent="false" :isShowTitle="false" ref="customPageRef" :isShowSupport="true"></custom-page>
		<!-- <stationBroadcasting style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"></stationBroadcasting>
		<stationBroadcasting style="position:absolute;top:20%;left:50%;transform:translate(-50%,-20%)"></stationBroadcasting> -->
	</view>
</template>

<script>
// import stationBroadcasting from '@/components/custom-page/module/station-broadcasting/station-broadcasting.vue'

	const app = getApp();
	const pageOption = Page.BasePage({
		data() {
			return {
				imgUser:'',
				authUserInfo: {}
			}
		},
		// components:{
		// 	stationBroadcasting
		// },
		// onShareAppMessage(e){},
		methods: {
			reFreshInfo(){
				this._getUserInfo().then(res=>{
					res.profilePicture = res.profilePicture || '' 
					this.authUserInfo = res;
				})
			},
			getMinePageDetail(){
				return this.$Http(this.$Apis.getMinePageDetail,{
				  other:{
				    isShowLoad: true
				  }
				}).then(res=>{
				  if(res.code == 1){
				    let data = res.data || {};
				    this.$refs["customPageRef"].initData(data);
				  }
				})
			},
		},
		onShow(){
			this._checkLogin().then(()=>{
				this.reFreshInfo();
			})
			this.getMinePageDetail();
		},
		onReady(){
			this.$EventBus.$on('onChooseAvatar',(res)=>{
				console.log(res,3333)
				this.authUserInfo.profilePicture = res.res.data

			})
		}
	})
	export default pageOption 
</script>

<style lang="scss" scoped>
</style>
