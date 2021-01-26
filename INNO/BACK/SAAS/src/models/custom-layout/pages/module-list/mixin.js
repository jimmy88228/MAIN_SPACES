export default {
    data() {
        return {
            columns: [
                {
                    title: "模块名",
                    align: "center",
                    key: "name"
                },
                {
                    title: "排序",
                    align: "center",
                    key: "sort"
                },
                {
                    title: "是否启用",
                    align: "center",
                    key: "enable",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.enable(p));
                    }
                },
                {
                    title: "是否测试",
                    align: "center",
                    key: "isTest",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.test(p));
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
