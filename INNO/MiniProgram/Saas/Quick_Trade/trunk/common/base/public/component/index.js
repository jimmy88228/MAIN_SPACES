const App = getApp();

Component(App.BC({
  methods: {
    getComponentAsync(componentName) { // 拿到该容器里的某个组件,并返回(异步)
      return new Promise((resolve, reject) => {
        if (!componentName) reject("componentName为空");
        try {
          this[componentName] = this[componentName] || this.selectComponent("#" + componentName);
          if (this[componentName]) resolve(this[componentName])
          reject("没有找到该组件")
        } catch (err) {
          reject(err)
        }
      })
    },
    getComponent(componentName) { // 拿到该容器里的某个组件,并返回
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
  },
}))