// //用户接口
// export const UserApis = {
//     //分页获取用户的消息
//     getMsgPage: "/User/GetMsgPage?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}",
// };

// //自定义布局
// export const LayoutApis = {
//     getLayout: "/Layout/GetLayout?layoutId={layoutId}",
//     getLayoutByToken: "/Layout/GetLayoutByToken?token={token}&brandCode={brandCode}",
// };

// //抽取报名
// export const DrawApis = {
//     //获取活动首页数据
//     getHomeActivitys: "/Draw/GetHomeActivitys?brandCode={brandCode}&userToken={userToken}",
//     //获取往期活动列表
//     getPastActivityMonthPage: "/Draw/GetPastActivityMonthPage?brandCode={brandCode}&pageIndex={pageIndex}&pageSize={pageSize}",
//     //获取活动信息
//     getActivityInfo: "/Draw/GetActivityInfo?userToken={userToken}&activityId={activityId}",
//     //获取报名状态
//     getEnrollState: "/Draw/GetEnrollState?userToken={userToken}&activityId={activityId}",
//     //获取报名选项（不包括后填的问题）
//     getEnrollOption: "/Draw/GetEnrollOption?userToken={userToken}&activityId={activityId}",
//     //提交活动问题的答案
//     createEnroll: {
//         u: "/Draw/CreateEnroll?userToken={userToken}",
//         m: "post"
//     },
//     //获取活动报名信息
//     getEnrollInfo: "/Draw/GetEnrollInfo?userToken={userToken}&enrollId={enrollId}",
//     //好友助力
//     createHelp: {
//         u: "/Draw/CreateHelp?userToken={userToken}",
//         m: "post"
//     },
//     //第二次获取抽奖码（不用再次提交资料）
//     createEnrollCode: {
//         u: "/Draw/CreateEnrollCode?userToken={userToken}",
//         m: "post"
//     },
//     //分页获取用户的抽奖码
//     getEnrollCodePage: "/Draw/GetEnrollCodePage?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}",
//     //获取用户奖品列表
//     getLotteryRecordPage: "/Draw/GetLotteryRecordPage?userToken={userToken}&pageIndex={pageIndex}&pageSize={pageSize}",
//     //获取用户该活动中奖记录
//     getLotteryRecord: "/Draw/GetLotteryRecord?userToken={userToken}&enrollId={enrollId}",
//     //中奖详情页
//     getLotteryInfo: "/Draw/GetLotteryInfo?userToken={userToken}&lotteryRecordId={lotteryRecordId}",
//     //获取用户抽签活动参加条件
//     getConditionStatus: "/Draw/GetConditionStatus?userToken={userToken}&activityId={activityId}"
// };

// //天选之子
// export const SpecialApis = {
//     getActivityInfo: "/Special/GetActivityInfo?userToken={userToken}&activityId={activityId}",
// };

// //订阅接口
// export const SubApis = {
//     getSubMsgTpls: "/WxSub/GetSubMsgTpls?brandCode={brandCode}&type={type}",
//     setSub: {
//         u: "/WxSub/SetSub?userToken={userToken}",
//         m: "post"
//     },
//     isSub: "/WxSub/IsSub?userToken={userToken}&type={type}&keyId={keyId}"
// };

// //网页伪静态资源
// export const WebApis = {
//     //文章页
//     redirectArt: "/Api/Redirect/Art",
//     //活动详情信息
//     getActDetails: "/Api/Redirect/DrawActDetails?activityId={activityId}",
//     //奖品使用详情信息
//     getLotteryUsegeDetails: "/Api/Redirect/LotteryDetails?ruleId={ruleId}",
//     //专场活动详情信息
//     getSpecialActivityDetails: "/Api/Redirect/SpecialActDetails?activityId={activityId}"
// };

// //日志收集
// export const LogApis = {
//     addPageLog: {
//         u: "/Log/AddPageLogList",
//         m: "post"
//     },
//     addActionLog: {
//         u: "/Log/AddActionLogList",
//         m: "post"
//     },
//     createSession: {
//         u: "/Log/CreateSession",
//         m: "post"
//     }
// };

 

//注册/登录
export const RegApis = {
    userLogin: {
        u: "/api/Wechat/Login",
        m: "post"
    },
    register: {
        u: "/api/Wechat/Register",
        m: "post"
    },
    registerByUserProfile: {
        u: "/api/Wechat/RegisterByUserProfile",
        m: "post"
    },
    createSession: {
        u: "/api/Wechat/CreateSession",
        m: "post"
    },
    checkSession: "/api/Wechat/CheckSession", 
    bindWxPhone: {
        u: "/api/Wechat/BindWxPhone",
        m: "post"
    }, 
}

//商品
export const GoodsApis = {
    getCustomPagesInfo: "/api/Page/GetCustomPageInfo?param={param}&pageType={pageType}",
    getCustomPageDataScript: "/api/Page/GetCustomPageScript?pageId={pageId}",
}

//抽奖
export const LotteryApis = {
    get_LotteryActivitDetail:"/api/Lottery/Get_LotteryActivitDetail",
    create_Lottery:{
        u:"/api/Lottery/Create_Lottery",
        m:"post"
    },
    get_UserLotteryActivityWinningRecord:"/api/Lottery/Get_UserLotteryActivityWinningRecord",
    get_LotteryActivityWinningRecord:"/api/Lottery/Get_LotteryActivityWinningRecord",
    geceivePrizeCheckout:{
        u:"/api/Lottery/ReceivePrizeCheckout",
        m:"post"
    },
    receivePrize:{
        u:"/api/Lottery/ReceivePrize",
        m:"post"
    },
    getOrderDetail:"/api/Order/GetOrderDetail",
    createLotteryShareLaunch:{
        u:"/api/LotteryShare/CreateLotteryShareLaunch",
        m:"post"
    },
    createLotteryShareHelp:{
        u:"/api/LotteryShare/CreateLotteryShareHelp",
        m:"post"
    }, 
}

export const UserApis = {
    get_UserAddressList:"/api/UserAddress/Get_UserAddressList",
    getRegionList:"/api/UserAddress/GetRegionList", 
    createUserAddress:{
        u:"/api/UserAddress/CreateUserAddress",
        m:"post"
    },
    deleteUserAddress:{
        u:"//api/UserAddress/DeleteUserAddress",
        m:"post"
    },
    updateUserAddress:{
        u:"/api/UserAddress/UpdateUserAddress",
        m:"post"
    },
    updateUserAddressDefault:{
        u:"/api/UserAddress/UpdateUserAddressDefault",
        m:"post"
    },
    bindWxAddress:{
        u:"/api/UserAddress/BindWxAddress",
        m:"post"
    },
    getUserBonusList:"/api/User/GetUserBonusList",
    getUserPointLogList:"/api/User/GetUserPointLogList",

}