import WindowBehaviors from "./window-behaviors";
export const Anims = {
    "fade": {
        enterTo: "transition: all 300ms ease-in-out;",
        leaveTo: "opacity: 0; transform: scale(0.8, 0.8); transition: all 300ms ease-in-out;",
        duration: 300
    },
    "slide-top": {
        enterTo: "transition: transform 300ms ease-in-out;",
        leaveTo: "transform: translateY(-100%); transition: transform 300ms ease-in-out;",
        duration: 300
    },
    "slide-bottom": {
        enterTo: "transition: transform 300ms ease-in-out;",
        leaveTo: "transform: translateY(100%); transition: transform 300ms ease-in-out;",
        duration: 300
    },
};

const AnimBehavior = Behavior({
    behaviors: [WindowBehaviors],
    methods: {
        showAnim(styles, delay) {
            if (styles.enter || styles.enterActive) {//高级模式
                this.setData({ mainStyle: `${styles.enterActive || ""} ${styles.enter || ""}` });
            } else if (!this.initShowed) {
                this.initShowed = true;
                this.setData({ mainStyle: `${styles.leaveTo || ""} transition:none;` });
            }
            //简洁模式
            this.promiseDelay(delay).then(() => {
                this.setData({ mainStyle: `${styles.enterActive || ""} ${styles.enterTo || ""}` });
            });
        },
        hideAnim(styles) {
            if (styles.leave || styles.leaveActive) {//高级模式
                this.setData({ mainStyle: `${styles.leaveActive || ""} ${styles.leave || ""}` });
                this.promiseDelay(25).then(() => {
                    this.setData({ mainStyle: `${styles.leaveActive || ""} ${styles.leaveTo || ""}` });
                });
            } else {//简洁模式
                this.setData({ mainStyle: styles.leaveTo || "" });
            }
            return styles.duration;
        },
    }
});

export function createBehavior(anim) {
    let styles;
    if (typeof anim == "string") {
        styles = Anims[anim];
    } else {
        styles = anim;
    }
    return Behavior({
        behaviors: [AnimBehavior],
        methods: {
            attachedView(delay) {
                this.onAttached && this.onAttached();
                this.showAnim(styles, styles.delay || delay);
            },
            detachedView() {
                this.onDetached && this.onDetached();
                return this.hideAnim(styles);
            }
        }
    });
};

export default AnimBehavior;
