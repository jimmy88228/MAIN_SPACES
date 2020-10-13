import NavConf from "./nav-config";
import Util from "../../common/utils/util";
import SIH from "../../common/helper/sys-infos-helper";

const statusBarHeight = SIH.statusBarHeight;
const menuRect = SIH.menuRect;
const menuTop = (menuRect.top || 0) - statusBarHeight;
const menuHeight = menuRect.height || 0;

const titleBarHeight = menuHeight + menuTop * 2;
const navigationBarHeight = titleBarHeight + statusBarHeight;

let navStayStyle, navStyle;
navStayStyle = navStyle = `height: ${navigationBarHeight}px; `;
navStyle += `padding-top: ${statusBarHeight}px; `;

const BackMode = {
    Auto: { m: "Auto", c:"back-i"},
    None: { m: "None", c:"back-i"},
    Back: { m: "Back", i: "back", c:"back-i" },
    Back_Sec: { m: "Back", i: "back_sec", c:"back-i-lg" },
    Home: { m: "Home", i: "home", c:"back-i" },
    HoldUp: { m: "HoldUp", i: "back", c:"back-i" },
};

Component({
    options: {
        multipleSlots: true,
        addGlobalClass: true
    },

    properties: {
        navTitle: String,
        full: {
            type: Boolean,
            value: false
        },
        opacity: {
            type: Number,
            value: undefined,
            observer(newVal) {
                if (!this.isAttached) return;
                this.setOpacity(newVal, true);
            }
        },
        cover: {
            type: Boolean,
            value: false
        },
        mode: {
            type: String,
            value: BackMode.Auto.m,
            observer(newVal) {
                if (!this.isAttached) return;
                this.setMode(newVal);
            }
        },
        pageScrollTop: {
            type: Number,
            value: undefined,
            observer(newVal) {
                if (!this.isAttached) return;
                this.setPageScrollTop(newVal, true);
            }
        }
    },
    data: {
        navStayStyle: navStayStyle,
        navStyle: navStyle
    },
    attached() {
        if (this.isAttached) return;
        this.isAttached = true;
        this.opacity = 1;
        this.setData({ mOpacity: 1 });
        this.setMode(this.properties.mode);
        this.setOpacity(this.properties.opacity, true);
        this.setPageScrollTop(this.properties.pageScrollTop, true);
    },
    methods: {
        toBack() {
            let mode = this.data.backMode;
            if (mode.m == BackMode.HoldUp.m) {
                this.triggerEvent('HoldUpEvent');
            } else if (mode.m == BackMode.Back.m) {
                wx.navigateBack({
                    delta: 1
                });
            } else if (mode.m == BackMode.Home.m) {
                wx.reLaunch({
                    url: `/${NavConf.INDEX_PATH}`
                });
            }
        },

        setOpacity(opacity, now) {
            if (opacity === undefined) return
            if (now) {
                if (this.opacity === opacity) return;
                this.opacity = opacity;
                this.setData({ mOpacity: opacity });
            } else {
                this.changeOpacity || (this.changeOpacity = Util.throttle(value => this.setOpacity(value, true), 24));
                this.changeOpacity(opacity);
            }
        },

        setPageScrollTop(scrollTop, now) {
            if (scrollTop === undefined) return;
            if (now) {
                let opacity;
                if (scrollTop <= 0) {
                    opacity = 0;
                } else if (scrollTop > navigationBarHeight) {
                    opacity = 1;
                } else {
                    opacity = scrollTop / navigationBarHeight;
                }
                if (this.opacity === opacity) return;
                this.opacity = opacity;
                this.setData({ mOpacity: opacity });
            } else {
                this.changeScrollTop || (this.changeScrollTop = Util.throttle(value => this.setPageScrollTop(value, true), 24));
                this.changeScrollTop(scrollTop);
            }
        },

        setMode(mode) {
            let backMode = BackMode.None;
            if (!mode || mode == BackMode.Auto.m) {
                let pages = getCurrentPages();
                if (pages.length > 1) {
                    backMode = BackMode.Back
                } else if (pages.length <= 1 && Array.isArray(NavConf.EXCLUDE_PATH) && NavConf.EXCLUDE_PATH.every(item => pages[0].route != item)) {
                    backMode = BackMode.Home
                }
            } else if (BackMode[mode]) {
                backMode = BackMode[mode];
            }
            this.setData({
                hasBack: backMode.m != BackMode.None.m,
                backMode
            });
        }
    }
});
