<template>
	<view class="agree-page">
		<view>本指引是心理测评小程序开发者“{{loginData.agreementCustomer || ""}}”（以下简称“开发者”）为处理你的个人信息而制定。</view>
		<!-- <view>本指引是心理测评小程序开发者“广东英朗信息技术”（以下简称“开发者”）为处理你的个人信息而制定。</view> -->
		<view class="agree-row">开发者处理的信息</view>
		<view class="agree-row">· 为了便于你快捷设置平台个人信息，开发者将在获取你的明示同意后，收集你的微信昵称、头像。</view>
		<!-- <view class="agree-row">· 为了便于你选择本地化的咨询服务，开发者将在获取你的明示同意后，收集你的位置信息。</view> -->
		<view class="agree-row">· 为了便于你使用心理问答服务，开发者将在获取你的明示同意后，使用你的相册（仅写入）权限。</view>
		<view class="agree-tip">你的权益</view>
		<view class="agree-row">关于你的个人信息，你可以通过以下方式与开发者联系，行使查阅、复制、更正、删除等法定权利。</view>
		<view class="agree-tip">开发者对信息的存储</view>
		<view class="agree-row">开发者承诺，除法律法规另有规定外，开发者对你的信息的保存期限应当为实现处理目的所必要的最短时间。</view>
		<view class="agree-tip">信息的使用规则</view>
		<view class="agree-row">开发者将会在本指引所明示的用途内使用收集的信息</view>
		<view class="agree-row">如开发者使用你的信息超出本指引目的或合理范围，开发者必须在变更使用目的或范围前，再次以小程序通知方式告知并征得你的明示同意。</view>
		<view class="agree-tip">信息对外提供</view>
		<view class="agree-row">开发者承诺，不会主动共享或转让你的信息至任何第三方，如存在确需共享或转让时，开发者应当直接征得或确认第三方征得你的单独同意。</view>
		<view class="agree-row">开发者承诺，不会对外公开披露你的信息，如必须公开披露时，开发者应当向你告知公开披露的目的、披露信息的类型及可能涉及的信息，并征得你的单独同意。</view>
		<view class="agree-row">若你认为开发者未遵守上述约定，或有其他的投诉建议、或未成年人个人信息保护相关问题，可通过微信进行投诉。</view>
	</view>
</template>

<script>
  import SM from '@/common/manager/structure-manage'
	export default {
		data() {
			return {
				loginData:{}
			}
		},
		onReady(){
			 SM.getCustomerInfo().then(res => {
          this.loginData = res ||{}
        });
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.agree-page{
	padding: 60rpx 50rpx;
	.agree-tip{
		font-family: PingFangSC-Medium;
		font-size: 28rpx;
		color: #151515;
		line-height: 37rpx;
		font-weight: bold;
	}
	.agree-row{
		margin-bottom: 50rpx;
		font-family: PingFangSC-Regular;
		font-size: 26rpx;
		color: #333333;
	}
}
</style>
