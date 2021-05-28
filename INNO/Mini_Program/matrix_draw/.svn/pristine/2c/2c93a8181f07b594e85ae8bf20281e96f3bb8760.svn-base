export default {
    compareVersion(v1, v2) {
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
    },
    merge(...objs) {
        let obj = {};
        if (objs && objs.length > 0) {
            for (let i = 0, n = objs.length; i < n; i++) {
                let e = objs[i];
                if (e) {
                    obj = {
                        ...obj,
                        ...this.copy(objs[i])
                    };
                }
            }
        }
        return obj;
    },
    copy(obj) {
        if (!obj) {
            return obj;
        }
        let newObj = {};
        for (let key in obj) {
            let p = obj[key];
            if (p && p.constructor === Object) {
                newObj[key] = this.copy(p);
            } else {
                newObj[key] = p;
            }
        }
        return newObj;
    },
    /**
     * 去抖
     * @param {Function} fn 执行体
     * @param {Number} delay 周期时间
     */
    debounce(fn, delay) {
        var timer;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            if (delay) {
                timer = setTimeout(() => {
                    clearTimeout(timer);
                    fn.apply(context, args);
                }, delay);
            } else {
                fn.apply(context, args);
            }
        };
    },
    /**
     * 节流
     * @param {Function} fn 执行体
     * @param {Number} threshhold 周期时间
     */
    throttle(fn, threshhold) {
        var last, timer;
        return function () {
            var context = this, now = new Date().getTime(), args = arguments;
            clearTimeout(timer);
            if (last && threshhold && now < last + threshhold) {
                timer = setTimeout(() => {
                    clearTimeout(timer);
                    last = now;
                    fn.apply(context, args);
                }, (last + threshhold - now));
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    },

    uuid(len, radix) {
        let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
        let uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            let r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    },

    uuid16ByTime(len) {
        var uuid = new Date().getTime().toString(16).toUpperCase();
        return uuid + this.uuid(Math.max(len - uuid.length, 5), 16);
    }
}