import Vue from 'vue';
import {Message} from 'view-design';
import Conf from '../config/index';

const vueUntils = {};
let $_vm;

vueUntils.inOf = function (arr, targetArr) {
  let res = true;
  arr.map(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false;
    }
  });
  return res;
};

vueUntils.oneOf = function (ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true;
  } else {
    return false;
  }
};

vueUntils.showThisRoute = function (itAccess, currentAccess) {
  if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
    return vueUntils.oneOf(currentAccess, itAccess);
  } else {
    return itAccess === currentAccess;
  }
};

vueUntils.getRouterObjByName = function (routers, name) {
  if (!name || !routers || !routers.length) {
    return null;
  }
  let routerObj = null;
  for (const item of routers) {
    if (item.name === name) {
      return item;
    }
    routerObj = vueUntils.getRouterObjByName(item.children, name);
    if (routerObj) {
      return routerObj;
    }
  }
  return null;
};

vueUntils.handleTitle = function (vm, item) {
  if (typeof item.title === 'object') {
    return vm.$t(item.title.i18n);
  } else {
    return item.title;
  }
};

// 设置当前路由
vueUntils.setCurrentPath = function (vm, name) {
  let title = '';
  let isOtherRouter = false;
  vm.$store.state.app.routers.forEach(item => {
    if (typeof (item.children) !== 'undefined' && item.children.length === 1) {
      if (item.children[0].name === name) {
        title = vueUntils.handleTitle(vm, item);
        if (item.name === 'otherRouter') {
          isOtherRouter = true;
        }
      }
    } else if (typeof (item.children) !== 'undefined') {
      item.children.forEach(child => {
        if (child.name === name) {
          title = vueUntils.handleTitle(vm, child);
          if (item.name === 'otherRouter') {
            isOtherRouter = true;
          }
        }
      });
    }
  });
  let currentPathArr = [];
  if (name === 'home_index') {
    currentPathArr = [{
      title: vueUntils.handleTitle(vm, vueUntils.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
      path: '',
      name: 'home_index'
    }];
  } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
    currentPathArr = [{
      title: vueUntils.handleTitle(vm, vueUntils.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
      path: '/home',
      name: 'home_index'
    },
    {
      title: title,
      path: '',
      name: name
    }
    ];
  } else {
    const currentPathObj = vm.$store.state.app.routers.filter(item => {
      if (typeof (item.children) !== 'undefined' && item.children.length <= 1) {
        return item.children[0].name === name;
      } else if (typeof (item.children) !== 'undefined') {
        let i = 0;
        const childArr = item.children;
        const len = childArr.length;
        while (i < len) {
          if (childArr[i].name === name) {
            return true;
          }
          i++;
        }
        return false;
      }
    })[0];
    if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
      currentPathArr = [{
        title: '首页',
        path: '',
        name: 'home_index'
      }];
    } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
      currentPathArr = [{
        title: '首页',
        path: '/home',
        name: 'home_index'
      },
      {
        title: currentPathObj.title,
        path: '',
        name: name
      }
      ];
    } else {
      const childObj = currentPathObj.children.filter((child) => {
        return child.name === name;
      })[0];
      currentPathArr = [{
        title: '首页',
        path: '/home',
        name: 'home_index'
      },
      {
        title: currentPathObj.title,
        path: '',
        name: currentPathObj.name
      },
      {
        title: childObj.title,
        path: currentPathObj.path + '/' + childObj.path,
        name: name
      }
      ];
    }
  }
  vm.$store.commit('setCurrentPath', currentPathArr);

  return currentPathArr;
};

// 缓存封装函数
vueUntils.cache = {
  get: function (key) {
    var data = window.sessionStorage.getItem(key);
    if (data == null) {
      return null;
    } else {
      return JSON.parse(data);
    }
  },
  set: function (key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  },
  remove: function (key) {
    window.sessionStorage.removeItem(key);
  }
};

vueUntils.openNewPage = function (vm, name, argu, query) {
  const pageOpenedList = vm.$store.state.app.pageOpenedList;
  const openedPageLen = pageOpenedList.length;
  let i = 0;
  let tagHasOpened = false;
  while (i < openedPageLen) {
    if (name === pageOpenedList[i].name) { // 页面已经打开
      vm.$store.commit('pageOpenedList', {
        index: i,
        argu: argu,
        query: query
      });
      tagHasOpened = true;
      break;
    }
    i++;
  }
  if (!tagHasOpened) {
    let tag = vm.$store.state.app.tagsList.filter((item) => {
      if (item.children) {
        return name === item.children[0].name;
      } else {
        return name === item.name;
      }
    });
    tag = tag[0];
    if (tag) {
      tag = tag.children ? tag.children[0] : tag;
      if (argu) {
        tag.argu = argu;
      }
      if (query) {
        tag.query = query;
      }
      vm.$store.commit('increateTag', tag);
    }
  }
  vm.$store.commit('setCurrentPageName', name);
};

