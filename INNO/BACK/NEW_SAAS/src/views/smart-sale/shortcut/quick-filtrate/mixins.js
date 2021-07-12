export default {
    data(){
        return {
            columns: [
                {
                    title: '会员名称',
                    slot: "real_name",
                    minWidth: 150,
                    align: 'left'
                },
                {
                    title: "会员卡号",
                    minWidth: 100,
                    key: "card_num",
                    align: "left"
                },
                {
                    title: "会员等级",
                    minWidth: 100,
                    key: "rank_name",
                    align: "left"
                },
                {
                    title: "手机号",
                    minWidth: 100,
                    key: "mobile_phone",
                    align: "left"
                },
                {
                    title: "注册时间",
                    minWidth: 110,
                    key: "con_lastday",
                    align: "left"
                },
                {
                    title: "生日",
                    minWidth: 130,
                    key: "birthday",
                    align: "left"
                },
                {
                    title: "最后购买时间",
                    minWidth: 130,
                    key: "con_lastday",
                    align: "left"
                },
                {
                    title: "购买总量",
                    minWidth: 130,
                    key: "con_sum",
                    align: "left"
                },
                {
                    title: "是否关注微信",
                    minWidth: 130,
                    key: "weixin_subscribe",
                    align: "left"
                },
                {
                    title: "操作",
                    minWidth: 100,
                    fixed: "right",
                    slot: "action",
                    align: "center"
                }
            ]
        }
    }
}