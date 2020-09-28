export default {
    data() {
        return {
            columns: [
                {
                    title: "",
                    align: "center",
                    key: "select",
                    width: 60,
                    type: "selection",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.select(p));
                    }
                },
                {
                    title: "报名人信息",
                    align: "left",
                    key: "user",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.user(p));
                    } 
                },
                {
                    title: "身份证",
                    align: "center",
                    key: "id_card"
                },
                {
                    title: "抽签码",
                    align: "center",
                    key: "codes"
                },
                {
                    title: "登记店铺",
                    align: "center",
                    key: "buy_store"
                },
                {
                    title: "登记规格",
                    align: "center",
                    key: "specs",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.specs(p));
                    }
                },
                {
                    title: "编辑",
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
