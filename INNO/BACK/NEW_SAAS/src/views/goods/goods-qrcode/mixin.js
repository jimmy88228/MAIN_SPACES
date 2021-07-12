export default {
  watch: {
    defaultColums (orderColum) {
      const _this = this;
      const imgDomCol = document.getElementsByClassName('my-img');
      this.columns = orderColum.map(item => {
        switch (item.key) {
          case 'goods_name':
            return {
              ...item,
              render: function (h, params) {
                return h('div', {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                  },
                  directives: [{
                    name: 'viewer'
                  }]
                }, [
                  h('div', {
                    style: {
                      display: 'inline-block',
                      height: '70px',
                      width: '70px',
                      border: '1px solid #eee',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      margin: '8px 5px 8px 0',
                      overFlow: 'hidden'
                    }
                  }, [
                    h('img', {
                      style: {
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      },
                      attrs: {
                        title: '点击查看大图',
                        src: params.row.goods_thumb2 || '',
                        class: 'my-img',
                        alt: params.row.goods_name
                      },
                      on: {
                        load () {
                          imgDomCol[params.index].style.display = 'block';
                        },
                        error () {
                          if (!params.row.goods_thumb2) imgDomCol[params.index].style.display = 'none';
                        }
                      }
                    })
                  ]),
                  h('span', {
                    domProps: {
                      innerHTML: params.row.goods_name || ''
                    }
                  })
                ])
              }
            }
          case 'color':
            return {
              ...item,
              render: function (h, params) {
                if (params.row.color.length > 0) {
                  return h('ul', params.row.color.map((item, index) => {
                    const sign = (item.is_create) ? '(已生成)' : '';
                    return h('li', {
                      style: {
                        listStyle: 'none'
                      }
                    }, [
                      h('Checkbox', {
                        props: {
                          value: item.isChecked
                        },
                        on: {
                          'on-change' (bool) {
                            _this.tableData[params.index].color[index].isChecked = bool;
                            _this.checkSelected();
                            const isAll = _this.tableData[params.index].color.every(item => item.isChecked);
                            _this.isCheckAll(isAll, params.index);
                          }
                        }
                      }, item.color_name + sign)
                    ])
                  }))
                }
              }
            }
          case 'handle':
            return {
              ...item,
              render: function (h, params) {
                const wrapper = [];
                if (params.row.handle.create) {
                  wrapper.push(
                    h('span', [
                      h('a', {
                        on: {
                          click: () => {
                            const result = params.row.color.filter(item => item.isChecked).map(item => item.color_id);
                            if (result.length === 0) {
                              _this.$Message.error('请选择要生成的颜色或单款');
                              return false;
                            }
                            _this.createQrcode(result);
                          }
                        }
                      }, '生成二维码'),
                      h('Divider', {
                        style: {
                          display: 'inline-block'
                        },
                        props: {
                          type: "vertical"
                        }
                      })
                    ])
                  );
                }
                if (params.row.handle.download) {
                  wrapper.push(
                    h('a', {
                      style: {
                        display: 'inline-block'
                      },
                      on: {
                        click: () => {
                          const result = params.row.color.filter(item => item.isChecked).map(item => item.color_id);
                          const hasCreated = params.row.color.filter(item => item.isChecked).every(item => !!item.is_create);
                          if (result.length === 0) {
                            _this.$Message.error('请选择要下载的颜色或单款');
                            return false;
                          }
                          if (!hasCreated) {
                            _this.$Message.error('请先生成要下载的颜色或单款');
                            return false;
                          }
                          _this.downLoadQrcode(result);
                        }
                      }
                    }, '下载二维码')
                  );
                }
                return h('div', wrapper);
              }
            }
          default:
            return item;
        }
      });
    }
  }
}
