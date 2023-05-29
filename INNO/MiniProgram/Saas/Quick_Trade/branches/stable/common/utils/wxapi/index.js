import MyProxy from "../../support/proxy/index"; 
function nullFn(){};
function IllegalAPIException(name) {
    this.message = "No Such API [" + name + "]";
    this.name = "IllegalAPIException";
}
const WxApi = new MyProxy(wx, {
    get(wxRef, property) {
        if (property in wxRef) {
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
                    wxRef[property](obj);
                });
            };
        } else {
            throw new IllegalAPIException(property);
        }
    }
});
export default WxApi;
