export default {
    data(){
        return {
            columns: [
                {
                    title: '任务名称',
                    key: "fast_name",
                    minWidth: 150,
                    align: 'left'
                },
                {
                    title: "任务类型",
                    minWidth: 100,
                    key: "fast_type_str",
                    align: "left"
                },
                {
                    title: "会员人数",
                    minWidth: 100,
                    key: "sel_mans",
                    align: "left"
                },
                {
                    title: "发送人数",
                    minWidth: 100,
                    key: "exec_men",
                    align: "left"
                },
                {
                    title: "发送情况",
                    minWidth: 110,
                    key: "is_enabled_str",
                    align: "left"
                },
                {
                    title: "创建时间",
                    minWidth: 130,
                    key: "create_time",
                    align: "left"
                },
                {
                    title: "执行时间",
                    minWidth: 130,
                    key: "last_exectime",
                    align: "left"
                },
                {
                    title: "操作",
                    minWidth: 100,
                    fixed: "right",
                    slot: "handle",
                    align: "center"
                }
            ]
        }
    }
}