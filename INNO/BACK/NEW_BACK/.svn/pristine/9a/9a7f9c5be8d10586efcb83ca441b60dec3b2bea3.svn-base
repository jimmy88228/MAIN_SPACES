<template>
	<Card class="store-info">
		<Tabs :value="tabsName" :animated="false" type="card" @on-click="onTabsClick">
			<TabPane name="store-list" label="店铺列表">
				<StoreList type="0" ref="store-list" />
			</TabPane>
			<TabPane name="store-rubbish" label="已关闭的店铺">
				<StoreList type="1" ref="store-rubbish" />
			</TabPane>
			<TabPane name="store-service" label="店铺二维码扫码回复设置">
				<StoreService ref="store-service" />
			</TabPane>
		</Tabs>
	</Card>
</template>

<script>
	import StoreList from './store-list/store-list';
	import StoreService from './/store-service/store-service';

	export default {
		components: {
			StoreList,
			StoreService
		},
		data() {
			return {
				tabsName: 'store-list'
			}
		},
		methods: {
			onTabsClick(name) {
				this.addAct(name);
			},
			addAct(name) {
				let tabName;
				if (name) {
					tabName = name;
				} else {
					tabName = this.$route.query.act ? this.$route.query.act : 'store-list';
				}
				this.$refs[tabName].loadData();
				this.$router.push({
					name: 'store-list',
					query: {
						act: tabName
					}
				});
				this.tabsName = tabName;
			}
		},
		mounted() {
			this.addAct();
		}
	}
</script>
