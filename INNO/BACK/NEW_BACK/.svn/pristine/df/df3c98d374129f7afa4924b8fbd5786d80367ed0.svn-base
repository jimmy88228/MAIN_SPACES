
<template>
	<Card>
		<Tabs type="card" name="prizeTabs" @on-click="changeTab">
				<TabPane label="优惠券" tab="prizeTabs" name="couponList">
					<coupon ref="couponList"></coupon>
				</TabPane>
				<TabPane label="回收站" tab="prizeTabs" name="recycleList">
					<recycle ref="recycleList"></recycle>
				</TabPane>
		</Tabs>
	</Card>
</template>
<script>
	import coupon from "./template/list/list.vue";
	import recycle from "./template/recycle/list.vue";
	export default{
		components:{
			coupon,
			recycle
		},
		data(){
			return {
				
			}
		},
		methods:{
			changeTab(name){
				this.$refs[name].loadData();
			}
		}
	}
</script>