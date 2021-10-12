<style lang="less">
.global-setting{

}	
</style>

<template>
	<div class="global-setting">
		
		<!--超管后台全局设置-->
		<options ref="options" :showCodes="settingCodes" @on-success="init"></options>
	   
	</div>
</template>	

<script>
import util from '@/libs/util.js';
import options from '@/views/settings/options/options';

export default {
    components: {
		options,
    },
    data () {
        return {
        	dataList:[],
        	
        	spinShow: false,
          settingCodes: ['superAdmin'],
        }
    },
    methods:{
		// 初始化
		init(){
			this.$refs['options'].openModal();
		},
	},
	mounted () {
        this.init();
    },
};
</script>
