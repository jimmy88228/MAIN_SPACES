export default {
  data () {
		let that = this;
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "红包名称",
          key: "act_name",
          minWidth: 120,
        },
        {
          title: "初始面额",
          key: "amount"
        },
        {
          title: "剩余库存",
          key: "is_on_sale",
          align: "center",
          render (h, { row }) {
            let val = parseFloat(row.create_number) - parseFloat(row.send_number);
						let index = row._index;
						if(!(val > 0)){
							that.$set(that.$refs['listComponent'].tableData[index], '_disabled', true);
							val = '0'
						}
            return (
              <div>{val}</div>
            )
          }
        }
      ]
    }
  }
}
