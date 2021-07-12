<style lang="less">
.feed-back-cat{

	.goods-cat-inner{
		.ivu-form-item{
			margin-bottom: 10px;
		}
		.ivu-input-icon-clear{
			right:50px;
		}
		.goods-cat_header{
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
    <div class="feed-back-cat">
        <template v-if="showList">
			<Card class="goods-cat-inner">
				<Row>
					<Col span="20">
						<Form ref="formSearch" :model="formSearch" inline>
							<FormItem>
								<Input 
									v-model="formSearch.searchq" 
									style="width:280px;" 
									placeholder="分类名称 模糊查询" 
									clearable 
									search 
									enter-button 
									@on-search="searchPage"
									@on-clear="searchPage"
									@keydown.native.enter.prevent ="searchPage"></Input>
							</FormItem>
              <span>注意：请把分类添加到二级分类，只有一级分类的情况下选择框的分类是不显示的。</span>
						</Form>
					</Col>
					<Col span="4">
						<Button v-if="canCreate" type="info" icon="md-add" @click="createCat" style="float:right">添加分类</Button>
					</Col>
				</Row>
				
				<!--自制表头-->
				<Row class-name="goods-cat_header">
					<Col v-for="item in columns" :span="item.span" :key="item.key" class-name="goods-cat_columns">{{item.title}}</Col>
				</Row>
				
				<!--树结构-->
				<Tree :data="catListData" :render="renderContent"></Tree>
				<Spin fix v-show="showSpin"></Spin>
			</Card>
		</template>
		
		<catForm ref="cat-form" @on-close="handleClose" @on-success="handleSuccess"></catForm>
    </div>
</template>

<script>
import Mixin from './cat-mixin.js';
import PageHelper from '@/libs/page-helper.js';
import catForm from './cat-form';

export default {
    components: {
		catForm,
	},
    data() {
        return {
            canCreate: false,
            searchForm: {
                searchq: ''
			},
			showSpin: false,
			catListData: [],
			// 原始数据的ui
			columns: [],
			// 初始化数据
			formatColumns: {},
			// 搜索表单
        	formSearch:{
        		searchq:'',
			},
			showList: true
        }
    },
    mixins: [PageHelper, Mixin],
    methods: {
        onLoadData() {
			this.showSpin = true;
        	return this.$ajax.post( this.$api.feedbackCatList, {
				isInit: 3
			})
    		.then( response => {
    			let res = response.data;
    			if (res.code) {
                    this.data = res.data;
					this.canCreate = res.data && res.data.canCreate;
					this.columns = res.data && res.data.columns;
					let catData = res.data && res.data.items || [];
					this.catListData = this.dealTreeData(catData);
					this.formatColumns = this.handleColums(this.columns);
					this.showSpin = false;
                }
			});
        },
        searchPage() {
			this.showSpin = true;
        	return this.$ajax.post( this.$api.feedbackCatList, this.formSearch)
    		.then( (response) => {
    			var res = response.data;
    			if( res.code ) {
					this.data = res.data;
					let catData = res.data && res.data.items || [];
					this.catListData = this.dealTreeData(catData);
					this.currentPage = 1;
					this.showSpin = false;
                }
			});
		},
		// 添加分类
        createCat(){
			this.showList = false;
        	this.$refs['cat-form'].openModal(this.catListData,{});
		},
		// 添加子分类
		addSubCat( data ){
			this.showList = false;
			this.$refs['cat-form'].openModal(this.catListData, {}, data.id );
		},
		// 编辑按钮
        editGoodsCat(data){
			this.showList = false;
        	this.$refs['cat-form'].openModal(this.catListData, data);
		},
		// 删除商品分类
        removeGoodsCat (row){
        	this.$Modal.confirm({
                title: '删除分类',
                content: '确定删除分类吗？只有无关联任务 和 无子分类，才能删除成功。',
                okText: '确定删除',
                cancelText: '取消',
                onOk: () => {
                	this.delItem(row);
                }
            });
        },
        onDelItem(row) {
			this.showSpin = true;
            return this.$ajax.post( this.$api.feedbackCatRemove, {
                id: row.id
            })
            .then( (response) => {
                var res = response.data;
                if( res.code ){
                    // 删除后重新加载
                    this.loadData();
					this.$Message.success( res.message );
					this.showSpin = false;
                }
                else{
                    this.$Message.error( res.message );
                }
            });
		},
		handleClose() {
			this.loadData();
			this.showList = true;
		},
		handleSuccess() {
			this.loadData();
			this.showList = true;
		},
		// 直接在列表更新状态
		updateStatus(row){
			var status = (row.status == 0 ? 1 : 0);
			
			// ajax 保存数据
			this.$ajax.post( this.$api.feedbackCatStatus , {
				id : row.id,
				status: status,
			})
			.then( (response) => {
				var res = response.data;
				
				if( res.code ){
					// 保存成功
		            this.$Message.success( res.message );
		            
		            // 更新列表的值
		            row.status = status;
		        }
				else{
		    		this.$Message.error( res.message );
				}
			});
		},
    },
    mounted () {
        this.loadData();
    }
}
</script>

