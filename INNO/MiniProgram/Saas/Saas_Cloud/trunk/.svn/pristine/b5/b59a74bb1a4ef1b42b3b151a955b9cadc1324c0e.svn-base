import MyProxy from "./proxy";
let nullFn = () => { };
const Wxp = new MyProxy(wx, {
    get(target, property) {
        if (property in wx) {
            return obj => {
                return new Promise(function (resolve, reject) {
                    obj = obj || {};
                    obj.success = (...args) => {
                        resolve(...args);
                    };
                    obj.fail = (...args) => {
                        reject(...args);
                    };
                    obj.complete = nullFn;
                    target[property](obj);
                });
            };
        } else {
            throw `No Such API [${name}]`;
        }
    }
});
export default Wxp;
