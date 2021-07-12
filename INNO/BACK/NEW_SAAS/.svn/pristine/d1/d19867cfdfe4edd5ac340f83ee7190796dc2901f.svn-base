<style lang="less">
.cs-tags-box{

}	
</style>

<template>
	<div class="cs-tags-box">
		<div v-if="sessInfo.get_user_info != null">
			<div style="margin:0 10px 5px 20px;font-size: 12px;">用户标签：(全客服可见)</div>
			<!--标签选择器-->
			<tagsSelect ref="tags-select" tagsType="csTags" :userId="Number(sessInfo.get_user_info.id)"></tagsSelect>
		</div>
	</div>
</template>

<script>
import tagsSelect from '@/views/my-components/tags-select/tags-main';
	
/**
 * 客服打标签组件 组件
 */
export default {
	name:"csTagsBox",
    components: {
		tagsSelect,
	},
	props:{

	},
	data () {
	    return {
			// 会话详情
			sessInfo:{
				get_user_info: null
			},
		}
	},
	methods: {
		
	},
	watch:{
		'$store.state.app.selectedCsSession' ( to ){
			this.sessInfo = to;
			this.$nextTick(()=>{
				this.$refs['tags-select'].init();
			});
		}
	}
}
</script>