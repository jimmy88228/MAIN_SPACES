import WindowBehaviors from "../window/window-behaviors.js";

const ANIM = {
    CENTER: [
        "opacity: 0; transform: scale(0.8, 0.8);",
        "opacity: 1; transform: scale(1, 1); transition: all 300ms ease-in-out;", ["opacity: 0; transform: scale(0.8, 0.8); transition: all 300ms ease-in-out;", 300],
    ]
}

const app = getApp();

Component({
    behaviors: [WindowBehaviors],
    data: {
        boxStyle: ANIM.CENTER[0]
    },
    methods: {
        onAttached() {
            this.setData({
                boxStyle: ANIM.CENTER[1]
            });
        },
        onDetached() {
            this.setData({
                boxStyle: ANIM.CENTER[2][0]
            });
            return ANIM.CENTER[2][1];
        },
    }
})