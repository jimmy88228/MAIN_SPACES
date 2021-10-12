import Vue from 'vue';

const selectModule = options => {
  const {mode, getList} = options;
  import(`./module/${mode}-select`).then(_ => {
    // 获取组件
    const Template = _.default;
    const Constructor = Vue.extend(Template);
    const instance = new Constructor({
      propsData: options
    });
    // 成功回调
    instance.$on('get-list', data => {
      getList(data);
    });
    // 关闭弹窗销毁组件
    instance.$on('destroy', () => {
      instance.$destroy();
    });
    const vm = instance.$mount();
    document.body.appendChild(vm.$el);
    vm.showModal();
  });
}

export default selectModule;
