export default {
    data() {
        return {
            columns: [
                {
                    title: "活动详情",
                    align: "center",
                    key: "detail",
                    minWidth: 300,
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.detail(p));
                    }
                },
                {
                    title: "报名人数",
                    align: "center",
                    key: "enrollCount"
                },
                {
                    title: "展示状态",
                    align: "center",
                    key: "enable",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.enable(p));
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
                    title: "开奖状态",
                    align: "center",
                    key: "announceTime",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.announceTime(p));
                    }
                },
                {
                    title: "推送状态",
                    align: "center",
                    key: "pushState",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.pushState(p));
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
