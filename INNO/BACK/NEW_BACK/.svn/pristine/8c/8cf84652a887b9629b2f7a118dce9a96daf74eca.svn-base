<style lang="less">
.cs-tags-session-box{

}
</style>

<template>
	<div class="cs-tags-session-box">
		<div v-if="sessInfo.get_user_info != null">
			<div style="margin:0 10px 5px 20px;font-size: 12px;">会话标签：(仅当前客服可见)</div>
			<!--标签选择器-->
			<tagsSelect ref="tags-select" tagsType="csSessionTags" :objectId="sessInfo.id" :userId="Number(sessInfo.get_user_info.id)"></tagsSelect>
		</div>
	</div>
</template>

<script>
import tagsSelect from '@/views/my-components/tags-select/tags-main';

/**
 * 客服打标签组件 组件
 */
export default {
	name:"csTagsSessionBox",
    components: {
		tagsSelect,
	},
	props:{
    loadData:{
      type:Boolean,
      default:false,
    }
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
		},
    'loadData' ( to ){
      if( to == true ){
        this.$nextTick(()=>{
          this.$refs['tags-select'].init();
        });
      }
    }
	}
}
</script>
