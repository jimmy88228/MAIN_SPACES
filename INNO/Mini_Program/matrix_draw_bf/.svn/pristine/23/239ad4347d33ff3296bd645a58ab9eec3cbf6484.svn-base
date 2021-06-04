let MyProxy;
try {
    if (Proxy) {
        //不知道为什么部分手机用不了
        let test = new Proxy({}, { get() { } });
        MyProxy = Proxy;
    }
} catch (ex) { }
if (!MyProxy) {
    MyProxy = class {
        constructor(target, handler) {
            for (let name in target) {
                this[name] = Object.defineProperty(this, name, {
                    get() {
                        return handler && handler.get && handler.get(target, name);
                    },
                    set(v) {
                        handler && handler.set && handler.set(target, name, v);
                    }
                });
            }
        }
    };
}
export default MyProxy;