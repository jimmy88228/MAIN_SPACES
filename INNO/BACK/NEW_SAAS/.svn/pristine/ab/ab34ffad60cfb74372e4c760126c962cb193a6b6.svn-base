import Vue from 'vue';
import AsyncValidator from 'async-validator';
// 不推荐使用
Vue.directive('legalNum', {
  bind: function (el, {
    arg
  }, vnode) {
    el.addEventListener('input', evt => {
      const target = evt.target || evt.srcElement;
      const val = target.value;
      const idName = `v_num_${arg}`;
      const ele = document.getElementById(idName);
      if (isFinite(Number(val)) && val >= 0) {
        if (ele) vnode.elm.removeChild(ele);
      } else {
        if (!ele) {
          const childTip = document.createElement('p');
          childTip.innerHTML = '请输入合法值';
          childTip.id = idName;
          childTip.style.color = '#ed4014';
          vnode.elm.appendChild(childTip);
        }
      }
    });
  }
});
// 不推荐使用
Vue.directive('checkEmpty', {
  bind: function (el, {
    arg
  }, vnode) {
    el.addEventListener('input', evt => {
      const target = evt.target || evt.srcElement;
      const val = target.value;
      const idName = `v_empty_${arg}`;
      const ele = document.getElementById(idName);
      const regex = /\S+/;
      if (regex.test(val)) {
        if (ele) vnode.elm.removeChild(ele);
      } else {
        if (!ele) {
          const childTip = document.createElement('p');
          childTip.innerHTML = '內容不能为空';
          childTip.id = idName;
          childTip.style.color = '#ed4014';
          vnode.elm.appendChild(childTip);
        }
      }
    });
  }
});
// 表单校验时滚动到指定位置
(function () {
  let target = [];
  function handleScroll(child, prop, status, el) {
    child.forEach((item) => {
      if (item.prop === prop && !status) {
        target.push(item.$el);
        target[0].scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        });
      }
      if (item.$children.length) {
        handleScroll(item.$children, prop, status, el);
      }
    });
  }
  Vue.directive('friendly-errors', {
    inserted (el, binding, vnode) {
      const Form = vnode.child;
      const FormChild = vnode.child.$children;
      Form && Form.$on('on-validate', (prop, status, error) => {
        handleScroll(FormChild, prop, status, el);
      });
    },
    update () {
      target = [];
    }
  })
})();
// table数据校验
(function () {
  // 查找所有子组件
  function findComponentsDownward(context, componentName) {
    return context.$children.reduce((components, child) => {
      if (child.$options.name === componentName) components.push(child);
      const foundChilds = findComponentsDownward(child, componentName);
      return components.concat(foundChilds);
    }, []);
  }
  // 校验
  function validate(tableInstance, binding, key, isAll, callback) {
      let descriptor = {}; //建立规则
      let model = {}; //建立数据模型
      if (Object.prototype.toString.call(binding.value) === '[object Object]') {
        if (tableInstance.data && tableInstance.data.length) {
          if (isAll) {
            for (let key in binding.value) {
              for (let i = 0, len = tableInstance.data.length; i < len; i++) {
                descriptor[`${key}${i}`] = binding.value[key];
                model[`${key}${i}`] = tableInstance.data[i][key];
              }
            }
          } else {
            const reg = /^(?<k>([^\d]+))(?<index>(\d+))$/;
            const match = reg.exec(key);
            descriptor[key] = binding.value[match.groups.k];
            model[key] = tableInstance.data[match.groups.index][match.groups.k];
          }
          const validator = new AsyncValidator(descriptor);
          validator.validate(model, {
            firstFields: true
          }, (errors, fields) => {
            callback(errors);
          });
        }
      } else {
        throw new SyntaxError('校验规则必须是对象!');
      }
  }
  // 创建自定义样式
  function createEle(mess, key, parent) {
    clearEle(key, parent);
    const p = document.createElement('p');
    p.style.color = 'red';
    p.style.fontSize = '14px';
    p.innerHTML = mess;
    p.className = key;
    return p;
  }
  function clearEle(key, parent) {
    if (parent.querySelector(`.${key}`)) {
      parent.removeChild(parent.querySelector(`.${key}`));
    }
  }
  Vue.directive('validate-table', {
    bind(el, binding, vnode) {
      const tableInstance = vnode.componentInstance;
      let refStack = [];
      // 全部数据校验 validate-table事件需要自己手动触发
      tableInstance.$on('validate-table', () => {
        validate(tableInstance, binding, null, true, (errors) => {
          if (errors) {
            tableInstance.$emit('on-validate-table', false);
            errors.forEach(error => {
              const parent = document.querySelector(`[data-key="${error.field}"]`).parentNode;
              const p = createEle(error.message, error.field, parent);
              parent.appendChild(p);
            });
            el.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest"
            });
          } else {
            tableInstance.$emit('on-validate-table', true);
            clearEle(valideKey, parent);
          }
        })
      });
      tableInstance.$on('hook:updated', () => {
        const cells = findComponentsDownward(tableInstance, 'TableCell');
        cells.forEach(cell => {
          if (cell.column.check) {
            const valideRef = cell.$children && cell.$children[0]; //只考虑一个tableCell只有一个输入框
            if (refStack.length === 0 || !refStack.includes(valideRef)) {
              // 单个数据校验
              valideRef.$on('on-blur', () => {
                let valideKey = valideRef.$el.dataset.key;
                const parent = valideRef.$el.parentNode;
                validate(tableInstance, binding, valideKey, false, (errors) => {
                  if (errors) {
                    const mess = errors.filter(error => error.field === valideKey)[0].message;
                    const p = createEle(mess, valideKey, parent);
                    parent.appendChild(p);
                  } else {
                    clearEle(valideKey, parent);
                  }
                })
              })
              refStack.push(valideRef);
            }
          }
        });
      });
    }
  })
})();

