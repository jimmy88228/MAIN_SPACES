export default {
    data() {
      return {
        columns: [
            {
                title: '品牌中文',
                minWidth:100,
                key: "brand_name_cn",
                align: 'center'
            },
            {
                title: "品牌英文",
                minWidth:110,
                key: "brand_name_en",
                align: "center"
            },
            {
                title: "到期时间",
                minWidth:350,
                key: "expire_times",
                align: "center",
                slot: 'expireTimes',
            },
            {
                title: "公司中文",
                minWidth:100,
                key: "company_name_cn",
                align: "center"
            },
            {
                title: "公司英文",
                minWidth:110,
                key: "company_name_en",
                align: "center"
            },
            {
                title: "公司电话",
                minWidth:100,
                key: "company_phone",
                align: "center"
            },
            {
                title: "联系人",
                minWidth:110,
                key: "contact_name",
                align: "center"
            },
            {
                title: "联系电话",
                minWidth:100,
                key: "contact_mobile",
                align: "center"
            },
            {
                title: "跟进人",
                minWidth:100,
                key: "follow_user",
                align: "center"
            },
            {
                title: "创建时间",
                minWidth:100,
                key: "create_time",
                align: "center",
                slot: 'createTime'
            },
            /*{
                title: "db_host",
                minWidth:100,
                key: "db_key",
                align: "center"
            },*/
            /*{
                title: "操作",
                minWidth:100,
                slot: "action",
                fixed: "right",
                align: "center"
            }*/
        ]
      }
    }
  }
  