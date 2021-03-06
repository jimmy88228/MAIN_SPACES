export default {
    trim(str, s = "\\s") {
        str = str + "";
        let reg = new RegExp("^(" + s + ")+|(" + s + ")+$", "gm");
        return str && str.replace(reg, "");
    },
    trimStart(str, s = "\\s") {
        let reg = new RegExp("^(" + s + ")+", "gm");
        return str && str.replace(reg, "");
    },
    trimEnd(str, s = "\\s") {
        let reg = new RegExp("(" + s + ")+$", "gm");
        return str && str.replace(reg, "");
    }
};
