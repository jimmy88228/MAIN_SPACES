 <style lang="less">
.faq-box{
	.faq-content{
		margin-bottom: 10px;
	}
	.faq-list{

		.item{
			cursor: pointer;
			margin-bottom: 12px;
			list-style: none;
			
			.txt{
				&:hover{
					color:#2d8cf0;
				}
			}
		}
	}
}
</style>

<template>
	<div class="faq-box">
		<Card>
			<div slot="title">
				<Icon type="ios-help-circle-outline" size="20" /> 帮助和服务
			</div>

			<a slot="extra">
	            <Icon type="md-arrow-forward" size="22" title="隐藏" @click="hideFaqSider"/>
	        </a>

	        <div class="faq-card-body">
				<div class="faq-list">
					<ul>
						<li v-for="(item,index) in faqList" :key="index" 
						class="item"
						@click="viewFaq( item.article_code, item.cat_id )">
							<span class="clamp2 txt">{{item.title}}</span>
						</li>
						<li class="item" @click="goHelpCenter">
							<span class="txt">帮助中心 <Icon type="ios-arrow-forward" /></span>
						</li>
					</ul>
				</div>
	        </div>
		</Card>

    <!--文档详情查看-->
    <docInfoModal ref="doc-info-modal"></docInfoModal>
	</div>
</template>

<script>
import docInfoModal from '@/views/system/doc/doc-info-modal.vue';

/**
 * 帮助说明 faq
 */
export default {
	name: 'faqBox',
	components: {
    docInfoModal,
	},
	props: {
	},
	data () {
    	return {
    		faq:[],
    		
			faqList: [],
    	}
   	},
   	methods: {
    	// 初始化
    	init(){

    	},
    	// 父组件调用
    	initData( faq ){
    		this.faq = faq;
    		this.getFaqContent( this.$route.name );
    	},
    	// 关闭 faq侧栏
    	hideFaqSider(){
    		this.$emit('on-hide', {});
    	},
    	// 动态获取 FAQ 内容
    	getFaqContent( name ){				
			this.faqList = ( typeof(this.faq) != 'undefined' 
								&& typeof( this.faq[ name+'_list' ] ) != 'undefined' ) ? this.faq[ name+'_list' ] : '';
    	},
		// 查看FAQ
		viewFaq( code, cat_id ){
			this.$refs['doc-info-modal'].openModal( code );
		},
		// 跳去帮助中心
		goHelpCenter(){
			this.$router.push('/settings/help-center');
		},
    },
    watch: {
    	// 监测路由的变化
        '$route' (to) {
        	this.getFaqContent( to.name );
        }
    },
    mounted () {
    	this.init();
    },
}
</script>
