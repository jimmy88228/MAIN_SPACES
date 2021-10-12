import catSort from './cat-sort';

export default {
    methods: {
        dealTreeData(context) {
            let format = context.map(item => {
                return {
                    // Tree组件需要的3个参数title,expand,children
                    name: item.name,
					cover_img_format: item.cover_img_format,
                    expand: typeof(item.get_children) != 'undefined' && item.get_children.length ? true : false,
                    children: typeof(item.get_children) != 'undefined' && item.get_children.length ? this.dealTreeData(item.get_children) : [],

                    id: item.id || 0,
                    // 统计
                    get_feedback_count: item.get_feedback_count,
                    sort: item.sort,
                    created_at_format: item.created_at_format,
                    // 是否显示
                    status: Number(item.status),
                    handle: item.handle,
					
                    // 层数
                    hierarchy: ( item.parent_id==0 ? 1 : 2 ),
                    parent_id: item.parent_id,
                    // 分类编码
                    cat_code: item.code,
                }
            });
            return format;
        },
        handleColums(cols) {
            let result = {};
            cols.forEach(item => {
                if (item.key && item.span) {
                    let keyVal = item.key;
                    let spanVal = item.span;
                    result[keyVal] = spanVal;
                }
            });
            return result;
        },
        renderContent(h, {
            data
        }) {
            let text = data.status == 1 ? '显示' : '隐藏';
            let btnColor = data.status == 1 ? 'success' : 'error';
            let wrapper = [];
            let _this = this;
			if( data.hierarchy <= 1 ){
				// 添加按钮
				wrapper.push(
				    h('span', {
				            attrs: {
				                title: '添加子分类'
				            }
				        },
				        [h('span', {
				            props: {
				                type: 'ios-add-circle-outline',
				                size: '25'
				            },
				            class:'table-handle-button',
				            on: {
				                click: () => {
				                    _this.addSubCat(data);
				                }
				            }
				        },'添加子类')]
				    )
				);
			}
            if (data.handle.edit) {
                // 编辑按钮
                wrapper.push(
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
                                    _this.editGoodsCat(data);
                                }
                            }
                        },'编辑')]
                    )
                );
            }
            if (data.handle.remove && data.get_feedback_count === 0) {
                // 删除
                wrapper.push(
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
                                    _this.removeGoodsCat(data);
                                }
                            }
                        },'删除')]
                    )
                );
            }

            return h('Row', {
                style: {
                    fontSize: '14px',
                    color: '#515a6e',
                    height: '48px',
                    lineHeight: '48px'
                }
            }, [
                h('Col', {
                    style: {
                        paddingLeft: data.hierarchy == 1 ? '32px' : ( (data.hierarchy == 2) ? '64px' : '96px'), 
                        textAlign: 'left'
                    },
                    'class': {
                        'cat-item': true
                    },
                    attrs: {
                        // 接口返回的栅格化宽度
                        span: this.formatColumns['name']
                    }
                }, [
                    h('p', data.name)
                ]),

                h('Col', {
                    'class': {
                        'cat-item': true
                    },
                    attrs: {
                        span: this.formatColumns['get_feedback_count']
                    },
					
                }, [
                    h('p', {
                        style: {
                            // 使得所有元素可以对齐
                            marginRight: (data.hierarchy - 1) * 4 + 'px',
							cursor: 'pointer',
                        },
						on: {
							/*
						    click: () => {
						        window.open('/doc/doc-list/'+data.id );
						    }()*/
						}
                    }, data.get_feedback_count)
                ]),
                h('Col', {
                    'class': {
                        'cat-item': true
                    },
                    attrs: {
                        span: this.formatColumns['sort']
                    }
                }, [
					h( catSort,{
						props:{
							sort: Number( data.sort ),
							catId: data.id,
						},
						on: {
							'on-success': () => {
								// 触发重新加载列表
								_this.onLoadData();
							},
						}
					})
                ]),
                h('Col', {
                    'class': {
                        'cat-item': true
                    },
                    attrs: {
                        span: this.formatColumns['created_at_format']
                    }
                }, [
                    h('p', {
                        style: {
                            marginRight: (data.hierarchy - 1) * 4 + 'px'
                        }
                    }, data.created_at_format)
                ]),
                h('Col', {
                    'class': {
                        'cat-item': true
                    },
                    attrs: {
                        span: this.formatColumns['status']
                    }
                }, [
                    h('Tag', {
                        style: {
                            cursor: 'pointer'
                        },
                        props: {
                            type: 'dot',
                            color: btnColor
                        },
						'class' : 'tag-can-edit-inlist',
						nativeOn:{
							click: () => {
						        _this.updateStatus(data);
						    }
						}
                    }, text)
                ]),
                h('Col', {
                    'class': {
                        'cat-item': true
                    },
                    attrs: {
                        span: this.formatColumns['handle']
                    }
                }, [
                    h('div', wrapper)
                ])
            ])
        },

    }
}