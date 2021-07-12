export default {
  data () {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "优惠券名称",
          key: "name"
        },
        {
          title: '优惠券编码',
          key: 'type_code',
          align: 'left'
        },
				{
				  title: '库存',
				  key: 'inventory',
				  align: 'left',
					render (h, { row }) {
						let inventoryVal = parseInt(row.create_number) - parseInt(row.send_count);
						inventoryVal = inventoryVal > 0 ? inventoryVal : 0;
						if(inventoryVal == 0){ row._disabled = true }
					  return (
					    <div>{inventoryVal}</div>
					  )
					}
				}
      ]
    }
  }
}
