export default {
    data() {
        return {
            columns: [
                {
                    title: "活动详情",
                    align: "left",
                    key: "detail",
                    minWidth: 300,
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.detail(p));
                    }
                },
                {
                    title: "活动状态",
                    align: "center",
                    key: "state",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.state(p));
                    }
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
