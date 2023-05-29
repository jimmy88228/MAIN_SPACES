const LOG_TAG = "polyfill-promise"; 
class AggregateError extends Error {
    constructor(array) {
        super();
        this.name = "AggregateError";
        this.errors = array;
    }
}
//any (小程序插件会报错)
if(!Promise.any){
    Promise.any = function (array) {
        return new Promise((rs, rj) => {
            let length = array.length;
            let count = 0;
            let isCalled = false;
            let arrayRs;
            for (let i = 0; i < length; i++) {
                array[i].then(data => {
                    if (isCalled)
                        return;
                    isCalled = true;
                    rs(data);
                }).catch(err => {
                    if (isCalled)
                        return;
                    arrayRs || (arrayRs = new Array(length));
                    arrayRs[i] = err;
                    count++;
                    if (count < length)
                        return;
                    isCalled = true;
                    rj(new AggregateError(arrayRs));
                });
            }
        });
    }
}

// delay
Promise.delay = function (ms, val) {
    if (ms > 0) {
        let _rs;
        let p = new Promise(rs => _rs = rs);
        let timer = setTimeout(() => {
            _rs(val);
            clearTimeout(timer);
        }, ms)
        return p;
    }
    else
        return Promise.resolve(val);
};
Promise.prototype.delay = function (ms) {
    return Promise.delay(ms, this);
}

// finally //(小程序插件会报错)
if(!Promise.prototype.finally){
    console.log('Promise.prototype.finally');
    Promise.prototype.finally = function (callback) {
        return this.then((data) => {
            try { callback(); } catch(error) { }
            return data;
        }, err => {
            try { callback(); } catch(error) { }
            return Promise.reject(err);
        });
    }
}

//cancelable
Promise.cancelable = function (promise) {
    let isCanceled = false;
    let p = new Promise((resolve, reject) => promise.then(
        (...args) => isCanceled ? new Promise(() => { }) : resolve(...args),
        (...args) => isCanceled ? new Promise(() => { }) : reject(...args)
    ));
    p.cancel = () => isCanceled = true;
    return p;
}
Promise.prototype.cancelable = function () {
    return Promise.cancelable(this);
}


/***************************** 非规范 *****************************/
// if
Promise.prototype.if = function (value, onResolved, onRejected) {
    if (!value)
        return this;
    return this.then(onResolved, onRejected);
}
//ifcatch
Promise.prototype.ifcatch = function (value, onRejected) {
    if (!value)
        return this;
    return this.catch(onRejected);
};
//ignore
Promise.prototype.ignore = function (onContinue) {
    return this.then(() => onContinue && onContinue()
        , () => onContinue && onContinue());
};
//nextTick
Promise.nextTick = function () {
  return new Promise(rs => wx.nextTick(() => rs()))
}
//nextTick prototype
Promise.prototype.nextTick = function () {
  return this.then(() => Promise.nextTick());
}
//showError
Promise.prototype.showError = function (msg) {
  return this.catch(err => {Smm.showToast({ title: msg || err });return Promise.reject(err)});
};