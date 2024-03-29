import Vue from 'vue';
import store from '@/store';
// import 
const UIModule = optionsData => {
  const {mode, props, slots, options, success, fail} = optionsData;
  import(`./module/${mode}`).then(_ => {
    // 获取组件
    const Template = _.default;
    const Constructor = Vue.extend(Template);
    const instance = new Constructor({
			propsData: props,
			store: store,
			slots: slots
		});
    // 成功回调
    instance.$on('success', (data,extra={}) => {
      typeof(success) == 'function' && success(data,extra);
    });
		// 失败回调
		instance.$on('fail', data => {
		  typeof(fail) == 'function' && fail(data);
		});
    const vm = instance.$mount();
    // 关闭弹窗销毁组件并且removeChild
    instance.$on('destroy', () => {
      document.body.removeChild(vm.$el);
      setTimeout(() => {
        instance.$destroy();
      }, 500);
    });
    document.body.appendChild(vm.$el);
    vm.showModal(options);
  });
}

export default UIModule;
