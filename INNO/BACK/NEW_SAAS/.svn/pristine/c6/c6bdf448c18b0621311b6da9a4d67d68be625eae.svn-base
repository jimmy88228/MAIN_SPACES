<style lang="less">
.page-setting-lottery{
	position:absolute;
	top:20px;
	left:20px;
	z-index:10;
	.operate-icon{
		width:100%;
	}
	.rule-icon{
		position:absolute;
		top:0px;
		width: 35px;
		left:0px;
	}
	.prize-icon{
		position:absolute;
		top:0px;
		left:45px;
		width: 35px;
	}
}
</style>
	
<template>
	<div class="page-setting-lottery">
		<div v-if="showRule" class="rule-icon">
			<img :src="info.setting.rule.img" class="operate-icon"/>
		</div>
		<div v-if="showPrize" class="prize-icon">
			<img :src="info.setting.prize.img" class="operate-icon"/>
		</div>
	</div>	
</template>

<script>
import userImages from '@/views/my-components/user-images/user-images';
	
/**
 * 页面背景设置 
 */
export default {
	name: 'pageSettingLottery',
	components: {
		userImages,
	},
	props:{
		currIndex:{
			type: [Number,String],
			default: 0,
		},
	},
	data () {
	    return {
			info:{
				setting:{
					rule:{
						img: "",
						is_enable: 1,
					},
					prize: {
						img: "",
						is_enable: 1,
					}
				}
			},
			operateType: ""
		}
	},
	computed:{
		showRule(){
			let rule = (this.info && this.info.setting && this.info.setting.rule) || {};
			return rule.is_enable ? true : false
		},
		showPrize(){
			let prize = (this.info && this.info.setting && this.info.setting.prize) || {};
			return prize.is_enable ? true : false
		}
	},
	methods: {
		// 初始化
		init(){
			setTimeout(()=>{
				// 双向绑定store 的数据
				this.info = this.$store.state.app.pageInfo;
				if( typeof( this.info.setting ) == 'undefined' || this.info.setting == '' ){
					this.$set(this.info, 'setting', {});
				}
				let setting = this.info.setting || {};
				if(!setting.rule){
					this.$set(this.info.setting, 'rule', {img: '', is_enable: 1});
				}
				if(!setting.prize){
					this.$set(this.info.setting, 'prize', {img: '', is_enable: 1});
				}
			}, 5000);
		},
	},
	watch:{
		
	},
	mounted () {
		this.init();
	},
}
</script>