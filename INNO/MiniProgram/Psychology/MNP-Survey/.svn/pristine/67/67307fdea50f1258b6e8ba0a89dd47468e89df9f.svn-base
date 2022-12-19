import SIH from "../../helper/sys-infos-handler"
export default {
  trim(str, s = "\\s") {
    if (!str) {
      return str
    }
    let reg = new RegExp("^(" + s + ")+|(" + s + ")+$", "gm");
    return str.replace(reg, "");
  },
  trimStart(str, s = "\\s") {
    if (!str) {
      return str
    }
    let reg = new RegExp("^(" + s + ")+", "gm");
    return str.replace(reg, "");
  },
  trimEnd(str, s = "\\s") {
    if (!str) {
      return str
    }
    let reg = new RegExp("(" + s + ")+$", "gm");
    return str.replace(reg, "");
  },
  encodePrice(str, s = "") {
    if (str.length <= 1) {
      return s;
    } else {
      let idx = str.indexOf(".");
      let arr = str.split("");
      arr.splice(0, idx, s);
      return arr.join('');
    }
  },
  checkWxScene(scene) {
    scene = scene + "";
    let reg = /^[-]?[0-9]+\.?[0-9]+?$/;
    if (reg.test(scene) && (scene.substr(0, 2) == "10" || scene.substr(0, 2) == "11")) {
      return true
    } else {
      return false;
    }
  },
  getAppUrlParams() {
    let href = window && window.location && window.location.href;
    if (!href) {
      let page = getCurrentPages().slice(-1)[0] || {};
      return page.options || {}
    } else {
      return this.getUrlParam(href);
    }
  },
  getUrlParam(url, returnPureUrl) {
    if (!url) {
      return {}
    }
    url = decodeURIComponent(url);
    let pureUrl = url.split("?")[0] || "";
    let paramsStr = url.split("?")[1] || "";
    let singlePArr = paramsStr.split("&");
    let params = {}
    for (let i = 0; i < singlePArr.length; i++) {
      let itemParam = singlePArr[i].split("=");
      itemParam[0] && (params[itemParam[0]] = itemParam[1]);
    }
    if (returnPureUrl) {
      return {
        path: pureUrl,
        params
      }
    } else {
      return params || {};
    }
  },
  desensitization(str, type = 'normal') {
    let result = '';
    if (str) {
      if (type == 'phone') {
        str = parseInt(str);
        let reg = /^1[2-9]{1}\d{9}$/;
        if (reg.test(str)) {
          str = '' + str;
          result = str.slice(0, 3) + '****' + str.slice(-4);
        }
      } else {
        str = String(str);
        let len = str.length;
        if (len <= 2) {
          for (let i = 0; i < len; i++) {
            if (i == 0) {
              result += '*'
            } else {
              result += str[i]
            }
          }
        } else {
          for (let i = 0; i < len; i++) {
            if (i == 0 || i == len - 1) {
              result += str[i]
            } else {
              result += '*'
            }
          }
        }

      }
    }
    return result
  },
  getPageParamsStr(options) {
    let params = "";
    for (let i in options) {
      params = params ? params + "&" + i + "=" + options[i] : i + "=" + options[i]
    }
    return params;
  },
  addUrlParams(url, options) {
    for (let i in options) {
      url = url.indexOf('?') == -1 ? url + '?' + i + '=' + options[i] : url + '&' + i + '=' + options[i]
    }
    return url;
  },
  safeFilter(value, type) {
    let pattern = new RegExp("[`~!@$^&*=|{}':;',.<>/?~！@￥……&*——|{}【】‘；：”“'。，、？]", 'g');
    switch (type) {
      case "address":
        break;
      case "remarks":
        pattern = new RegExp("[`@$^&*=|{}';',.<>/?~！@￥……&*——|{}‘；”“'，、？]", 'g');
        break;
    }
    value = value.replace(pattern, "");
    return value
  },
  getCharLength(str) {
    let realLength = 0;
    try {
      let len = str.length,
        charCode = -1;
      for (let i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
      }
    } catch (e) {}
    return realLength
  },
  changeHttp(link) {
    if (link.indexOf("http://") == "-1" && link.indexOf("https://") == "-1") {
      link = "https://" + link;
    } else if (link.indexOf("https://") == "-1") {
      link = link.replace('http://', 'https://');
    }
    return link;
  },
  appendHtml(path) { // 页面路径加上.html来解决跳转页面空白的bug
    let qmIndex = path.indexOf("?")
    if (qmIndex == '-1') {
      path = path + '.html'
    } else {
      path = path.replace('?', '.html?')
    }
    return path
  },
  transPx(rpx = 0) {
    return parseFloat(rpx * (SIH.screenWidth / 750));
  },
  transRpx(px = 0) {
    return parseFloat(px / (SIH.screenWidth / 750));
  },
}