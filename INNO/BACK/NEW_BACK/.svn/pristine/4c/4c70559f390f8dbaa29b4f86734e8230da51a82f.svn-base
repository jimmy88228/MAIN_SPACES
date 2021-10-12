<template>
	<PageTopBase topTitle="发放优惠券" class="send-coupon">
		<template v-slot:back>
			<Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28" />
		</template>
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
			<TabPane name="level" label="按等级发放">
				<level ref="level" :id="id" />
			</TabPane>
			 <TabPane name="group" label="按分组发放">
				 <group ref="group" :id="id" />
      		</TabPane>
			<TabPane name="user" label="指定用户发放">
				<user ref="user" :id="id" />
			</TabPane>
		</Tabs>
	</PageTopBase>
</template>

<script>
	import Level from './level';
	import Group from './group';
	import User from './user';
	import PageTopBase from '@/views/my-components/page-top-base/index';
	import TabsHelper from '@/libs/tabs-helper';

	export default {
		props: ['id'],
		data() {
			return {
				tabName: 'level'
			}
		},
		mixins: [TabsHelper],
		components: {
			Level,
			Group,
			User,
			PageTopBase
		},
		methods: {
			goBack() {
				this.$router.push({
					name: 'coupons-list'
				});
			}
		}
	}
</script>

<style>

</style>
