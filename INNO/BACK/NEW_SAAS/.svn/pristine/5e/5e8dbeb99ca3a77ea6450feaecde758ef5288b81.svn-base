<template>
	<Card class="full-reduction-list">
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
			<TabPane name="normal-activity" label="常规促销活动">
				<activity ref="normal-activity" />
			</TabPane>
			<TabPane name="all-activity" label="全场促销活动">
				<activity ref="all-activity" />
			</TabPane>
		</Tabs>
	</Card>
</template>

<script>
	import TabsHelper from '@/libs/tabs-helper';
	import Activity from './activity/activity';

	export default {
		mixins: [TabsHelper],
		components: {
			Activity
		},
		data() {
			return {
				tabName: 'normal-activity'
			}
		}
	}
</script>
