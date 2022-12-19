// import Promise from "../libs/promise/promise";
import DateUtil from "../../utils/date/index";

function genNonDuplicateId() {
    return Math.random()
        .toString(36)
        .substr(3);
}

class TimerManager {
    static getInstance() {
        if (!TimerManager.instance) {
            TimerManager.instance = new TimerManager();
        }
        return TimerManager.instance;
    }

    on(handler) {
        if (!handler || typeof handler != "function") {
            return;
        }
        this.handlers || (this.handlers = {});
        let id = genNonDuplicateId();
        this.handlers[id] = handler;
        this._start();
        return id;
    }

    off(id) {
        if (this.handlers && id in this.handlers) {
            delete this.handlers[id];
            if (!this.hasHandler) {
                this._stop();
            }
        }
    }

    update() {
        this._start(true);
    }

    offAll() {
        this._stop();
        if (this.handlers) {
            delete this.handlers;
        }
    }

    _call() {
        //延时执行 避免外部 handler 操作start和stop 导致死循环
        return setTimeout(() => {
            if (this.hasHandler) {
                for (let key in this.handlers) {
                    try {
                        this.handlers[key]();
                    } catch (e) { }
                }
            } else {
                this._stop();
            }
        }, 100);
    }

    get hasHandler() {
        if (!this.handlers) {
            return false;
        }
        for (let key in this.handlers) {
            return true;
        }
        return false;
    }

    get isRunning() {
        return !!this.p;
    }

    _start(refresh = false) {
        if (!refresh && this.isRunning) {
            return;
        }
        this._run();
    }
    _run() {
        this._call();
        this._stop();
        if (this.hasHandler) {
            this.p = setTimeout(() => {
                this._run();
            }, 1000);
        }
    }

    _stop() {
        if (this.p) {
            clearTimeout(this.p);
            delete this.p;
        }
    }
}

const Timer = TimerManager.getInstance();


export default Timer;

export class CountDown {
    constructor(rightTime, initTime = new Date()) {
        if (rightTime && initTime) {
            this._dt = rightTime.getTime() - initTime.getTime();
        } else {
            this._dt = 0;
        }
        this._targetTime = 0;
    }
    setTarget(targetTime) {
        this._targetTime = (targetTime && targetTime.getTime()) || 0;
        return this;
    }

    start(handler) {
        this.stop();
        this.timerId = Timer.on(() => {
            handler && handler(this);
        });
        return this;
    }

    stop() {
        if (this.timerId) {
            Timer.off(this.timerId);
            this.timerId = null;
        }
        return this;
    }

    get isRunning() {
        return !!this.timerId;
    }

    get value() {
        let nowTime = new Date().getTime() + this._dt;
        var timeSpan = this._targetTime - nowTime;
        return Math.max(0, timeSpan);
    }
    get nowTime() {
        let nowTime = new Date().getTime() + this._dt;
        return nowTime;
    }

    format(fmt) {
        return DateUtil.spanFormat(this.value, fmt);
    }
}