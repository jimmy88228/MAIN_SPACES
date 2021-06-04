import { createBehavior } from "../window/anim-helper";
Component({
    behaviors: [createBehavior("fade")],
    properties: {
        title: {
            type: String,
            value: "",
            observer(val) {
                this.setTitle(val);
            }
        },
        content: {
            type: String,
            value: "",
            observer(val) {
                this.setContent(val);
            }
        }
    },
    data: {
        _title: "",
        _content: "",
        custom: false,
        btn1: { defName: "取消", class: "start" },
        btn2: { defName: "确定", class: "end" },
        btn3: null
    },
    methods: {
        setCustom(custom = true) {
            this.setData({
                custom: custom
            });
            return this;
        },
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
                _title: title
            });
            return this;
        },
        setContent(content) {
            this.setData({
                _content: content
            });
            return this;
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
                temp(e, this);
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
