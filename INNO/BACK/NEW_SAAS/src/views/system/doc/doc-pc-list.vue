<style lang="less">
.doc-pc-list{
	.panel{
		background-color: #f9fbfc;
		.panel-ul{
			margin-left:20px;
			
			li{
				cursor: pointer;
			}
		}
	}
	.ivu-collapse-content{
		background-color: #f9fbfc;
	}
	.ivu-collapse{
		border: 0 none;
	}
}	
</style>

<template>
    <div class="doc-pc-list">

		<Row type="flex" :gutter="20">
			<Col style="width:320px;">
				<div :style="{'max-height': bodyHeight +'px'}">
					<vue-scroll ref="vue-scroll" :ops="scrollOptions">
					<Collapse simple accordion v-model="collapse">
						<Panel v-for="(item,index) in list" :key="index" :name="'col'+item.id" class="panel">
							{{item.name}}
							<ul slot="content" class="panel-ul">
								<li v-for="(art,aindex) in item.get_articles" :key="aindex" class="clamp" @click="viewInfo(item.id, art)">
									{{art.title}}
								</li>
							</ul>
						</Panel>
					</Collapse>
					</vue-scroll>
				</div>
			</Col>
			<Col style="flex:1 1 0%;">
				<template v-if="articleCode !='' ">
					<keep-alive>
						<router-view :key="$route.fullPath"></router-view>
					</keep-alive>
				</template>
				<template v-else>
					<docInfo ref="doc-info"></docInfo>
				</template>
			</Col>
		</Row>

	</div>
</template>

<script>
import docInfo from './doc-info.vue';

/**
 * PC端 文档列表-公用组件
 */

export default {
	name:'docPcList',
    components: {
		docInfo,
    },
	props:{
		platform:{
			type:String,
			default: '',
		}
	},
    data () {
        return {
			list:[],
			
			collapse: 'col0',
			articleCode: '',
			bodyHeight: 500,
			
			// 虚拟滚动条
			scrollOptions:{
				mode: 'native',
				bar:{
					keepShow: true,
					background: '#c8c8c8',
					size:'3px',
				},
				// 滚动轨道
				rail:{
					size:'3px',
				},
				scrollPanel:{
					scrollingX:false,
				}
			},
		}
	},
	mounted() {
		this.init();
	},
	watch:{
		'platform'( to ){
			this.loadData();
		}
	},
	methods: {
		init(){
			this.bodyHeight = document.body.clientHeight - 170;
			
			this.$route.params.cat_name != null && this.$route.params.cat_name != '' ? this.collapse = 'col'+this.$route.params.cat_name : '';
			this.$route.params.code != null && this.$route.params.code != '' ? this.articleCode = this.$route.params.code : '';
		},
		// 获取文章列表
		loadData(){
			// ajax 请求获取数据
			this.$ajax.post( this.$api.docList, {
				platform: this.platform,
			})
			.then( (response) => {
				var res = response.data;
				if( res.code ){
					// 初始化表数据
					this.list = res.data.items;
				}
				
				this.tableLoading = false;
				
				if( this.articleCode == '' && this.list.length > 0 && this.list[0].get_articles.length > 0 ){
					this.$nextTick(()=>{
						this.collapse = 'col'+this.list[0].id;
						this.$refs['doc-info'].initData( this.list[0].get_articles[0].code );
					});
				}
			});
		},
		viewInfo( index, article ){
			this.$router.push('/'+this.platform+'-help/doc-info/'+article.code+'/'+index );
		}
	},
}
</script>