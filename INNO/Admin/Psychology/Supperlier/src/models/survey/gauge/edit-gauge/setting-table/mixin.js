export default {
    data() {
        return {
            columns: {
                total:[{
                    title: "得分",
                    minWidth: 150,
                    align: "center",
                    slot: "score"
                },{
                    title: "结论",
                    minWidth: 150,
                    align: "center",
                    slot: "conclusion"
                },{
                    title: "描述",
                    minWidth: 150,
                    align: "center",
                    slot: "describe"
                },{
                    title: "是否预警",
                    minWidth: 150,
                    align: "center",
                    slot: "warning"
                },{
                    title: "操作",
                    minWidth: 150,
                    align: "center",
                    slot: "handle"
                },],

                dimension:[{
                    title: "维度",
                    minWidth: 150,
                    align: "center",
                    slot: "dimension"
                },{
                    title: "得分",
                    minWidth: 150,
                    align: "center",
                    slot: "score"
                },{
                    title: "结论",
                    minWidth: 150,
                    align: "center",
                    slot: "conclusion"
                },{
                    title: "描述",
                    minWidth: 150,
                    align: "center",
                    slot: "describe"
                },{
                    title: "结果标红",
                    minWidth: 150,
                    align: "center",
                    slot: "warning"
                },{
                    title: "操作",
                    minWidth: 150,
                    align: "center",
                    slot: "handle"
                },]
            }
        }
    }
}