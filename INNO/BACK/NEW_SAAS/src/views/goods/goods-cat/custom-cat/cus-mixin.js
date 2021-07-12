export default {
  methods: {
    dealTreeData (context) {
      const format = context.map(item => {
        return {
          // Tree组件需要的3个参数title,expand,children
          title: item.vcat_name,
          expand: !!item.get_children.length,
          children: item.get_children.length ? this.dealTreeData(item.get_children) : [],
          cascade: item.cascade || [],

          id: item.vcat_id || 0,
          // 库存
          get_goods_count: item.get_goods_count,
          sort_order: item.sort_order,
          created_at_format: item.created_at_format,
          // 是否显示
          is_show: Number(item.is_show),
          handle: item.handle,
          // 层数
          hierarchy: item.hierarchy,
          parent_id: item.parent_id,
          // 英文名称
          vcat_name_en: item.vcat_name_en,
          // 分类描述
          vcat_desc: item.vcat_desc,
          // 是否推荐
          is_rmd: item.is_rmd,
          //导入商品数量
          import_goodnum: item.import_goodnum,
          //标签商品数量
          label_goodnum: item.label_goodnum,

        }
      });
      return format;
    },
    handleColums (cols) {
      const result = {};
      cols.forEach(item => {
        if (item.key && item.span) {
          const keyVal = item.key;
          const spanVal = item.span;
          result[keyVal] = spanVal;
        }
      });
      return result;
    },
    renderContent (h, {
      data
    }) {
      const wrapper = [];
      const _this = this;
      if (data.handle.distribution) {
        // 快速分配分类
        wrapper.push(
          h('span', [
            h('a', {
              on: {
                click: () => {
                  _this.handleDistribute(data, 'custom-cat');
                }
              }
            }, '快速分配分类'),
            h('Divider', {
              props: {
                type: "vertical"
              }
            })
          ])
        );
      }
      if (data.handle.edit) {
        // 编辑按钮
        wrapper.push(
          h('span', [
            h('a', {
              on: {
                click: () => {
                  _this.editGoodsCat(data);
                }
              }
            }, '编辑'),
            h('Divider', {
              // style: {
              //   display: data.handle.remove && data.get_goods_count == 0 ? 'inline-block' : 'none'
              // },
              props: {
                type: "vertical"
              }
            })
          ])
        );
      }
      if (data.handle.remove && data.get_goods_count == 0 && data.children.length == 0 ) {
        // 删除
        wrapper.push(
          h('a', {
            style: {
              display: 'inline-block'
            },
            on: {
              click: () => {
                _this.delItem(data, '删除分类', '确定删除分类吗？只有无关联商品 和 无子分类，才能删除成功。');
              }
            }
          }, '删除'),
          h('Divider', {
            props: {
              type: "vertical"
            }
          })
        );
      }

      // 同步标签
      if (data.handle.sync_tag) {
        wrapper.push(
          h('span', [
            h('a', {
              style: {
                display: 'inline-block'
              },
              on: {
                click: () => {
                  _this.handleSyncTag(data);
                }
              }
            }, '同步标签'),
            h('Divider', {
              props: {
                type: "vertical"
              }
            })
          ])
        );
      }

      // 导入移除
      if (data.handle.import_remove) {
        wrapper.push(
          h('span', [
            h('a', {
              style: {
                display: 'inline-block'
              },
              on: {
                click: () => {
                  _this.handleImportRemove(data);
                }
              }
            }, '导入移除'),
            h('Divider', {
              props: {
                type: "vertical"
              }
            })
          ])
        );
      }

      // 导出商品
      if (data.handle.export_goods) {
        wrapper.push(
          h('span', [
            h('a', {
              style: {
                display: 'inline-block'
              },
              on: {
                click: () => {
                  _this.confirmExport(data);
                }
              }
            }, '导出商品'),
            h('Divider', {
              props: {
                type: "vertical"
              }
            })
          ])
        );
      }

      // 导入商品
      if (data.handle.import_goods) {
        wrapper.push(
          h('span', [
            h('a', {
              style: {
                display: 'inline-block'
              },
              on: {
                click: () => {
                  _this.handleImportGoods(data);
                }
              }
            }, '导入商品'),
            h('Divider', {
              props: {
                type: "vertical"
              }
            })
          ])
        );
      }

      // 复制链接
      wrapper.push(
        h('span', [
          h('a', {
            style: {
              display: 'inline-block'
            },
            on: {
              click: () => {
                _this.copyUrl(data);
              }
            }
          }, '复制链接'),
          h('Divider', {
            props: {
              type: "vertical"
            }
          })
        ])
      );

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
            paddingLeft: (12 + (data.hierarchy - 1) * 12) + 'px',
            textAlign: 'left'
          },
          class: {
            'cat-item': true
          },
          attrs: {
            // 接口返回的栅格化宽度
            'data-index': data.hierarchy,
            span: this.formatColumns.vcat_name
          }
        }, [
          h('p', data.title)
        ]),
        h('Col', {
          class: {
            'cat-item': true
          },
          attrs: {
            span: this.formatColumns.id
          }
        }, [
          h('p', data.id)
        ]),
        h('Col', {
          class: {
            'cat-item': true
          },
          attrs: {
            span: this.formatColumns.get_goods_count
          }
        }, [
          h('p', data.get_goods_count)
        ]),
        h('Col', {
          class: {
            'cat-item': true
          },
          attrs: {
            span: this.formatColumns.import_goodnum
          }
        }, [
          h('p', data.import_goodnum)
        ]),
        h('a', {
          class: {
            'cat-item': true
          },
          attrs: {
            span: this.formatColumns.label_goodnum
          },
          on: {
            click: () => {
              _this.linkLabelGoodsList(data);
            }
          }
        }, [
          h('p', data.label_goodnum)
        ]),
        h('Col', {
          class: {
            'cat-item': true
          },
          attrs: {
            span: this.formatColumns.sort_order
          }
        }, [
          h('p', data.sort_order)
        ]),
        h('Col', {
          class: {
            'cat-item': true
          },
          attrs: {
            span: this.formatColumns.handle
          }
        }, [
          h('div', wrapper)
        ])
      ])
    }
  }
}
