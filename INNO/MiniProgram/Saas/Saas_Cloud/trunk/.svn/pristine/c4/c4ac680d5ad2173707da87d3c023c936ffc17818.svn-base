import WindowBehaviors from "../window/window-behaviors";
import SMH from "../../../../common/helper/show-msg-helper.js";
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
      isSlotTitle:{
          type:Boolean,
          value:false
      },
      isSlotContent:{
          type:Boolean,
          value:false
      },
    },
    options:{
        multipleSlots:true
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
                btn1: {  defName: "确定", class: "single", canClick: true,  ...this._getOption(btnOption) },
                btn2: null,
                btn3: null
            });
            return this;
        },
        setTwoBtn(btn1Option, btn2Option) {
            this.setData({
                btn1: {  defName: "取消", class: "start", canClick: true, ...this._getOption(btn1Option) },
                btn2: {  defName: "确定", class: "end", canClick: true, ...this._getOption(btn2Option) },
                btn3: null
            });
            return this;
        },
        setThreeBtn(btn1Option, btn2Option, btn3Option) {
            this.setData({
                btn1: { defName: "取消", class: "start", canClick: true, ...this._getOption(btn1Option) },
                btn2: { defName: "忽略", class: "middle", canClick: true, ...this._getOption(btn2Option) },
                btn3: { defName: "确定", class: "end", canClick: true, ...this._getOption(btn3Option) }
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
            let btn = e.target.dataset.btn;
            let btnData = this._getBtnData(btn);
            let temp;
            if (btnData && (temp = btnData.tap)) {
                if(btnData.canClick){
                    temp(e);
                    let key = `btn${btn}.canClick`;
                    this.data[`btn${btn}`] && this.setData({ [key]: false })
                    setTimeout(()=>{
                        this.data[`btn${btn}`] && this.setData({ [key]: true })
                    }, 1500);
                } else {
                    SMH.showToast({
                      title: '请勿频繁操作',
                    })
                }
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
