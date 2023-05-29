<template>
	<view class="image-ad-area">
		<view class="group-tab" v-if="imagesGroup.length > 1">
			<view class="tab-item" :style="chooseTab == gIndex ? 'border-color:' + brandStyle.themeColor + ';' : ''" v-for="(gItem, gIndex) in imagesGroup" @click="chooseTabEvent(gIndex)">
			{{gItem.name || "分组名[" + gIndex + "]"}}
			</view>
		</view>
		<advertise v-if="dynamicSetting.type == 't1'" :viewData="currentGroup" :dynamicSetting="dynamicSetting"></advertise>
		<carousel v-else-if="dynamicSetting.type == 't2'" :viewData="currentGroup" :dynamicSetting="dynamicSetting"></carousel>
	</view>
</template>

<script>
	import advertise from "../advertise/advertise.vue";
	import carousel from "../carousel/carousel.vue";
		const pageOption = Page.BasePage({
			name: "image-ad",
			components: { advertise, carousel },
			props: {
				moduleInfo: {
					type: Object,
					default:()=>{}
				}
			},
			computed:{
				dynamicSetting(){
					return this.moduleInfo.dynamicSetting || {}
				},
				imagesGroup(){
					let moduleInfo = this.moduleInfo || {};
					let moduleData = moduleInfo.moduleData || {};
					return moduleData.imagesGroup || [];
				},
				currentGroup(){
					let chooseTab = this.chooseTab || 0;
					return this.imagesGroup[chooseTab] || {};
				},
			},
			data(){
				return {
					chooseTab: 0
				}
			},
			methods:{
				chooseTabEvent(index){
					if(this.chooseTab != index) this.chooseTab = index;
				}
			}
		})
		export default pageOption;
</script>

<style lang="less" scoped>
	.image-ad-area{
		.group-tab{
			overflow-y: hidden;
			overflow-x: auto;
			display: flex;
			.tab-item{
				flex: 1;
				text-align:center;
				height: 80rpx;
				line-height: 80rpx;
				border-bottom: 4rpx solid transparent;
			}
		}
	}
</style>
