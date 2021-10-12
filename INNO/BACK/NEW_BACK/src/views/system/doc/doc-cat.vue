<style lang="less">
.doc-cat{

}
</style>
<template>
    <div class="doc-cat">
		<Card v-show="showList" class="goods-cat-inner">
			<Row type="flex">
				<Col style="flex:1 1 0%">
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
						<span style="line-height: 2.3;font-size:12px;"></span>
					</Form>
				</Col>
				<Col style="width:190px;text-align: right;">
					<Button type="info" icon="md-add" @click="createCat">添加文档分类</Button>
					<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
				</Col>
			</Row>

			<div style="min-height:300px;">
				<Table :loading="tableLoading" :columns="columns" :height="tableHeight" :data="data"></Table>
			</div>
		</Card>

		<docCatForm ref="doc-cat-form" @on-close="handleClose" @on-success="handleSuccess"></docCatForm>
    </div>
</template>

<script>
import docCatForm from './doc-cat-form';
import docCatSort from './doc-cat-sort';

export default {
    components: {
		docCatForm,
		// docCatSort,
	},
    data() {
        return {
            canCreate: false,
            searchForm: {
                searchq: ''
			},

			columns:[],
			data:[],
			tableLoading: false,
			tableHeight: 500,

			// 初始化数据
			formatColumns: {},
			// 搜索表单
        	formSearch:{
        		searchq:'',
			},
			showList: true,
			platformList:[],
        }
    },
    methods: {
        loadData() {
			// 动态计算表高度
			this.tableHeight = document.body.clientHeight - 200;

			this.tableLoading = true;
        	return this.$ajax.post( this.$api.docCatList, {
				isInit: 3
			})
    		.then( response => {
    			let res = response.data;
    			if (res.code) {
                    this.data = res.data;
					this.canCreate = res.data.canCreate;

					this.initTable( res );
					this.data = res.data.items;
					this.platformList = res.data.platformList;
					this.tableLoading = false;
                }
			});
        },
		// 表头初始化
		initTable( res ){
			this.columns = res.data.columns;
			const _this = this;

			this.columns[ 0 ]['render']= (h, params) => {
				return h('span',{}, '['+params.row.platform_format+'] '+params.row.name);
			};

			// 排序
			this.columns[ 2 ]['render']= (h, params) => {
				return h(docCatSort,{
					props:{
						sort: params.row.sort,
						catId: params.row.id,
					},
					on: {
						'on-success': (val) => {
							// console.log('val',val);
							// 触发重新加载列表
							this.loadData();
						},
					}
				});
			};

			// 状态标识
			this.columns[ (this.columns.length-3) ]['render'] = (h, params) => {
			    const row = params.row;
	
          return h('i-switch',{
          	props: {
          	    size: 'large',
          		value: Number( row.status ),
          		'true-value': 1,
          		'false-value': 0,
          		'before-change'() {
          			return new Promise((resolve) => {
          				_this.updateStatus(params.row);
          			});
          		},
          	},
          },[
          	h('span', {
          		slot: 'open'
          	}, '显示'),
          	h('span', {
          		slot: 'close'
          	}, '隐藏')
          ]);

			};

			// 操作按钮
			this.columns[ (this.columns.length-1) ]['render'] = (h, params) => {
			    var buttons = [];

				if (params.row.handle.edit) {
				    // 编辑按钮
				    buttons.push(
				        h('span', {
				                attrs: {
				                    title: '编辑'
				                }
				            },
				            [h('span', {
				                props: {
				                    type: 'ios-create-outline',
				                    size: '29'
				                },
				                class:'table-handle-button',
				                on: {
				                    click: () => {
				                        this.editCat( params.row );
				                    }
				                }
				            },'编辑')]
				        )
				    );
				}
				if (params.row.handle.remove && Number(params.row.get_docs_count)  === 0) {
				    // 删除
				    buttons.push(
				        h('span', {
				                attrs: {
				                    title: '删除'
				                }
				            },
				            [h('span', {
				                props: {
				                    type: 'ios-trash-outline',
				                    size: '28'
				                },
				                class:'table-handle-button',
				                on: {
				                    click: () => {
				                       this.removeCat( params.row );
				                    }
				                }
				            },'删除')]
				        )
				    );
				}

				return h('div',buttons);
			};
		},
        searchPage() {
			this.tableLoading = true;
        	return this.$ajax.post( this.$api.docCatList, this.formSearch)
    		.then( (response) => {
    			var res = response.data;
    			if( res.code ) {
					this.data = res.data.items;
					this.currentPage = 1;
					this.tableLoading = false;
					                    
                }
			});
		},
		// 添加分类
        createCat(){
			this.showList = false;
        	this.$refs['doc-cat-form'].openModal(this.data, {}, this.platformList);
		},
		// 编辑按钮
        editCat(row){
			this.showList = false;
        	this.$refs['doc-cat-form'].openModal(this.data, row, this.platformList);
		},
		// 删除商品分类
        removeCat (row){
        	this.$Modal.confirm({
                title: '删除分类',
                content: '确定删除分类吗？只有无关联商品 和 无子分类，才能删除成功。',
                okText: '确定删除',
                cancelText: '取消',
                onOk: () => {
                	this.delItem(row);
                }
            });
        },
        delItem(row) {
			// this.tableLoading = true;
            return this.$ajax.post( this.$api.docCatRemove, {
                id: row.id
            })
            .then( (response) => {
                var res = response.data;
                if( res.code ){
                    // 删除后重新加载
                    this.loadData();
					this.$Message.success( res.message );
					// this.tableLoading = false;
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
			this.tableLoading = true;
			this.$ajax.post( this.$api.docCatStatus , {
				id : row.id,
				status: status,
			})
			.then( (response) => {
				this.tableLoading = false;
				var res = response.data;

				if( res.code ){
					// 保存成功
		            this.$Message.success( res.message );

		            // 更新列表的值
		            row.status = status;
		        }
			});
		},
    },
    mounted () {
        this.loadData();
    }
}
</script>
