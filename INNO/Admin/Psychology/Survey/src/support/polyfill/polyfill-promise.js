const LOG_TAG = "polyfill-promise"; 
class AggregateError extends Error {
    constructor(array) {
        super();
        console.log('polyfill-promise constructor')
        this.name = "AggregateError";
        this.errors = array;
    }
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
    return this.then((res) => onContinue && onContinue(res)
        , (res) => onContinue && onContinue(res));
};