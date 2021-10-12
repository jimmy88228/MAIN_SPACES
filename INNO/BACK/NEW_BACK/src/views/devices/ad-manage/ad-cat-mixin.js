import CatSort from './cat-sort.vue';

export default {
  data () {
    const _this = this;
    return {
      field: [
        {
          title: 'id',
          key: 'id'
        },
        {
          title: '方法名',
          key: 'menu_name'
        },
        {
          title: '对应级别',
          key: 'cat_name',
          align: 'left',
          slot: 'cat_name',
        },
        {
          title: '是否开启',
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
          title: '排序',
          key: 'sort',
          render(h, params) {
            return h(CatSort, {
              props: {
                // type: 'color_sort',
                value: params.row.sort,
                id: params.row.id
              },
              on: {
                'edit-success'() {
                  _this.handleUpdate();
                }
              }
            })
          }
        },
        {
          title: '操作',
          align: 'left',
          key: 'handle',
          slot: 'handle',
          width: 200,
          // fixed: 'right'
        }
      ]
    }
  }
}
