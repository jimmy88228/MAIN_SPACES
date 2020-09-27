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
    }
};
