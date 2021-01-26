export default {
    data() {
        return {
            columns: [
                {
                    title: "ID",
                    key: "roleId",
                    minWidth: 150
                },
                {
                    title: "角色名称",
                    key: "roleName",
                    minWidth: 150
                },
                {
                    title: "描述",
                    key: "remark",
                    minWidth: 150
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
