export default {
  data () {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "ID",
          key: "id",
          align: 'center'
        },
        {
          title: "RFM名称",
          key: "name",
          align: 'center',
					render(h, params) {
						let row = params.row || {};
						let text = '';
						 switch(row.type){
							 case 'R':
								text = '最近消费时间(R)'
								break;
							case 'F':
								text = '	消费频次(F)'
								break;
							case 'M':
								text = '消费金额(M)'
								break;
						 }
						 text = text + ' ' + row.name;
					  return h('div', {}, text)
					}
        }
      ]
    }
  }
}
