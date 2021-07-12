<template>
	<Drawer title="布局设置" closable 
	v-model="openDrawer" 
	class="layout-setting"
	:mask-style="{backgroundColor:'rgba(55,55,55,.2)'}">
		<Form ref="formValidate" :model="formItem" :label-width="160" label-position="left">
			<FormItem label="颜色风格">
				<ColorPicker v-model="formItem.style_color" recommend :editable="false" :hue="false" :colors="colors" 
				@on-change="onColorChange"/>
			</FormItem>	
			<FormItem label="开启标签栏">
				<i-switch v-model="formItem.open_page_tags" size="large" @on-change="onPageTagsChange">
					<span slot="open">开启</span>
					<span slot="close">关闭</span>
				</i-switch>
			</FormItem>	
		</Form>	
	</Drawer>
</template>

<script>
	export default {
		name: 'layoutSetting',
		data() {
			return {
				openDrawer: false,
				colors:['#1E2E3D','#FFFFFF',],
				colorsVal:{
					'black':'#1E2E3D',
					'white':'#FFFFFF',
				},
				colorsName:{
					'#1E2E3D':'black',
					'#FFFFFF':'white',
				},
				formItem:{
					open_page_tags: false,
					style_color: '#1E2E3D',
				},
			}
		},
		methods: {
			init(){
				let isOpen = this.$util.cache.get('openPageTags');
				isOpen = isOpen == true ? true : false;
				this.$store.commit('setOpenPageTags', isOpen );
				this.formItem.open_page_tags = isOpen;
				
				// 初始化颜色
				let badminTheme = this.$util.cache.get('badminTheme');
				badminTheme == '' || badminTheme == null ? badminTheme = 'black' : '';
				this.$store.commit('setBadminTheme', badminTheme );
				this.formItem.style_color = this.colorsVal[badminTheme];
			},
			openModal(){
				this.openDrawer = true;
			},
			onPageTagsChange( val ){
				this.$util.cache.set('openPageTags', val );
				this.$store.commit('setOpenPageTags', val );
			},
			onColorChange( val ){
				let name = this.colorsName[ val ];
				this.$util.cache.set('badminTheme', name );
				this.$store.commit('setBadminTheme', name );
			}
		},
		mounted() {
			this.init();
		},
	}
</script>
	
<style lang="less">
.layout-setting{	
	.ivu-color-picker-picker-panel{
		display: none;
	}
	.ivu-color-picker-picker-colors{
		min-width: 200px;
		
		.ivu-color-picker-picker-colors-wrapper,
		.ivu-color-picker-picker-colors-wrapper-color{
			width:25px;
			height:20px;
			margin:5px;
		}
	}
	
	.ivu-color-picker-confirm{
		.ivu-color-picker-confirm-color,
		.ivu-btn-default{
			display: none;
		}
	}
}
</style>