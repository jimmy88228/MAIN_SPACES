function genNonDuplicateId() {
    return Math.random()
        .toString(36)
        .substr(3);
}
class EventBus {
    static getInstance() {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    call(eventName, data) {
        if (eventName && this.map && eventName in this.map) {
            let handlers = this.map[eventName];
            for (let key in handlers) {
                if (handlers[key]) {
                    handlers[key](data);
                }
            }
        }
    }
    listen(eventName, handler) {
        if (eventName && handler) {
            this.map || (this.map = {});
            this.map[eventName] || (this.map[eventName] = {});
            let id = genNonDuplicateId();
            this.map[eventName][id] = handler;
            return id;
        }
    }
    unListen(eventName, id) {
        if (eventName && id && this.map && eventName in this.map && id in this.map[eventName]) {
            let handlers = this.map[eventName];
            delete handlers[id];
            for (let key in handlers) {
                if (handlers[key]) {
                    return;
                }
            }
            delete this.map[eventName];
        }
    }
    unListenEvent(eventName) {
        if (eventName && this.map && eventName in this.map) {
            delete this.map[eventName];
        }
    }
    unListenAll() {
        if (this.map) {
            delete this.map;
        }
    }
    register(eventName, handler) {
        let id = this.listen(eventName, handler);
        if (id) {
            let _this = this;
            return function() {
                _this.unListen(eventName, id);
            };
        }
    }
}
export default EventBus.getInstance();
