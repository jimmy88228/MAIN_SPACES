import faqSort from './faq-sort';

export default {
    methods: {
        dealTreeData(context) {
            let format = context.map(item => {
                return {
                    // Tree组件需要的3个参数title,expand,children
                    title: item.title,
                    expand: typeof(item.children) != 'undefined' && item.children.length ? true : false,
                    children: typeof(item.children) != 'undefined' && item.children.length ? this.dealTreeData(item.children) : [],
					article_id: item.article_id || 0,
					article_code: item.article_code,
					indexs: item.indexs,
					sort: item.sort,
                    // 层数
                    hierarchy: item.level,

                    // 分类编码
                    actionCode: item.actionCode,
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
			let sortVal = [];
			
			if( data.hierarchy == 3 ){
				// 添加按钮
				wrapper.push(
					h('span', {
							attrs: {
								title: '添加关联文档'
							}
						},
						[h('span', {
							class:'table-handle-button',
							on: {
								click: () => {
									_this.addFaq(data);
								}
							}
						}, '添加关联文档')]
					)
				);
			}

			if ( data.hierarchy == 4 ) {
				// 查看
				wrapper.push(
					h('span', {
							attrs: {
								title: '查看文档'
							}
						},
						[h('span', {
							class:'table-handle-button',
							on: {
								click: () => {
									_this.viewFaq(data);
								}
							}
						},'查看')]
					)
				);
				
				// 删除
				wrapper.push(
					h('span', {
							attrs: {
								title: '解除绑定关系'
							}
						},
						[h('span', {
							class:'table-handle-button',
							on: {
								click: () => {
									_this.removeFaq(data);
								}
							}
						},'解绑')]
					)
				);
				
				// 排序按钮
				sortVal.push(
					h( faqSort,{
						props:{
							sort: data.sort,
							articleCode: data.article_code,
							menuCode: data.actionCode,
						},
						on: {
							'on-success': () => {
								// 不处理回调
							},
						}
					})
				);
			}
			
            return h('Row', {
                style: {
                    fontSize: '14px',
                    color: '#515a6e',
                    height: '40px',
                    lineHeight: '40px'
                }
            }, [
                h('Col', {
                    style: {
                        paddingLeft: data.hierarchy == 1 ? '32px' : ( (data.hierarchy == 2) ? '64px' : (data.hierarchy == 3 ? '96px' : '126px') ), 
                        textAlign: 'left'
                    },
                    'class': {
                        'cat-item': true
                    },
                    attrs: {
                        // 接口返回的栅格化宽度
                        span: this.formatColumns['title']
                    }
                }, [
                    h('p', ( data.hierarchy == 4 ? '[绑定文档] ' : '' ) + data.title )
                ]),
				// 排序
				h('Col', {
				    'class': {
				        'cat-item': true
				    },
				    attrs: {
				        span: this.formatColumns['sort']
				    }
				}, sortVal ),
				// 操作
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