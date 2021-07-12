import TagEdit from './goods-tag-edit';

export default {
  data () {
    const _this = this;
    return {
      field: [
        {
          title: '标签id',
          key: 'tag_id'
        },
        {
          title: '标签名',
          key: 'tag_name',
          align: 'left',
          minWidth: 200,
          render (h, params) {
            return h(TagEdit, {
              props: {
                type: 'tag_name',
                tagId: params.row.tag_id,
                tagName: params.row.tag_name
              },
              on: {
                'edit-success' () {
                  _this.handleUpdate();
                }
              }
            })
          }
        },
        {
          title: '商品数量',
          key: 'goods_num',
          align: 'left'
        },
        {
          title: '是否显示',
          key: 'is_show',
          render: function (h, params) {
            return h('i-switch', {
              props: {
                value: params.row.is_show,
                size: 'large',
                'true-value': '1',
                'false-value': '0',
                'before-change'() {
                  return new Promise((resolve, reject) => {
                    _this.updateEnabled(params.row).then(() => {
                      resolve();
                    });
                  })
                }
              }
            }, [
              h('span', {
                slot: 'open'
              }, '开启'),
              h('span', {
                slot: 'close'
              }, '关闭')
            ])
          }
        },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          width: '240',
          slot: 'handle'
        }
      ]
    }
  }
}
