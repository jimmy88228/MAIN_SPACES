import AnimBehavior from "../window/anim-helper";
import Smm from "../../common/helper/show-msg-helper";
import PosterUtil from "../../common/utils/poster-util";
import Wxp from "../../common/support/tools/wx-api-promise";
import SIH from "../../common/helper/sys-infos-helper";

const app = getApp();
const qrCode = app.Conf.MINI_PROGRAM_QRCODE;
const DefAnims = {
    enterTo: "transition: all 300ms ease-in-out;",
    leaveTo: "opacity: 0; transform: translate(-50%, -50%) scale(0.8, 0.8); transition: all 300ms ease-in-out;",
    duration: 300
};
Component({
    options: {
        styleIsolation: "apply-shared"
    },
    behaviors: [Behavior.BaseBehavior, AnimBehavior],
    properties: {
        mode: {
            type: String,
            value: "list",//list,detail
        },
    },
    data: {
        qrCode: qrCode
    },
    lifetimes: {
        created() {
            Object.defineProperties(this, {
                dialog: { get: () => this.findView("#dialog", "useDialog") }
            });
        }
    },
    methods: {
        onSavePosterTap() {
            this.createSelectorQuery()
                .select('#canvas-poster')
                .fields({ node: true, size: true })
                .exec((res) => {
                    let canvas = res[0].node;
                    let width = res[0].width;
                    let height = res[0].height;
                    Smm.showLoading({ title: "保存中..." });
                    return this.draw(canvas, width, height)
                        .then(() => this.authorize("scope.writePhotosAlbum"))
                        .then(() => this.save(canvas))
                        .then(() => {
                            this.dismiss();
                            console.log(path);
                            Smm.showToast({ title: "成功保存到相册" });
                        })
                        .finally(() => Smm.hideLoading())
                });
        },
        draw(canvas, width, height) {
            let info = this.info;
            let ctx = canvas.getContext("2d");

            //放大画布，太小了容易模糊
            let ratio = SIH.screenWidth * SIH.pixelRatio / width;//转为屏幕宽度像素点
            canvas.width = width * ratio;
            canvas.height = height * ratio;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(ratio, ratio);
            return PosterUtil.draw({
                canvas,
                ctx,
                rect: { x: 0, y: 0, width, height },
                backgroundColor: "#fff",
                nodes: createPosterData(info)
            }).finally(() => ctx.restore())
                .catch(() => {
                    Smm.showToast({ title: "海报生成失败" });
                    return Promise.reject();
                });
        },
        authorize(name) {
            return Wxp.getSetting().then(res => {
                if (!(name in res.authSetting))
                    return Wxp.authorize({ scope: name })
                        .catch(() => {
                            Smm.showToast({ title: "申请“保存到相册”权限被拒绝" });
                            return Promise.reject();
                        });
                if (res.authSetting[name])
                    return;
                this.animStyle = null;
                this.dismiss()
                this.dialog.setTitle("权限申请")
                    .setContent("申请“保存到相册”权限被拒绝\n请前往授权")
                    .setTwoBtn(null, {
                        name: "去授权",
                        tap: (_, d) => {
                            d.dismiss();
                            Wxp.openSetting();
                        }
                    }).show()
                return Promise.reject();
            });
        },
        save(canvas) {
            return PosterUtil.canvasToAlbum({ canvas: canvas, fileType: "jpg" }).catch(() => {
                Smm.showToast({ title: "保存到相册失败" });
                return Promise.reject();
            });
        },
        showData(info, animParam) {
            this.animStyle = createAnim(animParam);
            this.info = info;
            this.setData({ info: info });
            this.show();
            return this;
        },
        attachedView(delay) {
            this.onAttached && this.onAttached();
            let style = DefAnims;
            this.showAnim(style, style.delay || delay);
        },
        detachedView() {
            this.onDetached && this.onDetached();
            return this.hideAnim(DefAnims);
        }
    }
});
function createAnim(animParam) {
    if (!animParam)
        return null;
    let { x, y, w, h } = animParam;
    return {
        delay: 40,
        enter: `top: ${y}px; left: ${x}px; width: ${w}px; height: ${h}px; opacity: 0.5; transform: translate(0, 0);`,
        enterActive: "transition: all 400ms ease-out;",
        enterTo: "",
        leave: "",
        leaveActive: "transition: all 400ms ease-out;",
        leaveTo: `top: ${y}px; left: ${x}px; width: ${w}px; height: ${h}px; opacity: 0.3; transform: translate(0, 0);`,
        duration: 420
    };
}

function createPosterData(obj) {
    let title = obj.title;
    title && (title = title.replace(/<[^>]+>/g, ""));
    return [{
        type: "image",
        src: obj.picture,
        mode: "aspectFit",
        x: 0,
        y: 0,
        width: 550,
        height: 550,
        backgroundColor: "#efefef"
    }, {
        type: "image",
        src: qrCode,
        x: 30,
        y: 580,
        mode: "widthFix",
        width: 110
    }, {
        type: "text",
        text: title,
        color: '#000',
        fontSize: 24,
        x: 170,
        y: 580,
        width: 330,
        lineHeight: 35,
        letterSpacing: 1,
        lineClamp: 3,
        textOverflow: "ellipsis",
        fontWeight: "bold",
        fontFamily: "'HelveticaNeueLT Std Blk Cn'"
    }, {
        type: "text",
        text: `抽签码  ${obj.code}`,
        color: '#000',
        fontSize: 24,
        x: 170,
        y: 715,
        width: 330,
        letterSpacing: 1,
        lineClamp: 1,
        fontWeight: "bold",
        fontFamily: "'HelveticaNeueLT Std Blk Cn'"
    }];
}