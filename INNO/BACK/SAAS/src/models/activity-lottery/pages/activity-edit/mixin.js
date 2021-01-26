export default {
    data() {
        return {
            columns: [
                {
                    title: "价格",
                    align: "center",
                    key: "prizeAction",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.prizeAction(p));
                    }
                },
                {
                    title: "展示状态",
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
