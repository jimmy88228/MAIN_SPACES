export default {
  data() {
    const _this = this;
    return {
      columns: [{
          type: "selection",
          width: 60,
          align: "center",
          fixed: 'left'
        },
        {
          title: "商品",
          key: "goods_name",
          ellipsis: true,
          width: 260,
          slot: 'name',
          fixed: 'left'
        },
        {
          title: "价格",
          key: "price",
          minWidth: 150,
          slot: 'price'
        },
        {
          title: "库存",
          key: "inventory",
          sortable: "custom",
          width: 160,
          align: "left"
        },
        {
          title: "商品类型",
          key: "sale_type_name",
          width: 160
        },
        {
          title: "销售状态",
          key: "is_on_sale",
          width: 160,
          render(h, params) {
            return h('i-switch', {
              props: {
                size: 'large',
                value: params.row.is_on_sale,
                'true-value': '1',
                'false-value': '0',
                'before-change'() {
                  return new Promise((resolve, reject) => {
                    _this.updateStatus(params.row.goods_id, params.row.is_on_sale).then(() => {
                      reject();
                    });
                  });
                }
              }
            }, [
              h('span', {
                slot: 'open'
              }, '上架'),
              h('span', {
                slot: 'close'
              }, '下架')
            ])
          }
        },
        {
          title: "强制同步库存",
          key: "is_force_sys_inventory",
          align: "left",
          width: 160,
          render(h, params) {
            return h('i-switch', {
              props: {
                value: params.row.is_force_sys_inventory,
                'true-value': '1',
                'false-value': '0',
                'before-change'() {
                  return new Promise((resolve, reject) => {
                    _this.updateAsync(params.row.goods_id, params.row.is_force_sys_inventory).then(() => {
                      resolve();
                    });
                  });
                }
              }
            }, [
              h('span', {
                slot: 'open'
              }, '是'),
              h('span', {
                slot: 'close'
              }, '否')
            ])
          }
        },
        {
          title: "排序",
          key: "sort_order",
          sortable: "custom",
          width: 160,
          slot: 'sort_order'
        },
        {
          title: "创建时间",
          key: "created_at_format",
          sortable: "custom",
          align: "left",
          width: 160,
          slot: 'createTime'
        },
        {
          title: "操作",
          key: "handle",
          align: "center",
          width: 260,
          slot: 'handle',
          fixed: 'right'
        }
      ]
    }
  }
}
