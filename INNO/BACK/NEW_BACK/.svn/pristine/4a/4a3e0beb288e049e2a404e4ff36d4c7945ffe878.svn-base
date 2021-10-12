export default {
  data () {
		let that = this;
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "优惠券名称",
          key: "name",
					minWidth: 120,
					render (h, { row }) {
						let text = row.type_code ? row.name + '(' + row.type_code + ')' : row.name;
					  return (
					    <div>{{text}}</div>
					  )
					}
        },
				{
				  title: "优惠券类型",
				  key: "bonus_type",
					minWidth: 120,
				},
        {
          title: '发放类型',
          key: 'send_type',
          align: 'left',
					minWidth: 120,
        },
				{
				  title: '面额',
				  key: 'type_money',
				  align: 'left',
					minWidth: 60,
				},
				{
				  title: '库存',
				  key: 'inventory',
				  align: 'right',
					minWidth: 60,
					render (h, { row }) {
						let _index = row._index;
						// send_type_id 3：扫码优惠券， 4：ERP 优惠券， 5：通用券， else 微商城优惠券
						let isShopCoupon = (row.send_type_id != 3 && row.send_type_id != 4 && row.send_type_id != 5) ? true : false;
						// 到期，回收站，，数量（非商城券）
						let inventoryVal = parseInt(row.create_number) - parseInt(row.send_count);
						if(!(inventoryVal > 0)){
							if(!isShopCoupon){
								that.$set(that.$refs["listComponent"].tableData[_index], '_disabled', true);
							}
							inventoryVal = '--'
						}
					  return (
					    <div>{inventoryVal}</div>
					  )
					}
				}
      ]
    }
  }
}
