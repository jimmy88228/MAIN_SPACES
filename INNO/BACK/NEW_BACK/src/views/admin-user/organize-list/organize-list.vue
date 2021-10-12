<style lang="less">
.organize-list{
	.card{
		width:500px;
	}
}
</style>

<template>
	<div class="organize-list">
		<Card class="card">
			<p slot="title">组织架构管理</p>
			<Tree :data="data" :render="renderContent"></Tree>
		</Card>

		<Modal
	        v-model="modalShow"
	        :title="modalTitle"
	        :loading="modalLoading"
	        @on-ok="modalOk">

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
	        	<FormItem label="组织名称" prop="name">
	        		<Input v-model="formItem.name" placeholder="请输入组织名称" style="width: 300px"></Input>
	        	</FormItem>
	        </Form>

	    </Modal>

	    <Modal
	        v-model="addModalShow"
	        :title="addModalTitle"
	        :loading="addModalLoading"
	        @on-ok="addModalOk">

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
	        	<FormItem label="组织名称" prop="name">
	        		<Input v-model="formItem.name" placeholder="请输入组织名称" style="width: 300px"></Input>
	        	</FormItem>
	        </Form>

	    </Modal>
	</div>
</template>

<script>
export default {
  name: 'organizeList',
  components: {
  },
  data () {
    return {
      data: [
        {
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
                  marginLeft: '32px'
                }
              }, [
                            	// 根的主按钮
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'md-add',
                    type: 'primary'
                  }),
                  style: {
                    width: '100px'
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
        }
      ],

      buttonProps: {
        type: 'default',
        size: 'small'
      },
      // 表单内容
        	formItem: {
        		name: ''
        	},
        	// 表单数据规则
        	ruleValidate: {
        		name: [{ required: true, message: '组织名称不能为空', trigger: 'blur' }]
        	},

      // 模态框1
      modalShow: false,
      modalTitle: '',
      modalLoading: true,

      // 模态框2
      addModalShow: false,
      addModalTitle: '',
      addModalLoading: true,

      // 用于编辑的临时值
      tmpData: ''
    }
  },
  methods: {
    	// 初始化数据
    	init () {
    		// ajax 请求获取初始化数据，然后动态更新下面数据源
        	this.$ajax.post(this.$api.organizeList, {

        	})
    		.then((response) => {
    			const res = response.data;

    			if (res.code) {
            // 初始化tree
    				this.data[0].title = res.data.rootName;
	        		this.data[0].children = res.data.children;
    			}
        });
    	},
    	// 树状结构数据处理
    renderContent (h, { root, node, data }) {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%'
        },
        class: 'treeRow'
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
              icon: 'md-add'
            }),
            style: {
              marginRight: '8px',
		marginLeft: '60px'
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
              loading: data.loading
            }),
            on: {
              click: () => { this.remove(root, node, data) }
            }
          })
        ])
      ]);
    },
    // 新增
    add (data) {
        	this.addModalShow = true;
        	this.addModalTitle = '新增组织架构';

        	// 传递的值
        	this.formItem.name = '';
        	this.tmpData = data;
    },
    remove (root, node, data) {
        	this.$Modal.confirm({
        title: '删除当前组织架构',
        content: '确定删除吗？确定吗？',
        onOk: () => {
		        	data.loading = true;

		        	// ajax 进行删除
		        	this.$ajax.post(this.$api.organizeRemove, {
		        		id: data.id
		        	})
		    		.then((response) => {
		    			const res = response.data;
		    			if (res.code) {
			                const parentKey = root.find(el => el === node).parent;
			                const parent = root.find(el => el.nodeKey === parentKey).node;
			                const index = parent.children.indexOf(data);
			                parent.children.splice(index, 1);

			                this.$Message.success(res.message);
		               	} else {
		    				this.$Message.error(res.message);
		    			}
		                data.loading = false;
		         	});
         		}
      });
    },
    // tree 编辑按钮事件
    edit (root, node, data) {
        	this.modalShow = true;
        	this.modalTitle = '修改组织名称';
        	// 输入框的值
        	this.formItem.name = data.title;
        	this.tmpData = data;
    },
    // 模态框 OK 事件(编辑)
    modalOk () {
        	this.$refs.formValidate.validate((valid) => {
        if (valid) {
		        	// ajax 进行保存
		        	this.$ajax.post(this.$api.organizeEdit, {
		        		id: this.tmpData.id,
		        		name: this.formItem.name
		        	})
		    		.then((response) => {
		    			const res = response.data;

		    			if (res.code) {
                // 保存成功后处理
                this.$set(this.tmpData, 'title', this.formItem.name);
                this.$Message.success(res.message);

                this.modalShow = false;
                this.modalLoading = false;
		    			} else {
		    				this.$Message.error(res.message);

		    				this.modalShow = true;
		    				this.modalLoading = false;
		                    setTimeout(() => {
			                    this.modalLoading = true;
			                }, 50);
		    			}
            });
            	} else {
                	this.modalLoading = false;
          setTimeout(() => {
                    	this.modalShow = true;
	                    this.modalLoading = true;
	                }, 50);
        }
      });
    },
    // 模态框 OK 事件
    addModalOk () {
        	this.$refs.formValidate.validate((valid) => {
        if (valid) {
		        	// ajax 进行保存
		        	this.$ajax.post(this.$api.organizeAdd, {
		        		parent_id: (typeof (this.tmpData.id) === 'undefined' ? 0 : this.tmpData.id),
		        		name: this.formItem.name
		        	})
		    		.then((response) => {
		    			const res = response.data;

		    			if (res.code) {
                // 保存成功后处理
                this.$Message.success(res.message);
                this.addModalShow = false;
                this.addModalLoading = false;

                const children = this.tmpData.children || [];
			                children.push({
			                    title: this.formItem.name,
			                    id: res.data,
			                    loading: false,
			                    expand: true
			                });
			                this.$set(this.tmpData, 'children', children);
		    			} else {
		    				this.$Message.error(res.message);

		    				this.addModalShow = true;
		    				this.addModalLoading = false;
		                    setTimeout(() => {
			                    this.addModalLoading = true;
			                }, 50);
		    			}
            });
           		} else {
                	this.addModalLoading = false;
          setTimeout(() => {
                    	this.addModalShow = true;
	                    this.addModalLoading = true;
	                }, 50);
        }
      });
    }
  },
  // 挂载时候执行
  mounted () {
    this.init();
  }
}
</script>
