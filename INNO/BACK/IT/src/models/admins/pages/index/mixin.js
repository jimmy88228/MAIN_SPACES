export default {
    data() {
        return {
            columns: [
                {
                    title: "账号",
                    key: "account",
                    minWidth: 150
                },
                {
                    title: "账号名",
                    key: "userName",
                    minWidth: 150
                },
                {
                    title: "账号类型",
                    key: "adminType",
                    minWidth: 150,
                    sortable: "custom",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.adminType(p));
                    }
                },
                {
                    title: "修改时间",
                    key: "updateTime",
                    sortable: "custom",
                    minWidth: 150
                },
                {
                    title: "开关",
                    align: "center",
                    key: "enable",
                    width: 120,
                    fixed: "right",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.enable(p));
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    align: "center",
                    width: 280,
                    fixed: "right",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.action(p));
                    }
                }
            ]
        };
    }
};
