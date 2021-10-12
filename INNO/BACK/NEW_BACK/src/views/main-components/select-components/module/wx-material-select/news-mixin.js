export default{
	data(){
		return {
			newsColumns: [
				{
					type: "selection",
					width: 60,
					align: 'center'
				},
				{
					title: "图文信息",
					key: 'content',
					align: 'left',
					render(h, params) {
						let content = params.row.content;
						let news_item = content.news_item[0] || {};
					  return h('div', {
								style: {
									'padding': '10px 0px'
								}
							}, [
								h('p', {
									style: {
										'font-size': '14px',
										'color': '#333',
										'font-weight': 'bold'
									}
								}, news_item.title),
								h('span',{
									style: {
										'font-size': '12px',
										'color': '#7f7f7f'
									}
								}, news_item.digest)
							]
						)
					}
				},
				{
					title: "创建时间",
					key: 'update_time',
					align: 'center',
					render(h, params) {
						let content = params.row.content || {};
						let create_time = content.create_time;
						let _time = new Date(parseInt(create_time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
					  return h('div', _time)
					}
				}
			]
		}
	}
}