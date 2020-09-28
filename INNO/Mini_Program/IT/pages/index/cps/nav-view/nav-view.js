import SIH from "../../../../common/helper/sys-infos-helper";

const statusBarHeight = SIH.statusBarHeight;
const menuRect = SIH.menuRect;
const menuTop = (menuRect.top || 0) - statusBarHeight;
const menuHeight = menuRect.height || 0;

const titleBarHeight = menuHeight + menuTop * 2;
const navigationBarHeight = titleBarHeight + statusBarHeight;
const stayHeight = navigationBarHeight * 1.2;
const logoHeight = titleBarHeight * 0.8;
const dtHeight = stayHeight - navigationBarHeight;

let navStayStyle, navStyle, logoStyle;
navStayStyle = `height: ${stayHeight}px; `;
navStyle = `height: ${navigationBarHeight}px; padding-top: ${statusBarHeight}px; `;
logoStyle = `width: ${logoHeight}px; height: ${logoHeight}px; `;

Component({
    options: {
        styleIsolation: "apply-shared"
    },
    properties: {
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
        navStyle: navStyle,
        logoStyle: logoStyle
    },
    lifetimes: {
        attached() {
            if (this.isAttached) return;
            this.isAttached = true;
            this.opacity = 1;
            this.bigLogo = true;
            this.setData({ mOpacity: 1, bigLogo: true });
            this.setPageScrollTop(this.properties.pageScrollTop, true);
        }
    },
    methods: {
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
                let bigLogo = scrollTop < (dtHeight / 2);
                if (this.opacity === opacity && this.bigLogo === bigLogo) return;
                this.opacity = opacity;
                this.bigLogo = bigLogo;
                this.setData({ mOpacity: opacity, bigLogo: bigLogo });
            } else {
                this.changeScrollTop || (this.changeScrollTop = Util.throttle(value => this.setPageScrollTop(value, true), 24));
                this.changeScrollTop(scrollTop);
            }
        }
    }
});