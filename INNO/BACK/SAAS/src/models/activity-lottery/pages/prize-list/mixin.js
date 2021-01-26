export default {
    data() {
        return {
            columns: [
                {
                    title: "奖项",
                    align: "center",
                    key: "level",
                    minWidth: 50
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
