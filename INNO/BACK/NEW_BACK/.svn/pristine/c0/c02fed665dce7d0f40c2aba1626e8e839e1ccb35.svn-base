<style lang="less">
.faq-list{

	.list-inner{
		.ivu-form-item{
			margin-bottom: 10px;
		}
		.ivu-input-icon-clear{
			right:50px;
		}
		.list_header{
			border: 1px solid #dcdee2;
			border-bottom: none;
			.goods-cat_columns{
				color: #515a6e;
				font-weight: bold;
				font-size: 12px;
				text-align: center;
				line-height: 40px;
				height: 40px;
				white-space: nowrap;
				overflow: hidden;
				background-color: #f8f8f9;
			}
		}
		
		.cat-item{
			text-align: center;
			background-color: #fff;
			padding-left: 18px;
			padding-right: 18px;
			height: 48px;
			line-height: 48px;
			box-sizing: border-box;
			text-overflow: ellipsis;
			font-size:12px;
		}
		.ivu-tree{
			border: 1px solid #dcdee2;
			li{
				ul{
					padding: 0 0 0 4px;
				}
			}
			.ivu-tree-title{
				width: 100%;
			}
			.ivu-tree-children {
				li{
					position: relative;
					.ivu-tree-arrow{
						position: absolute;
						left: 0;
						top: 2px;
						width: 20px;
						z-index: 1;
						padding: 10px;
						i{
							font-size: 16px;
						}
					}
				}
				
				.ivu-tree-children{
					.ivu-tree-arrow{
						left: 30px;
					}
					
					.ivu-tree-children{
						.ivu-tree-arrow{
							left: 60px;
						}
					}
				}
			}
			
		}
		.ivu-tree-empty{
			padding:20px;
			text-align: center;
			font-size:12px;
		}
	}
	
	.table-bg-image{
		background-size:100% auto !important;
	}
}
</style>
<template>
    <div class="faq-list">
		<Card class="list-inner">
			<div slot="title" class="icard-header">
				菜单绑定FAQ操作文档
			</div>	
			
			<!--自制表头-->
			<Row class-name="list_header">
				<Col v-for="item in columns" :span="item.span" :key="item.key" class-name="goods-cat_columns">{{item.title}}</Col>
			</Row>
			
			<!--树结构-->
			<Tree :data="menuListData" :render="renderContent"></Tree>
			<Spin fix v-show="showSpin"></Spin>
		</Card>
		
		<!--文档选择器-->
		<docsSelect ref="article-select" @on-ok="onDocsSelect"></docsSelect>
		
		<!--文档详情查看-->
		<docInfoModal ref="doc-info-modal"></docInfoModal>
    </div>
</template>

<script>
import FaqMixin from './faq-mixin.js';
import PageHelper from '@/libs/page-helper.js';
import docsSelect from '@/views/my-components/docs-select/docs-select';
import docInfoModal from './doc-info-modal.vue';

export default {
    components: {
		docsSelect,
		docInfoModal,
	},
    data() {
        return {
            canCreate: false,
            searchForm: {
                searchq: ''
			},
			showSpin: false,
			menuListData: [],
			// 原始数据的ui
			columns: [],
			// 当前选中的菜单索引
			currIndex:[],
			// 初始化数据
			formatColumns: {},
			// 搜索表单
        	formSearch:{
        		searchq:'',
			},
        }
    },
    mixins: [PageHelper, FaqMixin],
    methods: {
        onLoadData() {
			this.showSpin = true;
        	return this.$ajax.post( this.$api.faqList, {
		
			})
    		.then( response => {
    			let res = response.data;
    			if (res.code) {
                    this.data = res.data;
					this.canCreate = res.data && res.data.canCreate;
					this.columns = res.data && res.data.columns;
					let catData = res.data && res.data.items || [];
					this.menuListData = this.dealTreeData(catData);
					this.formatColumns = this.handleColums(this.columns);
					this.showSpin = false;
                }
			});
        },
        searchPage() {
			this.showSpin = true;
        	return this.$ajax.post( this.$api.articleCatList, this.formSearch)
    		.then( (response) => {
    			var res = response.data;
    			if( res.code ) {
					this.data = res.data;
					let catData = res.data && res.data.items || [];
					this.menuListData = this.dealTreeData(catData);
					this.currentPage = 1;
					this.showSpin = false;
                }
			});
		},
		// 查看FAQ
		viewFaq( row ){
			this.$refs['doc-info-modal'].openModal( row.article_code );
		},
		// 删除faq
		removeFaq( row ){
			this.$Modal.confirm({
			    title: '操作提示',
			    content: '确定取消绑定文档吗？',
			    okText: '确定',
			    cancelText: '取消',
			    onOk: () => {
			    	// 发送ajax 到服务器
			    	this.showSpin = true;
			    	return this.$ajax.post( this.$api.faqRemove, {
			    		menu_code: row.actionCode,
			    		article_code: row.article_code,
			    	})
			    	.then( (response) => {
			    		this.showSpin = false;
			    		var res = response.data;
			    		if( res.code ) {
			    			this.$Message.success( res.message );
							
							// 删除绑定数据
							var faqItems = this.menuListData[ row.indexs[0] ].children[ row.indexs[1] ].children[ row.indexs[2] ].children;
							for(var j in faqItems ){
								if( faqItems[j].article_code == row.article_code ){
									this.$delete( this.menuListData[ row.indexs[0] ].children[ row.indexs[1] ].children[ row.indexs[2] ].children, j );
								}
							}
			    	    }
			    	});
			    }
			});
		},
		// 打开文章选择器
		addFaq( row ){
			this.currIndex = row.indexs;
			this.$refs['article-select'].openModal( [], 'checkbox' );
		},
		// 文章选中的回调
		onDocsSelect( items ){console.log(items);
	
			var faqItems = this.menuListData[ this.currIndex[0] ].children[ this.currIndex[1] ].children[ this.currIndex[2] ].children;
			var menu_code = this.menuListData[ this.currIndex[0] ].children[ this.currIndex[1] ].children[ this.currIndex[2] ].actionCode;
			this.$set( this.menuListData[ this.currIndex[0] ].children[ this.currIndex[1] ].children[ this.currIndex[2] ], 'expand', true );
			
			var article_codes = [];
			for(var i in items){
				var inItem = false;
				
				for(var j in faqItems ){
					if( faqItems[j].article_code == items[i].code ){
						inItem = true;
						break;
					}
				}
				if( inItem == false ){
					article_codes.push(items[i].code);
					faqItems.push({
						article_code: items[i].code,
						title: items[i].title,
						hierarchy: 4,
						sort: 0,
						indexs: this.currIndex,
						actionCode: menu_code,
					});
				}
			}
			
			if( article_codes.length > 0 ){
				// 发送ajax 到服务器
				this.showSpin = true;
				return this.$ajax.post( this.$api.faqAdd, {
					menu_code: menu_code,
					article_codes: article_codes,
				})
				.then( (response) => {
					this.showSpin = false;
					var res = response.data;
					if( res.code ) {
						this.$Message.success( res.message );
					}
				});
			}
		},
    },
    mounted () {
        this.loadData();
    }
}
</script>