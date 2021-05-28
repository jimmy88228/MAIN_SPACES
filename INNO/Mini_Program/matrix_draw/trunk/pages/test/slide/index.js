const app = getApp()
Page.BasePage({
    startX: 0, //开始偏移的X
    startY: 0, //开始偏移的Y
    translateX: 0, //保存的X偏移
    translateY: 0, //保存的Y偏移
    touchEndY: 0,
    maxWidth: 0, //滑动的最大宽度
    maxHeight: 0, //滑动的最大高度
    startTime: 0,
    onShow() {
    },
    onPageScroll(e) {
        // console.log("e",e);
        let scrollTop = e.scrollTop || 0;
        // textAnimate.call(this,scrollTop);
        // keepScrollValue.call(this,scrollTop);
    },
    touchstart(e) {
        this.clientY = e.touches[0].clientY;
        // this.dargDom.style.WebkitTransition = this.dargDom.style.transition = '';
        this.startX = this.translateX;
        this.startY = this.translateY;
        this.startTime = Date.now();
    },
    touchmove(e) {
        this.translateY = e.touches[0].clientY;
        this.touchEndY = e.touches[0].clientY;
        this.translateY = (-1) * (this.translateY - this.clientY) * 0.4;
        this.setData({
            animateStyle: `transform: translate(0, ${this.translateY}px);`
        })
    },
    touchend(e) {
        console.log("touchend", e);
        let distanceY = this.touchEndY - this.clientY,
            timeDis = Date.now() - this.startTime,  //时间差
            speed = (distanceY / timeDis) * 100;
        // 惯性
        this.translateY += speed;
        this.translateY = 0;
        // 添加贝塞尔曲线
        this.setData({
            animateStyle: `transform: translate(0, ${this.translateY}px);transition: transform 500ms cubic-bezier(0.1, 0.57, 0.1, 1)`
        })
    }
});
function reset() {
    if (this.touchRelease && this.scrollRelease)
        this.setData({
            animateStyle: "transform: translate(0,0); transition: all 300ms;"
        })
}
function keepScrollValue(value) {
    this.scroll = this.scroll || 0;
    this.timer2 && clearTimeout(this.timer2);
    this.timer2 = setTimeout(() => {
        // let animateStyle = ""
        // if(this.scroll < value){//下滑

        // }else{//上滑
        //     console.log("上滑")
        // }
        // this.setData({
        //     animateStyle: `transform: translate(0, 0);transition transform .35s;`
        // })
        this.scroll = value;
        this.shake = this.varData;
        console.log("停住", this.scroll)
    }, 100);
}
function textAnimate(scrollTop) {
    this.scroll = this.scroll || 0;
    let differ = (scrollTop - this.scroll);
    let mult = ((differ / 100) * 100);
    console.log("差值mult", mult);
    let shake = this.shake ? this.shake + mult : mult;
    this.varData = shake;
    // let multStr = mult > 50 ?  "50%" : mult < -50 ? "-50%" : mult + "%";
    // console.log("差值", differ);
    // console.log("mult", multStr);
    this.setData({
        animateStyle: `transform: translate(0,${shake}px);`
    })
}