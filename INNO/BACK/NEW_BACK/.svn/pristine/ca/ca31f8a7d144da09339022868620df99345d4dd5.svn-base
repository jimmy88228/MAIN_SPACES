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
					title: '活动ID',
					key: 'id',
					width: 80
				},
				{
					key: "name",
					title: "活动名称",
					minWidth: 120
				},
				{
				  title: "商品名称",
				  key: "get_goods",
				  minWidth: 120,
				  render (h, { row }) {
				    return (
				      <div style="display: flex;align-items: center;margin: 10px 0;">
				        <div class = "img_wrapper" style = "width: 50px;height: 50px;border: 1px solid #efefef;overflow: hidden;flex-shrink: 0;margin-right:4px;">
				          <img src={row.picture ? row.picture : require('@rs/images/default-img.jpg')} style="width: 50px;height: 50px;object-fit: contain;"/>
				        </div>
				        <div title={row.goods_name}>
				          <p class="clamp2">{row.goods_name}</p>
				          <p>{row.get_goods.goods_sn}</p>
				        </div>
				      </div>
				    )
				  }
				},
				{
					key: "start_time",
					title: "开始时间",
					width: 120
				},
				{
					key: "end_time",
					title: "结束时间",
					width: 120
				},
				{
					align: "center",
					key: "enable",
					title: "状态",
					width: 100,
					render: (h, params) => {
						const row = params.row;
						const color = row.enable == 1 ? 'green' : 'red';
						const text = row.enable == 1 ? '上架' : '下架';
					
						return h('span', {
							style: {
								color: color
							}
						}, text);
					}
				}
      ]
    }
  }
}
