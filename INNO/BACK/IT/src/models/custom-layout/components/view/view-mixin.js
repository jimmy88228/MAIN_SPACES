export default {
    props: ["node", "rootWidth"],
    inject: ["isCanEdit"],
    computed: {
        nodeData() {
            return this.node.data;
        },
        child() {
            return this.node.child;
        },
        type() {
            return this.node.type;
        },
        viewName() {
            return this.node.name;
        },
        typeName() {
            return this.node.typeName;
        },
        params() {
            return this.nodeData.parameters || {};
        },
        style() {
            return this.nodeData.style || {};
        },
        styleStr() {
            let baseWidth = Number(this.rootWidth);
            let style = this.nodeData && this.nodeData.style;
            let width = setWidth(baseWidth, style && style.width);
            let height = setHeight(baseWidth, style && style.height);
            let margin = setMargin(baseWidth, style && style.margin);
            let padding = setPadding(baseWidth, style && style.padding);
            let background = setBackground(style && style.background);
            let other = (style && style.other) || "";
            let mode = setMode(style && style.height);

            return { mode: mode, value: `${width}${height}${margin}${padding}${background}${other}` };
        },
        canEdit() {
            return !!this.isCanEdit;
        },
        selected() {
            return !!this.node.isEdit;
        }
    },
    mounted() {
        if (this.selected) {
            this.callSelect();
        }
    },
    watch: {
        selected(newVal) {
            if (newVal) {
                this.callSelect();
            }
        }
    },
    methods: {
        callSelect() {
            let v = this.$refs.viewRoot;
            if (v) {
                this.$emit("select", v);
            }
        },
        onSelect(v) {
            this.$emit("select", v);
        },
        edit() {
            this.node.toEdit();
        },
        del() {
            this.node.removeFromParent();
        }
    }
};

function setBackground(e) {
    return e ? `background:${e};` : "";
}
function setMargin(baseWidth, e) {
    let val = "";
    if (e && e.length === 4) {
        let [t, r, b, l] = e;
        val = `margin:${convert(baseWidth, t)}px ${convert(baseWidth, r)}px ${convert(baseWidth, b)}px ${convert(baseWidth, l)}px;`;
    }
    return val;
}
function setPadding(baseWidth, e) {
    let val = "";
    if (e && e.length === 4) {
        let [t, r, b, l] = e;
        val = `padding:${convert(baseWidth, t)}px ${convert(baseWidth, r)}px ${convert(baseWidth, b)}px ${convert(baseWidth, l)}px;`;
    }
    return val;
}
function setWidth(baseWidth, e) {
    return "width:" + (e ? `${convert(baseWidth, e)}px;` : "100%;");
}
function setHeight(baseWidth, e) {
    return "height:" + (e ? `${convert(baseWidth, e)}px;` : "auto;");
}
function setMode(e) {
    return e ? "aspectFill" : "widthFix";
}

function convert(baseWidth, val) {
    return (val * baseWidth) / 750.0;
}
