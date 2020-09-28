export default {
    data() {
        return {
            columns: [
                {
                    title: "用户信息",
                    align: "center",
                    key: "userName",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.userInfo(p));
                    }
                },
                {
                    title: "用户id",
                    align: "center",
                    key: "userId",
                    
                },
                {
                    title: "手机号",
                    align: "center",
                    key: "mobilePhone"
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
