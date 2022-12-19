export default {
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
    cache: {
        get: function (key) {
            let data = window.sessionStorage.getItem(key);
            if (data == null) {
                return null;
            } else if (data == "undefined") {
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
    },
    copyText: (function () {
        if (!navigator.clipboard) {
            return function (text) {
                if(!text) {
                    $Bus.$Message.warning('无可复制内容!');
                    return;
                }
                fallbackCopyTextToClipboard(text);
            }
        } else {
            return function (text) {
                if(!text) {
                    $Bus.$Message.warning('无可复制内容!');
                    return;
                }
                navigator.clipboard.writeText(text).then(() => {
                    $Bus.$Message.success('复制成功!');
                }, err => {
                    $Bus.$Message.error(err);
                })
            }
        }
    })(),
    transTime(time=0) {
        // 转换为式分秒
        let h = parseInt(time / 60 / 60 % 24)
        h = h < 10 ? '0' + h : h
        let m = parseInt(time / 60 % 60)
         m = m < 10 ? '0' + m : m
        let s = parseInt(time % 60)
         s = s < 10 ? '0' + s : s
        // 作为返回值返回
        return [h,m,s]
    },
};
// 复制
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = 0;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        if (successful) {
            $Bus.$Message.success('复制成功!');
        } else {
            $Bus.$Message.error('复制失败!');
        }
    } catch (err) {
        $Bus.$Message.error(err);
    }

    document.body.removeChild(textArea);
}