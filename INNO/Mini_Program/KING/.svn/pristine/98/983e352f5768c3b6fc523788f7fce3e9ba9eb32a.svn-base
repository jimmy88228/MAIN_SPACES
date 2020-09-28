import WindowBehaviors from "../window/window-behaviors";
Component({
    behaviors: [WindowBehaviors],
    properties: {
      // touchCancel:{
      //     type:Boolean,
      //     value:true,
      //     observer(n,v){
      //       this.setTouchCancel(n);
      //     }
      //  } 
    },
    data: {
        title: "",
        centent: "",
        btn1: { defName: "取消", class: "start" },
        btn2: { defName: "确定", class: "end" },
        btn3: null,
        boxStyle: "opacity: 0; transform: scale(0.8, 0.8);"
    },
    ready(){
        // this.setMask(this.properties.marsk);
    },
    methods: {
        setNoBtn() {
            this.setData({
                btn1: null,
                btn2: null,
                btn3: null
            });
            return this;
        },
        setSingleBtn(btnOption) {
            this.setData({
                btn1: { ...this._getOption(btnOption), defName: "确定", class: "single" },
                btn2: null,
                btn3: null
            });
            return this;
        },
        setTwoBtn(btn1Option, btn2Option) {
            this.setData({
                btn1: { ...this._getOption(btn1Option), defName: "取消", class: "start" },
                btn2: { ...this._getOption(btn2Option), defName: "确定", class: "end" },
                btn3: null
            });
            return this;
        },
        setThreeBtn(btn1Option, btn2Option, btn3Option) {
            this.setData({
                btn1: { ...this._getOption(btn1Option), defName: "取消", class: "start" },
                btn2: { ...this._getOption(btn2Option), defName: "忽略", class: "middle" },
                btn3: { ...this._getOption(btn3Option), defName: "确定", class: "end" }
            });
            return this;
        },
        setTitle(title) {
            this.setData({
                title: title
            });
            return this;
        },
        setCentent(centent) {
            let cententIsArr = false; 
            if(centent instanceof Array){
              cententIsArr = true;
            }
            this.setData({
                centent: centent,
                cententIsArr
            });
            return this;
        },
        onAttached() {
            this.setData({
                boxStyle: "opacity: 1; transform: scale(1, 1); transition: all 300ms ease-in-out;"
            });
        },
        onDetached() {
            this.setData({
                boxStyle: "opacity: 0; transform: scale(0.8, 0.8); transition: all 300ms ease-in-out;"
            });
            return 300;
        },
        _getOption(option) {
            if (!option) {
                return {};
            } else if (typeof option === "string") {
                return { name: option };
            } else if (typeof option === "function") {
                return { tap: option };
            } else {
                return option;
            }
        },
        _getBtnData(num) {
            return num == 1 ? this.data.btn1 : num == 2 ? this.data.btn2 : num == 3 ? this.data.btn3 : null;
        },
        _btnTap(e) {
            let btnData = this._getBtnData(e.target.dataset.btn);
            let temp;
            if (btnData && (temp = btnData.tap)) {
                temp(e);
            } else {
                this.dismiss();
            }
        },
        _getuserinfo(e) {
            let btnData = this._getBtnData(e.target.dataset.btn);
            let temp;
            btnData && (temp = btnData.getUserInfo) && temp(e);
        }
    }
});
