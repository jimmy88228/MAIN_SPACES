export default {
    data() {
        return {
            columns: [
                {
                    title: "自定义布局名",
                    align: "center",
                    key: "name"
                },
                {
                    title: "索引名",
                    align: "center",
                    key: "indexName"
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
