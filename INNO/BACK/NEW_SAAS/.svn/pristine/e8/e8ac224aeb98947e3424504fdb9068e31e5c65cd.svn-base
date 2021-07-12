<style lang="less">
.cs-material-box{
	.txt{
		cursor: pointer;
		font-size: 13px;
	}
}		
</style>
	
<template>
	<div class="cs-material-box">
		<Poptip v-model="showPoptip" placement="top-end">
			<span class="txt">客服素材库</span>
			
			<div slot="content">
				<Button type="success" @click="openSelectMaterial('TEXT')">文本</Button>
				<Button type="info" @click="openSelectMaterial('IMAGE')">图片</Button>
				<Button type="warning" @click="openSelectMaterial('CARD')">小程序卡片</Button>
			</div>
		</Poptip>
		
		<!--客服素材选择器-->
		<csMaterialSelect ref="cs-material-select" @on-ok="onSelectMaterial"></csMaterialSelect>
	</div>
</template>

<script>
import csMaterialSelect from '@/views/my-components/cs-material-select/cs-material';

/**
 * 客服素材库选择发送 - 组件
 */
export default {
	name:"csMaterialBox",
    components: {
		csMaterialSelect,
	},
	props:{

	},
	data () {
	    return {
			showPoptip:false,
		}
	},
	methods: {
		// 打开选择素材的框
		openSelectMaterial( type ){
			this.$refs['cs-material-select'].showModal({
				multi: 0,
				type: type,
			});
		},
		// 选中素材的回调
		onSelectMaterial( obj ){
			this.$emit('on-send', obj );
		},
	},
}
</script>