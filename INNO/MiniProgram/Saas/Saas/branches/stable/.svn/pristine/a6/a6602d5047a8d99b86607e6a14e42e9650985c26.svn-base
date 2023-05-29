// import Promise from "../libs/promise/promise";
import MyProxy from "../support/tools/proxy";

let nullFn = () => {};
function IllegalAPIException(name) {
    this.message = "No Such API [" + name + "]";
    this.name = "IllegalAPIException";
}
const WxApi = new MyProxy(wx, {
    get: function(target, property) {
        if (property in wx) {
            return obj => {
                return new Promise(function(resolve, reject) {
                    obj = obj || {};
                    obj.success = (...args) => {
                        resolve(...args);
                    };
                    obj.fail = (...args) => {
                        reject(...args);
                    };
                    obj.complete = nullFn;
                    wx[property](obj);
                });
            };
        } else {
            throw new IllegalAPIException(property);
        }
    }
});
export default WxApi;
