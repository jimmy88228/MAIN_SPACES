export default {
    data() {
        return {
            columns: [
                {
                    title: "头像",
                    
                    width: 160,
                    key: "avatarUrl",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.img(p));
                    }
                },
                {
                    title: "姓名",
                    
                    minWidth: 150,
                    key: "userName"
                },
                {
                    title: "性别",
                    
                    minWidth: 150,
                    key: "gender",
                    sortable: "custom",
                    render: (h, p) => {
                        return h("div", this.$refs.table.$scopedSlots.gender(p));
                    }
                },
                {
                    title: "手机号",
                    
                    key: "mobilePhone",
                    minWidth: 150
                },
                {
                    title: "注册时间",
                    
                    key: "createTime",
                    minWidth: 150,
                    sortable: "custom"
                },
                // {
                //     title: "最后登陆时间",
                //     
                //     key: "lastLoginTime",
                //     minWidth: 150,
                //     sortable: "custom"
                // },
                {
                    title: "操作",
                    
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
