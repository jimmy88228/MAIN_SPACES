export default {
    data() {
        return {
            columns: [
                {
                    title: "标题",
                    key: "title",
                    minWidth: 150
                },
                {
                    title: "索引名",
                    key: "name",
                    minWidth: 150
                },
                {
                    title: "编辑者",
                    key: "author",
                    minWidth: 150
                },
                {
                    title: "修改时间",
                    key: "updateTime",
                    minWidth: 150,
                    sortable: "custom"
                },
                {
                    title: "操作",
                    key: "action",
                    align: "center",
                    width: 200,
                    fixed: "right",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.action(p));
                    }
                }
            ]
        };
    }
};
