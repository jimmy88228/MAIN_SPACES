<style lang="less">
	.lottery-page{
		background-color:#efefef;
		.right-size{
			width:370px;
			background-color:#fff;
		}
	}
</style>
<template>
	<div class="lottery-page flex">
		<!-- <div class="f-shrink0" style="width:200px;">
			<editorLeftMenu ref="editorLeftMenu" :height="curHeight" pageType="lottery"></editorLeftMenu>
		</div> -->
		<div style="width:100%;">
			<editorBody ref="editorBody" :height="curHeight" pageType="lottery"></editorBody>
		</div>
		<div class="f-shrink0 right-size" >
			<editorRightSide ref="editorRightSide" :height="curHeight" pageType="lottery"></editorRightSide>
		</div>
	</div>
</template>
<script>
	import editorLeftMenu from '@/views/plugins/pages/editor-left-menu';
	import editorBody from '@/views/plugins/pages/editor-body';
	import editorRightSide from '@/views/plugins/pages/editor-right-side.vue';
	export default{
		components:{
			editorLeftMenu,
			editorBody,
			editorRightSide
		},
		data(){
			return {
				curHeight: 500,
				leftMenuData: [
						{
							cat: "lottery",
							code: "lotteryLogo",
							desc: "营销LOGO组件",
							icon: "logo-sass",
							icon_class: "icon",
							icon_color: "#19be6b",
							name: "营销LOGO",
							plugins_code: "lotteryLogo",
							show_in_toolbar: true
						},
						{
							cat: "lottery",
							code: "flipCard",
							desc: "翻卡活动",
							icon: "md-grid",
							icon_class: "icon",
							icon_color: "#19be6b",
							name: "翻卡活动",
							plugins_code: "flipCard",
							show_in_toolbar: true
						},
						{
							cat: "lottery",
							code: "fruitLottery",
							desc: "水果机",
							icon: "ios-keypad",
							icon_class: "icon",
							icon_color: "#19be6b",
							name: "水果机",
							plugins_code: "fruitLottery",
							show_in_toolbar: true
						},
						{
							cat: "lottery",
							code: "bigWheel",
							desc: "大转盘",
							icon: "md-help-buoy",
							icon_class: "icon",
							icon_color: "#19be6b",
							name: "大转盘",
							plugins_code: "bigWheel",
							show_in_toolbar: true
						},
						{
							cat: "lottery",
							code: "goldenEggs",
							desc: "砸金蛋",
							icon: "md-egg",
							icon_class: "icon",
							icon_color: "#19be6b",
							name: "砸金蛋",
							plugins_code: "goldenEggs",
							show_in_toolbar: true
						},
						{
							cat: "lottery",
							code: "winningList",
							desc: "营销名单组件",
							icon: "ios-podium",
							icon_class: "icon",
							icon_color: "#19be6b",
							name: "营销名单组件",
							plugins_code: "winningList",
							show_in_toolbar: true
						},
						
						// 以下为矩阵营销组件
						{
							cat: "lottery",
							code: "matrixMain",
							desc: "矩阵主体",
							icon: "logo-codepen",
							icon_class: "icon",
							icon_color: "#19be6b",
							name: "矩阵主体",
							plugins_code: "matrixMain",
							show_in_toolbar: true
						},
						{
							cat: "lottery",
							code: "matrixActive",
							desc: "参与矩阵",
							icon: "md-log-in",
							icon_class: "icon",
							icon_color: "#19be6b",
							name: "参与矩阵",
							plugins_code: "matrixActive",
							show_in_toolbar: true
						},
						{
							cat: "lottery",
							code: "matrixPrizes",
							desc: "矩阵奖品池",
							icon: "ios-medal",
							icon_class: "icon",
							icon_color: "#19be6b",
							name: "矩阵奖品池",
							plugins_code: "matrixPrizes",
							show_in_toolbar: true
						},
						{
							cat: "lottery",
							code: "matrixTasks",
							desc: "矩阵任务",
							icon: "ios-list-box",
							icon_class: "icon",
							icon_color: "#19be6b",
							name: "矩阵任务",
							plugins_code: "matrixTasks",
							show_in_toolbar: true
						}
				]
			}
		},
		beforeMount(){
			var h = document.documentElement.clientHeight || document.body.clientHeight;
			this.curHeight = h - 250;
		},
		methods:{
			init() {
				
			},
			initModuleData(customPage){
				customPage = customPage || {};
				let moduleList = customPage.moduleList || [];
				for(let i = 0; i < moduleList.length; i++){
					let _setting = moduleList[i].setting || "";
					if(_setting && typeof(_setting) == "string"){
						_setting = _setting .replace(/\\/g,'');
						moduleList[i].setting = JSON.parse(_setting);
					}
					moduleList[i].can_remove = 0;
				}
				let setting = customPage.setting || ""
				if(setting && typeof(setting) == "string"){
					setting = setting .replace(/\\/g,'');
					setting = JSON.parse(setting);
				}
				console.log("moduleList", moduleList)
				console.log("setting", setting)
				// this.$refs["editorLeftMenu"].initData(this.leftMenuData);
				this.$refs["editorBody"].initData(this.leftMenuData);
				this.$refs["editorRightSide"].initData(this.leftMenuData);
				this.$store.commit('setPageCompList', moduleList);
				this.$store.commit('setPageInfo', {
					id: customPage.pageId,
					setting: setting || {}
				});
				
			}
		}
	}
</script>