vueUntils.toDefaultPage = function (routers, name, route, next) {
  const len = routers.length;
  let i = 0;
  let notHandle = true;
  while (i < len) {
    if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
      route.replace({
        name: routers[i].children[0].name
      });
      notHandle = false;
      next();
      break;
    }
    i++;
  }
  if (notHandle) {
    next();
  }
};

vueUntils.fullscreenEvent = function (vm) {
  vm.$store.commit('initCachepage');
  // 权限菜单过滤相关
  vm.$store.commit('updateMenulist');
  // 全屏相关
};

// 查看大图 后续需要废除
vueUntils.viewImage = function (imgSrc) {
  if (!$_vm) $_vm = new Vue();
  if (imgSrc != '') {
    var initImgSrc = imgSrc.replace('_thumb.jpg', '', imgSrc);
    $_vm.$Modal.info({
      title: '',
      width: '750',
      content: '<div style="width:100%;height:600px;background:url(' + initImgSrc + ') center center no-repeat;background-size: 100% auto;"></div>',
      closable: true,
      'footer-hide': true,
      'mask-closable': true
    });

    window.setTimeout(() => {
      document.querySelector('.ivu-modal-confirm-body').style.paddingLeft = '0';
      // document.querySelector('.ivu-modal-confirm-footer').style.display = 'none';
    }, 500);
  }
}

vueUntils.format = function (date, fmt) {
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'h+': date.getHours() % 12, // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S+': date.getMilliseconds() // 毫秒
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
}

vueUntils.checkChars = (value) => {
  return value.replace(/[^\d,]+/gmi, '').replace(/,+/g, ',').replace(/(^\,+)|(\,+$)/g, '');
}

vueUntils.debounce = (func, delay) => {
  var timeout;
  return function (e) {
    clearTimeout(timeout);
    var context = this,
      args = arguments
    timeout = setTimeout(function () {
      func.apply(context, args);
    }, delay)
  };
};

// 接口字段a_vvv_ccc => aVvvCcc
vueUntils.endToFront = (obj) => {
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    return;
  }
  const origin = new Map(Object.entries(obj));
  const result = {};
  for (let [key, value] of origin.entries()) {
    let mergeKey = key.replace(/\_[^_]+/g, word => {
      return word.charAt(1).toUpperCase() + word.slice(2);
    });
    result[mergeKey] = value;
  }
  return result;
}

// Find component downward
vueUntils.findComponentDownward = function(context, componentName) {
  const childrens = context.$children;
  let children = null;

  if (childrens.length) {
    for (const child of childrens) {
      const name = child.$options.name;
      if (name === componentName) {
        children = child;
        break;
      } else {
        children = vueUntils.findComponentDownward(child, componentName);
        if (children) break;
      }
    }
  }
  return children;
}

vueUntils.transferNumber = function (value) {
  if (typeof value === 'object') return value;
  return !!value ? 1 : 0;
}
// 减法
vueUntils.reduceCalc = function (a, b) {
  let aLen, bLen;
  try {
    aLen = String(a).split('.')[1].length;
  } catch (e) {
    aLen = 0;
  }
  try {
    bLen = String(b).split('.')[1].length;
  } catch (e) {
    bLen = 0;
  }
  const maxLen = Math.max(aLen, bLen);
  const multiple = Math.pow(10, maxLen);
  return (a * multiple - b * multiple) / multiple;
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement('textarea');
  textArea.value = text;

  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    if (successful) {
      Message.success('复制成功!');
    } else {
      Message.error('复制失败!');
    }
  } catch (err) {
    Message.error(err);
  }

  document.body.removeChild(textArea);
}

vueUntils.copyTextToClipBoard = (function () {
  if (!navigator.clipboard) {
    return function (text) {
      fallbackCopyTextToClipboard(text);
    }
  } else {
    return function (text) {
      navigator.clipboard.writeText(text).then(() => {
        Message.success('复制成功!');
      }, err => {
        Message.error(err);
      })
    }
  }
})();

vueUntils.createDownload = function (url, filename) {
  const a = document.createElement('a'); // 创建a标签
  a.href = url;
  a.download = filename; // 下载的文件名
  a.id = 'downloadAction';
  document.body.append(a);

  // 给创建的a标签绑定点击事件下载
  const downloadAction = document.getElementById('downloadAction');
  downloadAction.click();
  downloadAction.remove();
}

vueUntils.createDomUid = function createUid(len = 32) {
  const $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const maxPos = $chars.length;
  let str = '';
  for (let i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}

export default vueUntils;
