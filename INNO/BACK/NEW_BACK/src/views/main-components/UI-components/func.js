import Vue from 'vue';
import store from '@/store';
// import 
const UIModule = optionsData => {
  const {mode, props, options, success, fail} = optionsData;
  import(`./module/${mode}`).then(_ => {
    // 获取组件
    const Template = _.default;
    const Constructor = Vue.extend(Template);
    const instance = new Constructor({
			propsData: props,
			store: store
		});
    // 成功回调
    instance.$on('success', data => {
      typeof(success) == 'function' && success(data);
    });
		// 失败回调
		instance.$on('fail', data => {
		  typeof(fail) == 'function' && fail(data);
		});
    // 关闭弹窗销毁组件
    instance.$on('destroy', () => {
      instance.$destroy();
    });
    const vm = instance.$mount();
    document.body.appendChild(vm.$el);
    vm.showModal(options);
  });
}

export default UIModule;
