export default {
  data () {
    return {
      columns: [{
          width: 60,
          titleAlign: 'center',
          columnAlign: 'center',
          type: 'selection',
          isFrozen: true,
          isResize: true
        },
        {
          field: 'goods_name',
          title: '商品',
          width: 120,
          isFrozen: true,
          isResize: true,
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return `<img src="http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg" style="width: 50px;height:50px;"/>
      <img src="http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg"
      style="width: 50px;height:50px;" />
      <img src="http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg"
      style="width: 50px;height:50px;" />
      <p> ${rowData.goods_name} ${rowData.brand_id}</p>`
          }
        },
        {
          field: 'add_time',
          title: '价格',
          width: 120,
          isResize: true,
          isFrozen: true
        },
        {
          field: 'sale_type_name',
          title: '库存',
          isResize: true,
          width: 120,
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return `<img src="http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg" style="width: 50px;height:50px;"/>
      <img src="http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg"
      style="width: 50px;height:50px;" />
      <img src="http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg"
      style="width: 50px;height:50px;" />
      <p> ${rowData.sale_type_name} </p>`
          }
        },
        {
          field: 'is_on_sale_type',
          title: '商品类型',
          isResize: true,
          width: 120,
        },
        {
          field: 'created_at',
          title: '销售状态',
          width: 120,
          isResize: true,
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return `<img src="http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg" style="width: 50px;height:50px;"/>
      <img src="http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg"
      style="width: 50px;height:50px;" />
      <img src="http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg"
      style="width: 50px;height:50px;" />
      <p> ${rowData.created_at} </p>`
          }
        },
        {
          field: 'is_force_sys_inventory',
          title: '强制同步库存',
          isResize: true,
          width: 120,
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return `<img src="http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg" style="width: 50px;height:50px;"/>
      <img src="http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg"
      style="width: 50px;height:50px;" />
      <img src="http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg"
      style="width: 50px;height:50px;" />
      <p> ${rowData.is_force_sys_inventory} </p>`
          }
        },
        {
          field: 'sort_order',
          title: '排序',
          width: 120,
          isResize: true,
        },
        {
          field: 'created_at_format',
          title: '创建时间',
          width: 120,
          isResize: true,
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return `<img src="http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg" style="width: 50px;height:50px;"/>
      <img src="http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg"
      style="width: 50px;height:50px;" />
      <img src="http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg"
      style="width: 50px;height:50px;" />
      <p> ${rowData.created_at_format} </p>`
          }
        },
        {
          field: 'not_sale_time',
          title: '商品类型',
          width: 120,
          isResize: true,
        },
        // {
        //   field: 'birthdate',
        //   sortField: 'birthdate',
        //   titleClass: 'center aligned',
        //   dataClass: 'center aligned',
        // },
        // {
        //   field: 'gender',
        //   sortField: 'gender',
        //   titleClass: 'center aligned',
        //   dataClass: 'center aligned',
        //   formatter(value) {
        //     return value === 'M' ? 'Male' : 'Female'
        //   }
        // },
      ],
      columns2: [{
          width: 60,
          type: 'selection',
          fixed: 'left'
        },
        {
          key: 'goods_name',
          title: '商品',
          minWidth: 120,
          fixed: 'left',
          render: function (h, p) {
            return h('div', [
              h('img', {
                  attrs: {
                    src: 'http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg'
                  },
                  style: {
                    display: 'inline-block',
                    width: '50px',
                    height: '50px'
                  }
                }),
                h('p', p.row.goods_name + p.row.brand_id)
            ])
          }
        },
        {
          key: 'add_time',
          title: '价格',
          width: 120
        },
        {
          key: 'sale_type_name',
          title: '库存',
          minWidth: 120,
          render: function (h, p) {
            return h('div', [
              h('img', {
                  attrs: {
                    src: 'http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg'
                  },
                  style: {
                    display: 'inline-block',
                    width: '50px',
                    height: '50px'
                  }
                }),
                h('img', {
                  attrs: {
                    src: 'http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg'
                  },
                  style: {
                    display: 'inline-block',
                    width: '50px',
                    height: '50px'
                  }
                }),
                h('img', {
                  attrs: {
                    src: 'http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg'
                  },
                  style: {
                    display: 'inline-block',
                    width: '50px',
                    height: '50px'
                  }
                }),
                h('p', p.row.sale_type_name)
            ])
          }
        },
        {
          key: 'is_on_sale_type',
          title: '商品类型',
          width: 120
        },
        {
          key: 'created_at',
          title: '销售状态',
          minWidth: 120,
          render: function (h, p) {
            return h('div', [
              h('img', {
                attrs: {
                  src: 'http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg'
                },
                style: {
                  display: 'inline-block',
                  width: '50px',
                  height: '50px'
                }
              }),
              h('img', {
                attrs: {
                  src: 'http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg'
                },
                style: {
                  display: 'inline-block',
                  width: '50px',
                  height: '50px'
                }
              }),
              h('img', {
                attrs: {
                  src: 'http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg'
                },
                style: {
                  display: 'inline-block',
                  width: '50px',
                  height: '50px'
                }
              }),
              h('p', p.row.created_at)
            ])
            }
        },
        {
          key: 'is_force_sys_inventory',
          title: '强制同步库存',
          minWidth: 120,
          render: function (h, p) {
              return h('div', [
                h('img', {
                    attrs: {
                      src: 'http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg'
                    },
                    style: {
                      display: 'inline-block',
                      width: '50px',
                      height: '50px'
                    }
                  }),
                  h('img', {
                    attrs: {
                      src: 'http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg'
                    },
                    style: {
                      display: 'inline-block',
                      width: '50px',
                      height: '50px'
                    }
                  }),
                  h('img', {
                    attrs: {
                      src: 'http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg'
                    },
                    style: {
                      display: 'inline-block',
                      width: '50px',
                      height: '50px'
                    }
                  }),
                  h('p', p.row.is_force_sys_inventory)
              ])
              }
        },
        {
          key: 'sort_order',
          title: '排序',
          width: 120,
        },
        {
          key: 'created_at_format',
          title: '创建时间',
          minWidth: 120,
          render: function (h, p) {
              return h('div', [
                h('img', {
                    attrs: {
                      src: 'http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg'
                    },
                    style: {
                      display: 'inline-block',
                      width: '50px',
                      height: '50px'
                    }
                  }),
                  h('img', {
                    attrs: {
                      src: 'http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg'
                    },
                    style: {
                      display: 'inline-block',
                      width: '50px',
                      height: '50px'
                    }
                  }),
                  h('img', {
                    attrs: {
                      src: 'http://jwimgtest.innourl.com/SAAS_IMAGE/images/KINGCODE/index/gallery/20200401/20200401161004663_2762552.jpg'
                    },
                    style: {
                      display: 'inline-block',
                      width: '50px',
                      height: '50px'
                    }
                  }),
                  h('p', p.row.created_at_format)
              ])
              }
        },
        {
          key: 'not_sale_time',
          title: '商品类型',
          width: 120
        },
        // {
        //   field: 'birthdate',
        //   sortField: 'birthdate',
        //   titleClass: 'center aligned',
        //   dataClass: 'center aligned',
        // },
        // {
        //   field: 'gender',
        //   sortField: 'gender',
        //   titleClass: 'center aligned',
        //   dataClass: 'center aligned',
        //   formatter(value) {
        //     return value === 'M' ? 'Male' : 'Female'
        //   }
        // },
      ]
    }
  }
}
