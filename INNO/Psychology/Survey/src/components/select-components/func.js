import Vue from 'vue';
import store from '@/store';

const selectModule = optionsData => {
  const {mode, props, slots, options, ok, cancel} = optionsData;
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
    instance.$on('ok', data => {
      typeof(ok) == 'function' && ok(data);
    });
		// 失败回调
		instance.$on('cancel', data => {
		  typeof(cancel) == 'function' && cancel(data);
		});
    // 关闭弹窗销毁组件
    instance.$on('destroy', () => {
      instance.$destroy();
    });
    const vm = instance.$mount();
    document.body.appendChild(vm.$el);
    vm.showModal(options);
    // // 获取组件
    // const Template = _.default;
    // const Constructor = Vue.extend(Template);
    // const instance = new Constructor({
    //   propsData: options
    // });
    // // 成功回调
    // instance.$on('get-list', data => {
    //   getList(data);
    // });
    // // 关闭弹窗销毁组件
    // instance.$on('destroy', () => {
    //   instance.$destroy();
    // });
    // const vm = instance.$mount();
    // document.body.appendChild(vm.$el);
    // vm.showModal();
  });
}

export default selectModule;
