import Utils from "./utils.js";

class AnimClass {
    constructor(m, to, active) {
        this._m = m;
        this._to = to;
        this._active = active;
    }
    get m() {
        return this._m;
    }
    get to() {
        return this._to;
    }
    get active() {
        return this._active;
    }

    static create(ap) {
        if (ap === null || ap === undefined) {
            return;
        }
        let m, to, active;
        if (ap) {
            if (Utils.is(ap, String)) {
                m = Utils.atb(ap);
                to = Utils.atb(ap, "-to");
                active = Utils.atb(ap, "-active");
            } else if (Utils.is(ap, Object)) {
                if (ap.name) {
                    m = Utils.atb(ap.name);
                    to = Utils.atb(ap.name, "-to");
                    active = Utils.atb(ap.name, "-active");
                }
                ap.m && (m = m ? `${m} ${ap.m}` : ap.m);
                ap.to && (to = to ? `${to} ${ap.to}` : ap.to);
                ap.active && (active = active ? `${active} ${ap.active}` : ap.active);
            }
        }
        return new AnimClass(m, to, active);
    }
}

class Transition {
    constructor(enter, leave) {
        this._enterAnim = enter;
        this._leaveAnim = leave;
    }
    get enterAnim() {
        return this._enterAnim || {};
    }
    get leaveAnim() {
        return this._leaveAnim || {};
    }
}

export default class PageAnimation {
    constructor(t1, t2) {
        this._t1 = t1;
        this._t2 = t2;
    }
    get openTransition() {
        return this._t1;
    }
    get closeTransition() {
        return this._t2;
    }
    static create(obj) {
        let openEnter = AnimClass.create(obj.openEnter);
        let openLeave = AnimClass.create(obj.openLeave);
        let closeEnter = AnimClass.create(obj.closeEnter);
        let closeLeave = AnimClass.create(obj.closeLeave);
        return new PageAnimation(new Transition(openEnter, openLeave), new Transition(closeEnter, closeLeave));
    }
}
export const createAnimData = function(e, l) {
    let data;
    if (e) {
        data || (data = {});
        data.enter = e.m || "";
        data.enterTo = e.to || "";
        data.enterActive = e.active || "";
    }
    if (l) {
        data || (data = {});
        data.leave = l.m || "";
        data.leaveTo = l.to || "";
        data.leaveActive = l.active || "";
    }
    return data;
};
