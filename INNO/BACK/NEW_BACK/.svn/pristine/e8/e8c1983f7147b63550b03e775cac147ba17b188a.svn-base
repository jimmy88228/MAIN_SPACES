
<template>
	<Card>
		<Tabs type="card" name="prizeTabs" @on-click="changeTab">
				<TabPane label="全部" tab="prizeTabs" name="goodsList">
					<goods ref="goodsList"></goods>
				</TabPane>
				<TabPane label="回收站" tab="prizeTabs" name="recycleList">
					<recycle ref="recycleList"></recycle>
				</TabPane>
		</Tabs>
	</Card>
</template>
<script>
	import goods from "./template/list/list.vue";
	import recycle from "./template/recycle/list.vue";
	export default{
		components:{
			goods,
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