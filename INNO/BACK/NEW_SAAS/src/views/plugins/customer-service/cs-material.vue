<style lang="less">
</style>

<template>
	<div>
		<Card>
			<Tabs v-model="currTabName" type="card" :animated="false" @on-click="loadData">
		        <TabPane label="文本" name="TEXT">
					<textList ref="text-list" :fromMenu="1" @on-add-success="loadData"></textList>
				</TabPane>   
			    <TabPane label="图片" name="IMAGE">
			        <imageList ref="image-list" :fromMenu="1"></imageList>
			    </TabPane>
			    <TabPane label="小程序卡片" name="CARD">
			        <cardList ref="card-list" :fromMenu="1"></cardList>
			    </TabPane>
			</Tabs>    
		</Card>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>

<script>
/**
 * 客服素材管理
 */
import textList from '@/views/my-components/cs-material-select/text-list';
import imageList from '@/views/my-components/cs-material-select/image-list';
import cardList from '@/views/my-components/cs-material-select/card-list';

export default {
	name: 'csMaterial',
	components: {
		textList,
		imageList,
		cardList,
	},
	data () {
    	return {
			spinShow:false,
			showUserCatIndex:0,
			currTabName: 'TEXT',
			
			isLoad:{},
    	}
   	},
   	methods: {
    	// 初始化
    	init(){
			this.currTabName = 'TEXT';
			
			// 默认加载图片数据
			this.loadData();
    	},
		loadData(){
			switch( this.currTabName ){
				case 'TEXT':
					this.loadTexts();
					break;
					
				case 'IMAGE':
					this.loadImages();
					break;
					
				case 'CARD':
					this.loadCards();
					break;
			}
			
			this.$set( this.isLoad, this.currTabName, true );
		},
		loadTexts(){
			this.spinShow = true;
			
			// ajax 请求获取初始化数据，（文本列表）
			this.$ajax.post( this.$api.csMaterialList, {
				pageSize: 40,
				isInit: 1,
				type: 'TEXT',
				cat_id: this.showUserCatIndex,
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				
				if( res.code ){
					// 初始化用户素材列表的组件
					this.$refs['text-list'].initData( res, false,[], [] );
				}

			});
		},
		loadImages(){
			this.spinShow = true;
			
			// ajax 请求获取初始化数据，（图片列表）
			this.$ajax.post( this.$api.csMaterialList, {
				pageSize: 40,
				isInit: 1,
				type: 'IMAGE',
				cat_id: this.showUserCatIndex,
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				
				if( res.code ){
					// 初始化用户素材列表的组件
					this.$refs['image-list'].initData( res, false,[], [] );
				}

			});
		},
		loadCards(){
			this.spinShow = true;
			
			// ajax 请求获取初始化数据，（小程序卡片列表）
			this.$ajax.post( this.$api.csMaterialList, {
				pageSize: 40,
				isInit: 1,
				type: 'CARD',
				cat_id: this.showUserCatIndex,
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				
				if( res.code ){
					// 初始化用户素材列表的组件
					this.$refs['card-list'].initData( res, false,[], [] );
				}

			});
		}
    },
    mounted () {
    	this.init();
    },
}
</script>