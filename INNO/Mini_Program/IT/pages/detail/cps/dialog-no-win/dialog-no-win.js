import { createBehavior } from "../../../../components/window/anim-helper";
const app = getApp();
Component({
    options: {
        styleIsolation: "apply-shared"
    },
    behaviors: [Behavior.BaseBehavior, createBehavior("fade")],
    properties: {
        activityId: {
            type: Number
        }
    },
    methods: {
        onConfirm() {
            let appId = app.Conf.APPIDS.ESHOP;
            wx.navigateToMiniProgram({
                appId: appId,
                success: () => {
                    this.dismiss();
                    this.addActionLog("JUMP_OUTER", "DETAIL", {
                        keyParam1: 1,
                        keyParam2: this.data.activityId || 0,
                        keyParam3: appId
                    });
                },
                fail: () => {
                    this.addActionLog("JUMP_OUTER", "DETAIL", {
                        keyParam1: 0,
                        keyParam2: this.data.activityId || 0,
                        keyParam3: appId
                    });
                }
            });
        }
    }
});
