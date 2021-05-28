let MyProxy;
try {
    let test = new Proxy({}, { get: function (e, f) { } });
    MyProxy = Proxy;
} catch (ex) {
    MyProxy = class {
        constructor(target, handler) {
            for (let name in target) {
                this[name] = Object.defineProperty(this, name, {
                    get: function () {
                        return handler && handler.get && handler.get(target, name);
                    },
                    set: function (v) {
                        handler && handler.set && handler.set(target, name, v);
                    }
                });
            }
        }
    };
}
export default MyProxy;