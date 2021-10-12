<style lang="less">
.images-cat-setting{
	.ivu-modal-body{
		min-height: 300px;
		max-height: 400px;
		overflow: hidden auto;
	}
}	
</style>	

<template>
	<div>
		<Modal v-model="showAddCatPop"
		title="素材分类管理"
		class="images-cat-setting"
		width="600">
			<div>注意：一级分类不能直接关联内容，最多建到二级分类</div>
			<Tree :data="data" :render="renderContent"></Tree>
		</Modal>

		<Modal
		v-model="modalShow"
		:title="modalTitle"
		:loading="modalLoading"
		:z-index="3000"
		@on-ok="onSaveCat">
		    <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">
				<FormItem prop="name" label="分类名">
		            <Input v-model="formItem.name" size="small" style="width:200px;" placeholder="请输入分类名称"></Input>
		       	</FormItem>
		   </Form>
		</Modal>
	</div>
</template>	

<script>
/**
 * 通用的客服素材分类编辑组件
 */
export default {
	name: 'tagsCatSetting',
	components: {
    },
	props:{
		// 标签分类类型
		tagsType:{
			type:String,
			default: ''
		}
	},
    data () {
        return {
			// 分类的树形数据
			data: [{
				title: '',
				expand: true,
				render: (h, { root, node, data }) => {
					// 根部配置数据
					return h('span', {
						style: {
							display: 'inline-block',
							width: '100%'
						}
					}, [
						h('span', [
							h('Icon', {
								props: {
									type: 'ios-folder-outline'
								},
								style: {
									marginRight: '8px'
								}
							}),
							h('span', data.title)
						]),
						h('span', {
							style: {
								display: 'inline-block',
								float: 'right',
								marginRight: '32px'
							}
						}, [
							// 根的主按钮
							h('Button', {
								props: Object.assign({}, this.buttonProps, {
									icon: 'md-add',
									type: 'primary',
								}),
								style: {
									width: '90px'
								},
								on: {
									click: () => { this.add(data) }
								}
							})
						])
					]);
				},
				// 子数据
				children: []
			}],
			
			catData:[],
			
			buttonProps: {
			    type: 'default',
			    size: 'small',
			},
			showAddCatPop:false,
			
			modalShow:false,
			modalTitle: '素材分类',
			modalLoading:true,
			addCatLoading:false,
			
			// 用于编辑的临时值
			tmpData: '',
			
			// 表单内容
			formItem: {
				id: 0,
				index: 0,
				name: '',
			},
			// 表单数据规则
			ruleValidate:{
				name:[{ required: true, message: '分类名称不能为空', trigger: 'blur', max:40 }],
			},
		}
	},
	methods: {
		onOpenPopTip( catData ){
			this.showAddCatPop = true;
			this.catData = catData;
			this.tmpData = '';
			
			// 初始化tree
			this.data[0].title = '全部分类';
			this.data[0].children = this.catData;
		},
		// 树状结构数据处理
		renderContent (h, { root, node, data }) {
		    return h('span', {
		        style: {
		            display: 'inline-block',
		            width: '100%'
		        },
		        class: 'treeRow',
		    }, [
		        h('span', [
		            h('Icon', {
		                props: {
		                    type: 'ios-paper-outline'
		                },
		                style: {
		                    marginRight: '8px'
		                }
		            }),
		            h('span', data.title)
		        ]),
		        h('span', {
		            style: {
		                display: 'inline-block',
		                float: 'right',
		                marginRight: '32px'
		            }
		        }, [
		        	// 新增按钮
		            h('Button', {
		                props: Object.assign({}, this.buttonProps, {
		                    icon: 'md-add',
		                }),
		                style: {
		                    marginRight: '8px',
							display: (data.parent_id > 0 ? 'none': '')
		                },
		                on: {
		                    click: () => { this.add(data) }
		                }
		            }),
		            // 编辑按钮
		            h('Button', {
		                props: Object.assign({}, this.buttonProps, {
		                    icon: 'md-settings'
		                }),
		                style: {
		                    marginRight: '8px'
		                },
		                on: {
		                    click: () => { this.edit(root, node, data) }
		                }
		            }),
		            // 删除按钮
		            h('Button', {
		                props: Object.assign({}, this.buttonProps, {
		                    icon: 'md-trash',
		                }),
						style:{
							display: ( data.children != null && data.children.length > 0 ? 'none': '')
						},
		                on: {
		                    click: () => { this.remove(root, node, data) }
		                }
		            })
		        ])
		    ]);
		},
		
		// 关闭添加分类气泡
		closeCatPoptip(){
			this.showAddCatPop = false;
		},
		// 移除分类
		remove( root, node, data ){
			
			this.$Modal.confirm({
		        title: '删除提示',
		        content: '确定删除标签分类吗？无标签的分类才能删除成功。',
		        okText: '确定删除',
		        cancelText: '取消',
		        onOk: () => {

					// ajax 提交数据
		        	this.$ajax.post( this.$api.tagCatRemove, {
		        		id: data.id,
		        	})
		    		.then( (response) => {
		    			var res = response.data;
		    			
		    			if( res.code ){
		    				const parentKey = root.find(el => el === node).parent;
		    				const parent = root.find(el => el.nodeKey === parentKey).node;
		    				const index = parent.children.indexOf(data);
		    				parent.children.splice(index, 1);
		    			}
		    			else{
		    				this.$Message.error( res.message );
		    			}
					});
				}
		    });    
		},
		// 新增
		add( data ) {
			this.modalShow = true;
			this.modalTitle = '新增分类';
		       
			// 传递的值
			this.formItem.name = '';
			this.formItem.id = 0;
			this.tmpData = data;
		},
		edit( root, node, data ){
			this.modalShow = true;
			this.modalTitle = '编辑分类';
			
			// 输入框的值
			this.formItem.name = data.name;
			this.formItem.id = data.id;
			this.tmpData = data;
		},
		// 保存编辑
		onSaveCat( ){
			this.modalLoading = true;
		
			this.$refs['formValidate'].validate((valid) => {
		        if (valid) {
		        	var parentId = ( typeof( this.tmpData.id ) == 'undefined' ? 0 : this.tmpData.id );
					
		        	// ajax 提交数据
		        	this.$ajax.post( ( this.formItem.id == 0 ? this.$api.tagCatAdd : this.$api.tagCatEdit ), {
						id: this.formItem.id,
						parent_id: parentId,
		        		name: this.formItem.name,
		        		type: this.tagsType,
		        	})
		    		.then( (response) => {
		    			var res = response.data;
		    			if( res.code ){
		    				// 关闭模态框
		    				this.modalShow = false;
							
							// 更新树
							if( this.formItem.id == 0 ){
								const children = this.tmpData.children || [];
								children.push({
								    title: this.formItem.name,
									name: this.formItem.name,
								    id: res.data.id,
									parent_id: parentId,
								    expand: true
								});
								this.$set(this.tmpData, 'children', children);
							}
							else{
								this.$set( this.tmpData, 'title', this.formItem.name );
								this.$set( this.tmpData, 'name', this.formItem.name );
							}
							
							this.catData = this.data[0].children;
		    			}
		    			else{
		    				this.modalShow = true;
		            		this.$Message.error( res.message );
		            		this.modalLoading = false;
		            
		                    setTimeout(() => {
			                    this.modalLoading = true;
			                }, 50);
		    			}
					});
		        }
				else{
					this.$Message.error( '请输入必填项' );
					
					this.modalLoading = false;
				    setTimeout(() => {
				    	this.modalShow = true;
				        this.modalLoading = true;
				    }, 50);
				}
		    });
		},
	},
}
</script>	