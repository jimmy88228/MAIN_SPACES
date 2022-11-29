<template>
	<div class="inline-b">
		
	</div>
</template>
<script>
	export default{
		name: 'linkSelect',
		data(){
			return {
				
			}
		},
		methods:{
			// 初始化
			init() {
				this.$nextTick(() => {
					this.initData();
				});
			},
			initData() {
				var mainData = JSON.parse(this.$util.cache.get('mainFrameData'));
				if (mainData != null && typeof(mainData.data) !== 'undefined') {
					console.log("mainData", mainData);
					this.linktoList = mainData.data.linkTo;
					this.modelLink = this.selectLink;
					for (var i in this.linktoList) {
						if (this.linktoList[i].code == this.selectLink.code) {
							this.sourceTypeName = '[' + this.linktoList[i].name + ']';
							break;
						}
					}
					if (typeof(this.modelLink) === 'undefined') {
						this.modelLink = {
							code: '',
							name: '',
							id: 0,
							sn: ''
						};
					}
				}
			},
			mounted() {
				this.init();
			}
		}
	}
</script>
<style>
	
</style>