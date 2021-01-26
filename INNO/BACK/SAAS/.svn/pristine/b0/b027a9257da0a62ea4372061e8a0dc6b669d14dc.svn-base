export default {
    data() {
        return {
            columns: [
                {
                    title: "头像",
                    align: "center",
                    width: 160,
                    key: "avatarUrl",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.img(p));
                    }
                },
                {
                    title: "姓名",
                    align: "center",
                    minWidth: 150,
                    key: "userName"
                },
                {
                    title: "性别",
                    align: "center",
                    minWidth: 150,
                    key: "gender",
                    sortable: "custom",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.gender(p));
                    }
                },
                {
                    title: "手机号",
                    align: "center",
                    key: "mobilePhone",
                    minWidth: 150
                },
                {
                    title: "注册时间",
                    align: "center",
                    key: "createTime",
                    minWidth: 150,
                    sortable: "custom"
                },
                // {
                //     title: "最后登陆时间",
                //     align: "center",
                //     key: "lastLoginTime",
                //     minWidth: 150,
                //     sortable: "custom"
                // },
                {
                    title: "操作",
                    align: "center",
                    key: "action",
                    width: 150,
                    fixed: "right",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.action(p));
                    }
                }
            ]
        };
    }
};
