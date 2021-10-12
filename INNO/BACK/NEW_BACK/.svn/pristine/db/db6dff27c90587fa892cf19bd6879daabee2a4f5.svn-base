<template>
  <div class="goods_details">
    <Table :columns="columns" :data="tableData" ref="myTable"></Table>
  </div>
</template>

<script>
export default {
  props: {
    orderGoods: {
      type: Array,
      required: true
    },
    goodsColumns: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      columns: [],
      tableData: []
    }
  },
  watch: {
    orderGoods(newVal) {
      this.tableData = newVal;
      const send_numbers = this.tableData.map(item => item.goods_num).join(',');
      const rec_ids = this.tableData.map(item => item.rec_id).join(',');
      this.$emit('get-result', {
        send_numbers,
        rec_ids
      });
    },
    goodsColumns(newVal) {
      const that = this;
      this.columns = newVal;
      this.columns.forEach(item => {
        if (item.key === 'goods_thumb') {
          item.width = 300;
          item.align = 'left';
          item.render = (h, params) => {
            return h('div', {
              style: {
                display: 'flex'
              }
            }, [
              h('img', {
                style: {
                  width: '60px',
                  height: '60px',
                  display: 'block',
                  margin: '10px 10px 10px 0',
                  objectFit: 'contain',
                  flexShrink: 0
                },
                attrs: {
                  src: params.row.goods_thumb
                }
              }),
              h('div', {
                style: {
                  marginTop: '10px'
                },
              }, [
                h('p', {
                  attrs: {
                    class: 'clamp2'
                  }
                }, params.row.goods_name),
                h('p', {
                  attrs: {
                    // class: 'clamp2'
                  }
                },'款号:' + params.row.sku),
                h('p', {
                  attrs: {
                    // class: 'clamp2'
                  }
                }, params.row.specs_name)
              ])
            ]);
          }
        }
        if (item.key === 'goods_send_num') {
          item.render = (h, params) => {
            return h('div', [
              h('Input', {
                style: {
                  width: '200px'
                },
                attrs: {
                  type: 'number',
                  value: params.row.goods_send_num
                },
                on: {
                  'on-change' (e) {
                    const val = e.target.value;
                    that.tableData[params.index].goods_send_num = val;
                    const send_numbers = that.tableData.map(item => item.goods_send_num).join(',');
                    const rec_ids = that.tableData.map(item => item.rec_id).join(',');
                    that.$emit('get-result', {
                      send_numbers,
                      rec_ids
                    });
                  }
                }
              })
            ])
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.goods_details{
  border: 1px solid #ddd;
  padding: 5px;
  border-radius: 5px;
  .amount{
    .amount_title{
      text-align: center;
      margin: 10px 0;
    }
    .amount_info{
      text-align: right;
      margin-bottom: 10px;
    }
    .common_divider{
      margin: 10px;
    }
  }
}
</style>
