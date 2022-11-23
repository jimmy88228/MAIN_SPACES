<template>
	<view class="advertise-area">
		<view class="view-area" :style="viewStyle">
			<template v-if="viewData.images && viewData.images.length > 0">
				<view class="img-item-area" v-for="(item, index) in viewData.images" :key="index" :style="itemStyle" @click="jumpAction(item.link)">
					<view class="img-item">
						<view class="img-icon-bg" :style="'background-image:url(' + item.img + ');'"></view>
						<image  class="img-icon" :src="item.img" mode="widthFix"></image>
					</view>
				</view>
			</template>
		</view>
	</view>
</template>
<script>
		const pageOption = Page.BasePage({
			name: "advertise",
			props: {
				dynamicSetting: {
					type: Object,
					default:()=>{}
				},
				viewData: {
					type: Object,
					default:()=>{}
				}
			},
			computed:{
				
				viewStyle(){
					let dynamicSetting = this.dynamicSetting || {};
					let style = "";
					let gutter = parseFloat(dynamicSetting.gutter) / 2 || 0;
					if(dynamicSetting.open_slide){
						style="width:100%;overflow-y:hidden; overflow-x: auto;"
					} else {
						style="flex-wrap: wrap;"
					}
					style += "padding: 0px " + gutter + "px;"
					return style
				},
				itemStyle(){
					let dynamicSetting = this.dynamicSetting || {};
					let style = "";
					let itemW = (100 / parseInt(dynamicSetting.row)) + '%';
					let gutter = parseFloat(dynamicSetting.gutter) / 2 || 0;
					style = "width:" + itemW + ";padding: 0px " + gutter + "px;";
					return style
				}
			},
			data(){
				return {
					chooseTab: 0
				}
			},
			mounted(){},
			methods:{
			}
		})
		export default pageOption;
</script>

<style lang="scss" scoped>
	.advertise-area{
		.view-area{
			display: flex;
			box-sizing: border-box;
			.img-item-area{
				flex-shrink: 0;
				box-sizing: border-box;
				.img-item{
					width: 100%;
					position:relative;
					.img-icon{
						opacity: 0;
						width:100%;
						position:relative;
					}
					.img-icon-bg{
						position: absolute;
						width: 200%;
						height:200%;
						top:0px;
						left:0px;
						transform: scale(0.5);
						transform-origin: top left;
						background-repeat: no-repeat;
						background-position: top left;
						background-size: 100% 100%;
					}
				}
			}
		}
	}
</style>
