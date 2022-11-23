<template>
	<view class="module-contain-area" >
		<view :style="moduleStyle">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	const pageOption = Page.BasePage({
		name: "module-contain",
		props: {
			containConf: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {

			}
		},
		computed: {
			moduleStyle() {
				let containConf = JSON.parse(JSON.stringify(this.containConf));
				let style = "";
				if (containConf.backgroundColor) style += "background-color:" + containConf.backgroundColor + ";";
				if (containConf.backgroundPosition) style += "background-position: center " + containConf
					.backgroundPosition + ";";
				if (containConf.backgroundImage) {
					style += "background-image:url(" + containConf.backgroundImage + ");";
					style += "background-repeat: no-repeat;";
					style += "background-size: 100% auto;";
				}
				//
				if (containConf.marginTop) style += "margin-top:" + containConf.marginTop + "px;";
				if (containConf.marginBottom) style += "margin-bottom:" + containConf.marginBottom + "px;";
				if (containConf.marginLeftRight) {
					style += "margin-left:" + containConf.marginLeftRight + "px;";
					style += "margin-right:" + containConf.marginLeftRight + "px;";
				}
				//
				if (containConf.paddingTop) style += "padding-top:" + containConf.paddingTop + "px;";
				if (containConf.paddingBottom) style += "padding-bottom:" + containConf.paddingBottom + "px;";
				if (containConf.paddingLeftRight) {
					style += "padding-left:" + containConf.paddingLeftRight + "px;";
					style += "padding-right:" + containConf.paddingLeftRight + "px;";
				}
				if (!(containConf.is_enable == 1 || typeof containConf.is_enable == "undefined")) {
					style += "display: none;"
				}
				console.log('style',style)
				return style;
			},
		}
	})
	export default pageOption;
</script>

<style lang="less" scoped>
	.module-contain-area {
		box-sizing: border-box;
		overflow: hidden;
	}
</style>
