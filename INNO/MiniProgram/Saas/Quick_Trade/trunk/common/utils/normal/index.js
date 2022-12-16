function requestAnimationFrame(cb) {
  let systemInfo = wx.getSystemInfoSync();
  if (systemInfo.platform === 'devtools') {
    return setTimeout(function () {
      cb();
    }, 1000 / 30);
  }
  return wx
    .createSelectorQuery()
    .selectViewport()
    .boundingClientRect()
    .exec(function () {
      cb();
    });
}

function uuid(len, radix) {
  len = Math.max(len, 5);
  let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  let uuid = [],
      i;
  radix = radix || chars.length;

  if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
      let r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
      uuid[14] = "4";
      for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
              r = 0 | (Math.random() * 16);
              uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
          }
      }
  }
  return uuid.join("");
}
function uuid16ByTime(len) {
  var uuid = new Date().getTime().toString(16).toUpperCase();
  return uuid + this.uuid(Math.max(len - uuid.length, 5), 16);
}

function debounce(fn, delay) {
  let timer;
  return function () {
    const _this = this;
    const args = arguments;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(_this, args); // _this.fn(args);
    }, delay)
  }
}

function throttle(fn, delay) {
  let timer;
  return function () {
    const _this = this;
    const args = arguments;
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(_this, args); // _this.fn(args);
      timer = null;
    }, delay)
  }
}

function throttle_2(fn, wait) { // 立即调用版本
  let flag = true;
  let timer = null;
  return function () {
    if (flag) {
      fn.apply(this, arguments);
      flag = false;
      timer = setTimeout(() => {
        flag = true;
      }, wait)
    }
  }
}


function compareVersion(v1, v2) {
  console.log('v1, v2',v1, v2)
  v1 = v1.split(".");
  v2 = v2.split(".");
  var len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
      v1.push("0");
  }
  while (v2.length < len) {
      v2.push("0");
  }
  for (var i = 0; i < len; i++) {
      var num1 = parseInt(v1[i]);
      var num2 = parseInt(v2[i]);

      if (num1 > num2) {
          return -1;
      } else if (num1 < num2) {
          return 1;
      }
  }
  return 0;
}

export default {
  requestAnimationFrame,
  uuid,
  uuid16ByTime,
  debounce,
  throttle,
  throttle_2,
  compareVersion
}