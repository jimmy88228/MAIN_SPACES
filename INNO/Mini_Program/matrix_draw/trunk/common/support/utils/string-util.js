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
    }
};
