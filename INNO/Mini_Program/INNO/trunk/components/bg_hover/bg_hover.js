import WindowBehaviors from "../../components/ui/cps/window/window-behaviors";
// import WxApi from "../../../common/helper/wx-api-helper.js"
// import SIH from "../../../common/helper/sys-infos-helper"
const app = getApp();

Component(
    app.BTAB({
        behaviors: [WindowBehaviors],
        properties: {
            allData: Object
        },
        data: {
            boxStyle: "transform: translate(0,110%); transition: all 300ms ease-in-out;",
            iconUrl: app.Conf.ICON_URL,
            canSave: false,
            //分销
            staffInfo: {

            }
        },
        attached() {
        },
        detached() {
        },
        methods: {
            onAttached() {
                this.setData({
                    boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
                });
            },
            onDetached() {
                this.setData({
                    boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
                });
                return 300;
            }
        }
    })
);