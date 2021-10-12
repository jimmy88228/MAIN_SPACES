export default {
  data () {
    return {
      tableColumns: [
        {
          title: '通知名称',
          key: 'name'
        },
        {
          title: '创建时间',
          key: 'created_at',
					render:(h, params)=>{
						let created_at = params.row.created_at || "";
						let dateArr = created_at.split(" ");
						let hModule = []
						for(let i = 0; i < dateArr.length; i++){
							hModule.push(
								h('p', {}, dateArr[i]),
							)
						}
						return h('div', hModule);
					}
        },
        {
          title: '自动执行时间',
          key: 'exec_time',
					render:(h, params)=>{
						let exec_time = params.row.exec_time || "";
						let dateArr = exec_time.split(" ");
						let hModule = []
						for(let i = 0; i < dateArr.length; i++){
							hModule.push(
								h('p', {}, dateArr[i]),
							)
						}
						return h('div', hModule);
					}
        },
        {
          title: '推送模板',
          key: 'tpl_type_str'
        },
        {
          title: '推送类型',
          key: 'tpl_group_title'
        },
				{
				  title: '可推人数/已推人数',
					width: 160,
					align: 'center',
				  slot: 'count',
				},
				{
				  title: '状态',
				  key: 'status_str'
				},
				{
				  title: '操作',
				  key: 'handle',
					align: 'center',
				  slot: 'handle'
				}
      ]
    }
  }
}
