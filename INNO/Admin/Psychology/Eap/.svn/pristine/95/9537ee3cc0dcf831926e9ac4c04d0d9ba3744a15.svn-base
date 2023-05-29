function atb(v, b) {
    if (typeof v !== "undefined") {
        return (v || "") + (b || "");
    }
}

function is(value, type) {
    // 先处理null和undefined
    if (value === null) {
        return value === type;
    }
    // instanceof 判断继承
    return value.constructor === type || value instanceof type;
}

export default {
    atb,
    is
};
