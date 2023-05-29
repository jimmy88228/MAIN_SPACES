/**
 * 该组件主要为了解决"在小程序环境下, css的层级问题不好处理"的问题
 * 将该组件放在页面的最外层，借此组件来拿到一些弹窗组件的实例
 * 建议只放主要作展示用或逻辑不会太复杂的组件，不要加入涉及太多业务的组件
 */
const app = getApp();
Component(app.BTAB({
  properties: {
    componentsCollection: { // 该容器需要存在的组件集合 例如: {agreementPop: {}}
      type: Object,
      value: {},
      observer(collection){
        if (typeof collection === "object"){
          let __setData = {};
          for (let componentName of Object.keys(collection)){
            __setData[componentName] = collection[componentName];
          }
          this.setData(__setData);
        }
      }
    }
  }, 
  data: {},
  methods: {
    getCompnentAsync(componentName){ // 拿到该容器里的某个组件,并返回(异步)
      return new Promise((resolve, reject) => {
        if (!componentName) reject("componentName为空");
        try {
          this[componentName] = this[componentName] || this.selectComponent("#" + componentName);
          if (this[componentName]) resolve(this[componentName])
          reject("没有找到该组件")
        } catch (err) {reject(err)}
      })
    },
    getCompnent(componentName){ // 拿到该容器里的某个组件,并返回
      if (!componentName) return "componentName为空";
      try {
        this[componentName] = this[componentName] || this.selectComponent("#" + componentName);
        if (this[componentName]) return this[componentName]
        console.log("getComponent -> 没有找到该组件")
        return "没有找到该组件"
      } catch (err) {
        console.log("getComponent报错", err);
        return "getComponent报错"
      }
    }
  }
}))