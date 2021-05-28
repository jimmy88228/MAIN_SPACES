
const jumpKeyframes = [
    { offset: 0, scale: [1.0, 1.0] },
    { offset: 0.17, scale: [1.1, 1.1] },
    { offset: 0.50, scale: [0.9, 0.9] },
    { offset: 0.68, scale: [1.05, 1.05] },
    { offset: 0.92, scale: [0.95, 0.95] },
    { offset: 1, scale: [1.0, 1.0] },
]

const errorKeyframes = [
    { translateX: 0, backgroundColor: 'rgba(0, 0, 0, 0)' },
    { translateX: -6, backgroundColor: 'rgba(0, 0, 0, 0.02)' },
    { translateX: 5, backgroundColor: 'rgba(0, 0, 0, 0.04)' },
    { translateX: 3, backgroundColor: 'rgba(0, 0, 0, 0.06)' },
    { translateX: -3, backgroundColor: 'rgba(0, 0, 0, 0.08)' },
    { translateX: 4, backgroundColor: 'rgba(0, 0, 0, 0.1)' },
    { translateX: 2, backgroundColor: 'rgba(0, 0, 0, 0.12)' },
    { translateX: 6, backgroundColor: 'rgba(0, 0, 0, 0.14)' },
    { translateX: -4, backgroundColor: 'rgba(0, 0, 0, 0.11)' },
    { translateX: -1, backgroundColor: 'rgba(0, 0, 0, 0.08)' },
    { translateX: -3, backgroundColor: 'rgba(0, 0, 0, 0.05)' },
    { translateX: 6, backgroundColor: 'rgba(0, 0, 0, 0.02)' },
    { translateX: 0, backgroundColor: 'rgba(0, 0, 0, 0)' },
]


const Anims = {
    jumpScale(target, selector, callback) {
        target.animate(selector, jumpKeyframes, 500, () => {
            target.clearAnimation(selector, { scale: true });
            callback && callback();
        });
    },
    error(target, selector, callback) {
        target.animate(selector, errorKeyframes, 300, () => {
            target.clearAnimation(selector, { translate: true, rotate: true });
            callback && callback();
        });
    }
};

wx.MyAnims = Anims;
export default Anims;