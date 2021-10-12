<template>
	<Card class="cloud-shop-settings">
		<Tabs :value="tabsName" :animated="false" type="card" @on-click="onTabsClick">
			<TabPane name="tab-rule" label="进店规则">
				<tabRuleSetting></tabRuleSetting>
			</TabPane>
			<TabPane name="tab-area" label="推荐区域">
				<tabAreaSetting></tabAreaSetting>
			</TabPane>
			<TabPane name="tab-store" label="隔离店铺">
				<tabStoreSetting></tabStoreSetting>
			</TabPane>
		</Tabs>
	</Card>
</template>

<script>
import tabRuleSetting from './tab-rule-setting.vue';
import tabAreaSetting from './tab-area-setting.vue';
import tabStoreSetting from './tab-store-setting.vue';
	
export default {
	components: {
		tabRuleSetting,
		tabAreaSetting,
		tabStoreSetting,
	},
	data() {
		return {
			tabsName: 'tab-rule',
		}
	},
	methods: {
		// 初始化
		init() {
			
		},
		onTabsClick(name){
		},
	},
	mounted() {
		this.init();
	},
}
</script>

<style lang="less">
.cloud-shop-settings{
	
}
</style>