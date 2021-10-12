<style lang="less">
.page-setting-lottery{
	position:absolute;
	top:10px;
	left:10px;
	font-size:0;
	z-index:10;
	.operate-icons{
		display: inline-block;
	}
	.operate-icon{
		width:100%;
		display:block;
	}
	.rule-icon{
		// position:absolute;
		// top:0px;
		// width: 35px;
		// left:0px;
	}
	.prize-icon{
		// position:absolute;
		// top:0px;
		// left:45px;
		// width: 35px;
	}
	.poster-icon{
		// position:absolute;
		// top:0px;
		// left:90px;
		// width: 35px;
	}
}
</style>
	
<template>
	<div class="page-setting-lottery">
		<div v-if="showRule" class="rule-icon operate-icons">
			<img :src="info.setting.rule.img" class="operate-icon" :style="getImgStyle(info.setting.rule)"/>
		</div>
		<div v-if="showPrize" class="prize-icon operate-icons">
			<img :src="info.setting.prize.img" class="operate-icon" :style="getImgStyle(info.setting.prize)"/>
		</div>
		<div v-if="showPoster" class="poster-icon operate-icons">
			<img :src="info.setting.poster.img" class="operate-icon" :style="getImgStyle(info.setting.poster)"/>
		</div>
	</div>	
</template>

<script>
import userImages from '@/views/my-components/user-images/user-images';
import lotteryMixins from '@/views/plugins/pages/widgets/mixins/lottery-mixins.js';
/**
 * 页面背景设置 
 */
export default {
	name: 'pageSettingLottery',
	components: {
		userImages,
	},
	mixins: [lotteryMixins],
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
					},
					poster: {
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
		},
		showPoster(){
			let poster = (this.info && this.info.setting && this.info.setting.poster) || {};
			return poster.is_enable ? true : false
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
				if(!setting.poster){
					this.$set(this.info.setting, 'poster', {img: '', is_enable: 1});
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