let MyProxy;
try {
  new Proxy({}, {
    get: function () {}
  });
  MyProxy = Proxy;
} catch (err) {
  console.warn("proxy has not supported: ", err);
  MyProxy = class {
    constructor(target, handler) {
      for (let key of Object.keys(target)) {
        let name = target[key];
        this[name] = Object.defineProperty(this, name, {
          get() {
            return handler && typeof handler.get === "function" && handler.get(target, name);
          },
          set(v) {
            handler && typeof handler.set === "function" && handler.set(target, name, v);
          }
        })
      }
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