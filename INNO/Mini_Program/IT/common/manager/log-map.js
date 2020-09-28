export const PageKeys = {
    INDEX: "INDEX",
    MESSAGE: "MESSAGE",
    DETAIL: "DETAIL",
    MINE: "MINE",
    RECORD: "RECORD",
    WEB: "WEB",
    WINPRIZE: "WINPRIZE"
};

export const LogMap = {
    ["pages/index/index"]: PageKeys.INDEX,
    ["pages/message/message"]: PageKeys.MESSAGE,
    ["pages/detail/detail"]: PageKeys.DETAIL,
    ["pages/mine/mine"]: PageKeys.MINE,
    ["pages/record/record"]: PageKeys.RECORD,
    ["pages/web/web"]: PageKeys.WEB,
    ["pages/winprize/winprize"]: PageKeys.WINPRIZE
};

export const KeyParamName = {
    ["pages/detail/detail"]: ["activityId", "fromUserId"],
    ["pages/web/web"]: ["id", "name", "url"],
    ["page/winprize/winprize"]: ["rewardId"]
};