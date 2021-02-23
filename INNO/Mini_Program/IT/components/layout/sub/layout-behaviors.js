import SIH from "../../../common/helper/sys-infos-helper";
export default Behavior({
    behaviors: [Behavior.BaseBehavior],
    data: {
        style: {},
        params: {},
        childs: []
    },
    methods: {
        adAction() {
            let obj = this.data.params;
            if (!obj.path) {
                return;
            }
            switch (obj.type) {
                case "Web":
                    wx.navigateTo({
                        url: `/pages/web/web?url=${encodeURIComponent(obj.path)}`
                    });
                    break;
                case "Page":
                    let path = obj.path;
                    if (!/^\/.*$/.test(path)) {
                        path += "/" + path;
                    }
                    wx.navigateTo({
                        url: path,
                        fail:()=>{
                            wx.switchTab({
                              url: path,
                            })
                        }
                    });
                    break;
                case "Outer":
                    if (!obj.appId) {
                        return;
                    }
                    wx.navigateToMiniProgram({
                        appId: obj.appId,
                        path: obj.path
                    });
                    break;
            }
            this.writeActionLog();
        },
        writeActionLog() {
            let obj = this.data.params;
            let statName = obj.statName;
            if (statName) {
                this.addActionLog(statName, null, {
                    type: obj.type,
                    appId: obj.appId,
                    path: obj.path
                });
            }
        },
        initStyle(style) {
            let width = "width:100%;";
            let mode = "widthFix";
            let height = "height:auto;";
            let margin = "";
            let padding = "";
            let background = "";
            if (style) {
                width = this._setWidth(style.width);
                margin = this._setMargin(style.margin);
                padding = this._setPadding(style.padding);
                background = this._setBackground(style.background);
                if (style.height) {
                    height = this._setHeight(style.height);
                    mode = "aspectFill";
                } else if (style.width_height_ratio) {
                    let ratio = style.width_height_ratio;
                    height = "height:" + (style.width ? `${to750px(style.width) / ratio}px;` : `${100 / ratio}%;`);
                }
            }
            return {
                value: `${width}${height}${margin}${padding}${background}${style.other || ""}`,
                mode: mode
            };
        },
        _setBackground(e) {
            var val = "";
            if (e) {
                val = `background:${e};`;
            }
            return val;
        },
        _setMargin(e) {
            var val = "";
            if (e && e.length == 4) {
                let [t, r, b, l] = e;
                val = `margin:${to750px(t)}px ${to750px(r)}px ${to750px(b)}px ${to750px(l)}px;`;
            }
            return val;
        },
        _setPadding(e) {
            var val = "";
            if (e && e.length == 4) {
                let [t, r, b, l] = e;
                val = `padding:${to750px(t)}px ${to750px(r)}px ${to750px(b)}px ${to750px(l)}px;`;
            }
            return val;
        },
        _setWidth(e) {
            return "width:" + (e ? `${to750px(e)}px;` : "100%;");
        },
        _setHeight(e) {
            return "height:" + (e ? `${to750px(e)}px;` : "auto;");
        }
    }
});
const ratio = SIH.screenWidth / 750;
function to750px(val) {
    return val * ratio;
}
