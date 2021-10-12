export default {
  methods: {
    dealTreeData (context) {
      const format = context.map(item => {
        return {
          // Tree组件需要的3个参数title,expand,children
          title: item.agent_name,
          expand: !!item.children.length,
          children: item.children.length ? this.dealTreeData(item.children) : [],

          id: item.id,
          p_id: item.p_id,
          agent_code: item.agent_code,
          agent_name: item.agent_name,
          agent_type: item.agent_type,
          cascade: item.cascade,
          agent_type_str: (item.agent_type == 1 ? '自营' : (item.agent_type == 2 ? '加盟' : '代理')),
          getstore_count: item.getstore_count,
          handle: item.handle,
          // 层数
          hierarchy: item.hierarchy
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
      if (data.handle.shift) {
        wrapper.push(
          h('span', [
            h('a', {
              on: {
                click: () => {
                  _this.handleDistribute(JSON.stringify({
                    name: data.agent_name,
                    id: data.id
                  }));
                }
              }
            }, '转移店铺'),
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
                  _this.editArea(data);
                }
              }
            }, '编辑'),
            h('Divider', {
              style: {
                display: data.handle.remove ? 'inline-block' : 'none'
              },
              props: {
                type: "vertical"
              }
            })
          ])
        );
      }
      if (data.handle.remove) {
        // 删除
        wrapper.push(
          h('a', {
            style: {
              display: 'inline-block'
            },
            on: {
              click: () => {
                _this.delItem(data, '删除区域', '您确认要删除这条记录吗?');
              }
            }
          }, '删除')
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
            paddingLeft: (12 + (data.hierarchy - 1) * 12) + 'px',
            textAlign: 'left'
          },
          class: {
            'cat-item': true
          },
          attrs: {
            // 接口返回的栅格化宽度
            span: this.formatColumns.agent_name,
            'data-index': data.hierarchy
          }
        }, [
          h('span', data.title)
        ]),
        h('Col', {
          class: {
            'cat-item': true
          },
          attrs: {
            span: this.formatColumns.agent_code
          }
        }, [
          h('p', data.agent_code)
        ]),
        h('Col', {
          class: {
            'cat-item': true
          },
          attrs: {
            span: this.formatColumns.agent_type_str
          }
        }, [
          h('p', data.agent_type_str)
        ]),
        h('Col', {
          class: {
            'cat-item': true
          },
          attrs: {
            span: this.formatColumns.getstore_count
          }
        }, [
          h('p', data.getstore_count)
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
