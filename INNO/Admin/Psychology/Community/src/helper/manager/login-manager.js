import accountLoginM from "./account-login-manager.js";
import tokenLoginM from "./token-login-manager.js";
const LoginManager = new Proxy({}, {
    get:function(target, key){
        let value = "";
        if(key == "setAccessToken"){
            value = tokenLoginM[key];
        } else if(tokenLoginM.accessToken){
            value = tokenLoginM[key];
        } else{
            value = accountLoginM[key];
        }
        return value;
    },
    set:function(target, key, value){
        if(key == "accessToken" && value){
            return tokenLoginM[key] = value;
        } else if(tokenLoginM.accessToken){
            return tokenLoginM[key] = value;
        } else {
            return accountLoginM[key] = value;
        }
    },
});
export default LoginManager;