export default {
  data () {
    const Input = 'Input';
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "商品主图",
          key: "goods_thumb2",
          width: 100,
          render (h, { row }) {
            return (
              <div style="display: flex;align-items: center;margin: 10px 0;">
                <div class = "img_wrapper" style = "width: 50px;height: 50px;border: 1px solid #efefef;overflow: hidden;flex-shrink: 0;margin-right:4px;">
                  <img src={row.goods_thumb2 ? row.goods_thumb2 : require('@rs/images/default-img.jpg')} style="width: 50px;height: 50px;object-fit: contain;"/>
                </div>
              </div>
            )
          }
        },
        {
          title: "商品货号",
          key: "goods_sn",
          width:150,
        },
        {
          title: "商品名称",
          key: "goods_name",
          width:150,
          render:(h, params )=>{
            var that = this;

            return h('div',[
              h('Input',{
                props:{
                  value:params.row.goods_name,
                  disabled:params.row.mg_count>0?true:false
                },
                domprops:{
                  value:params.row.goods_name,
                  disabled:params.row.mg_count>0?true:false
                },
                on:{
                  'on-change':(event)=>{
                    that.$set(this.$refs['modalTemplate'].tableData[params.index], 'goods_name', event.target.value) 
										that.$set(this.$refs['modalTemplate'].tableData[params.index], 'name', event.target.value) 
                  }
                },
                style:{
                  display: 'flex',
                  alignItems:'left',
                  margin:'10px 0px',
                }
              })
            ])

          }
          // render (h, { row }) {
          //   return (
          //     <div style="display: flex;align-items:left;margin: 10px 0;">
          //       <Input v-model={row.goods_name} disabled={row.mg_count>0?true:false} onchange="changeName()"></Input>
          //     </div>
          //   )
          // }
        },
        {
          title: "吊牌价",
          key: "market_price"
        },
        {
          title: "售卖价",
          key: "price",
          render:(h, params )=>{
            var that = this;

            return h('div',[
              h('Input',{
                props:{
                  value:params.row.price,
                  disabled:params.row.mg_count>0?true:false
                },
                domprops:{
                  value:params.row.price,
                  disabled:params.row.mg_count>0?true:false
                },
                on:{
                  'on-change':(event)=>{
                    that.$set(this.$refs['modalTemplate'].tableData[params.index], 'price', event.target.value) 
                  }
                },
                style:{
                  display: 'flex',
                  alignItems:'left',
                  margin:'10px 0px',
                }
              })
            ])

          }
          // render (h, { row }) {
          //   return (
          //     <div style="display: flex;align-items:left;margin: 10px 0;">
          //       <Input v-model={row.price} disabled={row.mg_count>0?true:false} ></Input>
          //     </div>
          //   )
          // }
        },
      ]
    }
  }
}
