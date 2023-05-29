export default {
  data () {
    return {
      columns: [
        {
          key: "admin_name",
          title: "用户名",
          width: 100,
          align: "left",
        },
        {
          title: "账号信息",
          minWidth: 180,
          render: (h, { row }) => {
            return h('div', {
              style: {
                padding: "5px 0px"
              }
            },[
                    h('p', {
                        props: {
                            type: 'person'
                        }
                    }, '账号：' + row.admin_account),
                    h('p', {
                        props: {
                            type: 'person'
                        }
                    }, "手机号：" + row.admin_phone),
                    h('p', {
                        props: {
                            type: 'person'
                        }
                    }, "角色：" + row.role_name),
                ]);
            }
        },
        {
          key: "structure_name",
          title: "所属学校",
          minWidth: 120,
        },
        {
          key: "",
          title: "班级",
          minWidth: 120,
        },
        {
          title: "状态",
          width: 100,
          
          render:(h, { row })=>{
            return h('div', [
              h('i-switch', {
                props: {
                  size: "large",
                  value: row.admin_state,
                  "true-value": 1,
                  "false-value": 0
                }
              }, [
                h('span', {
                  slot: "open"
                }, "正常"),
                h('span', {
                  slot: "close"
                }, "关闭")
              ])
            ])
          }
        },
        {
          key: "admin_create_time",
          title: "创建时间",
          width: 110,
          align: "center"
        },
      ]
    }
  }
}
