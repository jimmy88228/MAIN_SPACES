import { createBehavior } from "../../../../components/window/anim-helper";
function createCt(obj) {
    if (!obj) {
        return null;
    } else if (typeof obj === "string") {
        return { title: obj };
    } else {
        return obj;
    }
}
Component({
    options: {
        styleIsolation: "apply-shared"
    },
    behaviors: [Behavior.BaseBehavior, createBehavior("fade")],
    properties: {
        content: {
            type: [Object, String],
            observer(opt) {
                this.setData({ initCt: createCt(opt) });
            }
        }
    },
    data: {
        initCt: null,
        ct: null
    },
    methods: {
        setContent(opt) {
            this.setData({
                ct: createCt(opt)
            });
            return this;
        },
        onConfirm() {
            this.dismiss();
        }
    }
});
