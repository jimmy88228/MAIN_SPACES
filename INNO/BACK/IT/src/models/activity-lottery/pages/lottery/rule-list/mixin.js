export default {
    data() {
        return {
            columns: [
                {
                    title: "奖项名称",
                    align: "center",
                    key: "ruleName"
                },
                {
                    title: "开奖类型",
                    align: "center",
                    key: "ruleType",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.ruleType(p));
                    }
                },
                {
                    title: "开奖规则",
                    align: "center",
                    key: "prizeRule",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.prizeRule(p));
                    }
                },
                {
                    title: "开奖人数",
                    align: "center",
                    key: "lotteryCount"
                },
                {
                    title: "操作",
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
