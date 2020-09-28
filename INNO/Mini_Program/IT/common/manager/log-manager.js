import Conf from "../../conf";
import Util from "../utils/util";
import MyStr from "../support/utils/string-util";
import LM from "./login-manager";
import { LogApi } from "./http-manager";
import { PageKeys, LogMap, KeyParamName } from "./log-map";
import SIH from "../helper/sys-infos-helper";

const LOG_TAG = "log-manager";

function hasP(p) {
    if (!p) {
        return false;
    }
    for (let key in p) {
        return true;
    }
    return false;
}

function getPageKeyParams(path, params) {
    let keyParams = {};
    let keyNames = KeyParamName[path];
    if (keyNames && keyNames.length > 0) {
        let keyMapCount = Math.min(keyNames.length, 3);
        for (let i = 0; i < keyMapCount; i++) {
            let keyName = keyNames[i];
            if (keyName in params) {
                keyParams["keyParam" + (i + 1)] = params[keyName];
            }
        }
    }
    return keyParams;
}
function getActionKeyParams(params) {
    let keyParams = {};
    for (let i = 0; i < 3; i++) {
        let keyName = "keyParam" + (i + 1);
        if (keyName in params) {
            keyParams[keyName] = params[keyName];
        }
    }
    return keyParams;
}

function createVisitLog(name, path, params, lastLog, channel) {
    let keyParams;
    let paramsJson;
    if (hasP(params)) {
        keyParams = getPageKeyParams(path, params);
        try {
            paramsJson = JSON.stringify(params);
        } catch (e) { }
    }
    let createTime = new Date().getTime();
    let lastLogId;
    let lastLogTimeStamp;
    if (lastLog) {
        lastLogId = lastLog.logId;
        lastLogTimeStamp = lastLog.createTime ? createTime - lastLog.createTime : 0;
    }
    return {
        ...(keyParams || {}),
        logId: Util.uuid16ByTime(32),
        clientSessionId: channel.clientSessionId,
        name: name || LogMap[path] || "",
        path: path || "",
        paramsJson: paramsJson,
        lastLogId: lastLogId,
        lastLogTimeStamp: lastLogTimeStamp,
        createTime: createTime
    };
}

function createActionLog(name, position, params, visitLog, channel) {
    let keyParams;
    let paramsJson;
    if (hasP(params)) {
        keyParams = getActionKeyParams(params);
        try {
            paramsJson = JSON.stringify(params);
        } catch (e) { }
    }
    return {
        ...(keyParams || {}),
        clientSessionId: channel.clientSessionId,
        visitLogId: visitLog && visitLog.logId,
        name: name || "",
        paramsJson: paramsJson,
        position: position || "",
        createTime: new Date().getTime()
    };
}

function createChannel(params, scene, lastChannel) {
    let channelType;
    let channel;
    if (hasP(params)) {
        params = { ...params };
        if ("fromUser" in params) {
            channelType = "INVITE";
            channel = params.fromUser;
        } else if (params.channelType) {
            channelType = params.channelType;
            channel = params.channel;
        }
        channelType = MyStr.trim(channelType);
    }
    if (!channelType && lastChannel) {
        return null;
    } else {
        return {
            clientSessionId: Util.uuid16ByTime(32),
            channelType: channelType,
            channel: channel,
            scene: scene,
            model: SIH.model,
            os: SIH.os,
            appVersion: SIH.appVersion,
            sdkVersion: SIH.sdkVersion,
            createTime: new Date().getTime()
        };
    }
}

class LogManager {
    static getInstance() {
        if (!LogManager.instance) {
            LogManager.instance = new LogManager();
        }
        return LogManager.instance;
    }
    setChannel(params, scene) {
        let newChannel = createChannel(params, scene, this.channel);
        if (newChannel) {
            this._channel = newChannel;
            this.isNewChannel = true;
        }
    }
    get channel() {
        return this._channel;
    }
    init() {
        this.inited = true;
        return this;
    }
    createSession() {
        if (this.inited && this.channel && this.isNewChannel) {
            this.isNewChannel = false;
            console.debug(LOG_TAG, "Session:", this.channel);
            LogApi.createSession({
                data: {
                    ...this.channel,
                    token: LM.token,
                    cookieId: SIH.cookieId,
                    brandCode: Conf.BRAND_CODE
                }
            });
        }
    }
    setHideTag() {
        this.addVisitLog("APP_HIDE");
        return this;
    }
    submit() {
        this.submitVisit();
        this.submitAction();
    }
    submitVisit() {
        this.visitlogTid && clearTimeout(this.visitlogTid) && (delete this.visitlogTid);
        if (this.inited && this.visitlogs && this.visitlogs.length > 0) {
            let visitlogs = this.visitlogs;
            delete this.visitlogs;
            LogApi.addPageLog({
                data: {
                    token: LM.token,
                    cookieId: SIH.cookieId,
                    brandCode: Conf.BRAND_CODE,
                    logs: visitlogs
                }
            });
        }
    }
    submitAction() {
        this.actionLogTid && clearTimeout(this.actionLogTid) && (delete this.actionLogTid);
        if (this.inited && this.actionLogs && this.actionLogs.length > 0) {
            let actionLogs = this.actionLogs;
            delete this.actionLogs;
            LogApi.addActionLog({
                data: {
                    token: LM.token,
                    cookieId: SIH.cookieId,
                    brandCode: Conf.BRAND_CODE,
                    logs: actionLogs
                }
            });
        }
    }
    addVisitLog(name, path, params) {
        if ((!name && !path) || !this.channel) {
            return;
        }
        this.visitLog = createVisitLog(name, path, params, this.visitLog, this.channel);
        console.debug(LOG_TAG, "VisitLog:", this.visitLog);
        this.visitlogs || (this.visitlogs = []);
        this.visitlogs.push(this.visitLog);
        if (this.visitlogs.length >= 20) {
            this.submitVisit();
        } else if (!this.visitlogTid) {
            this.visitlogTid = setTimeout(() => this.submitVisit(), 30000);
        }
    }
    addActionLog(name, position, params) {
        if (!name || !this.channel) {
            return;
        }
        let actionLog = createActionLog(name, position, params, this.visitLog, this.channel);
        console.debug(LOG_TAG, "ActionLog:", actionLog);
        this.actionLogs || (this.actionLogs = []);
        this.actionLogs.push(actionLog);
        if (this.actionLogs.length >= 20) {
            this.submitAction();
        } else if (!this.actionLogTid) {
            this.actionLogTid = setTimeout(() => this.submitAction(), 30000);
        }
    }
}

export default LogManager.getInstance();
export { PageKeys, LogMap, KeyParamName };
