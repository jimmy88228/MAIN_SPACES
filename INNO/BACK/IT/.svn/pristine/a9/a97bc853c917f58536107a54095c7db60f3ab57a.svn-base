import EasyHttp from "@y-bao/easy-http";
import axios from "axios";
import LM from "./login-manager";
import Conf from "@/config";
import Apis, { WebApiList } from "./http-api";

const Handlers = {
    get(o) {
        return axios.get(o.url, {
            headers: o.header
        });
    },

    post(o) {
        return axios.post(o.url, o.data, {
            headers: o.header
        });
    }
};

EasyHttp.use({
    install(host) {
        host.bindHandler(o => {
            let act = (o.action || "").toLowerCase();
            if (Handlers[act]) {
                return Handlers[act](o);
            }
            throw `EasyHttpAxios:not found action '${act}'`;
        });
    }
});

EasyHttp.bindPreHandler(rq => {
    if (LM.loginToken) {
        rq.header || (rq.header = {});
        rq.header.LoginToken = LM.loginToken;
    }
    console.log("EasyHttp-Request:", `[${rq.action}] ${rq.url}`, "\nparams:", rq.params, "\ndata:", rq.data);
}).bindPostHandler(promise => {
    return promise
        .then(e => {
            let rq = e.request;
            let rp = e.response;
            console.log("EasyHttp-Response:", `[${rq.action}] ${rq.url}`, "\nresponse:", rp.data);
            if (rp.data.code === "10000") {
                $Bus.$Message.info("会话过期，请重新登陆");
                LM.logout().then(() => $Bus.$router.push({ name: "Login" }));
            }
            return rp.data;
        })
        .catch(e => {
            let rq = e.request;
            if (e.errType === -1) {
                console.log("EasyHttp-Response:", `[${rq.action}] ${rq.url}`, "\n内部错误:", e.msg);
                return Promise.reject(e.msg);
            } else if (e.respons) {
                let rp = e.response;
                console.log("EasyHttp-Response:", `[${rq.action}] ${rq.url}`, "\nresponse:", rp.message);
                return Promise.reject(rp.message);
            }
            return Promise.reject(e);
        });
});

export const MainApi = new EasyHttp().setBaseUrl(Conf.API_DOMIN).addRequests(Apis);

export const WebApi = new EasyHttp().setBaseUrl(Conf.WEB_DOMIN).addRequests(WebApiList);
