export default {
    bind (el, binding, vnode) {

    },
    update(el, binding) {
      document.removeEventListener('click', el.__vueClickOutside__);
      delete el.__vueClickOutside__;

      function documentHandler(e) {
        // 包含目标或者是指定需要显示的dom
        if (el.contains(e.target) || binding.arg && binding.arg.contains(e.target)) {
          return false;
        }
        if (binding.expression) {
          binding.value(e);
        }
      }
      el.__vueClickOutside__ = documentHandler;
      document.addEventListener('click', documentHandler);
    }
};
