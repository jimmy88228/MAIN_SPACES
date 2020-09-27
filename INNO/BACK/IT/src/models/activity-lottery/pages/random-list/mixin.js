export default {
    data() {
        return {
            columns: [
                {
                    title: "门店",
                    align: "center",
                    key: "store_name",
                    minWidth: 300
                },
                {
                    title: "报名人数",
                    align: "center",
                    key: "eroll_count"
                },
                {
                    title: "开奖人数",
                    align: "center",
                    key: "lottery_count"
                },
                {
                    title: "设置开奖人数",
                    align: "center",
                    key: "action",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.action(p));
                    }
                }
            ]

        };
    }
};
