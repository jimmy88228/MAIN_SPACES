export default {
    data() {
        return {
            columns: [
                {
                    title: "用户id",
                    align: "center",
                    key: "user_id"
                },
                {
                    title: "报名人信息",
                    align: "center",
                    key: "user_name"
                },
                {
                    title: "手机号",
                    align: "center",
                    key: "mobile_phone"
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
