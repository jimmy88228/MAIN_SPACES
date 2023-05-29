// pages/micro_mall/questionnaire/upload/upload.js
const app = getApp(); 
import WxApi from "../../../../common/helper/wx-api-helper.js";
Component(app.BTAB({ 
  properties: {
    info: {
      type: Object,
      value: {}, 
    },
    label: {
      type: Number,
      value: 0, 
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    current_pics_arr:[],
    tips_msg: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseImage(e){
      if (this.data.current_pics_arr.length==0){
        chooseImage.call(this); 
      }else{
        deleteFnc.call(this); 
      }
    },
    previewImage(e){
      const path = e.currentTarget.dataset.path || "";
      path && WxApi.previewImage({
        urls: [path]
      })
    },
    getData(e) {
      // console.log(this.data);
      let pics = this.data.current_pics_arr || [];
      let check = (this.data.info.is_required != 1 || (pics && pics.length > 0) )? true : false;
      let data = { value: pics[0] || '', type: this.data.info.vote_type_code || '', id: this.data.info.option_id || 0 };
      data.label = this.data.label || 0;
      setTipsMsg.call(this, check);
      return {
        check,
        data
      } 
    }
  }
}))


function chooseImage(){
  let that = this;
  WxApi.chooseImage({
    count: 1,
    // sizeType: ['compressed'],
    sourceType: ['album','camera'], 
  }).then(res=>{
      console.log(res)
      let tempFilePaths = res.tempFilePaths;
      this.setData({
        current_pics_arr: tempFilePaths
      });
      setTipsMsg.call(this, true);
    console.log('current_pics_arr', this.data.current_pics_arr)
  }).catch(e=>{
    console.log('catch', e) 
  })
}

function deleteFnc(){ 
  this.dialog = this.dialog || this.selectComponent("#dialog");
  this.dialog.setTitle("提示");
  this.dialog.setTouchCancel(true);
  this.dialog.setCentent("确定要删除图片吗");
  this.dialog.show();
  let that = this;
  this.dialog.setTwoBtn(
  {
    name: "取消",
    tap: function () {
      that.dialog.dismiss();
    }
  },
  {
    name: "确认",
    tap: function () {
      that.setData({
        current_pics_arr: []
      })
      that.dialog.dismiss();
    }
  });
}

function setTipsMsg(valid) {
  if(valid) return this.setData({ tips_msg: ""});
  const code = this.data.info.vote_type_code || '';
  const msgRef = {
    image: "请上传图片"
  }
  this.setData({
    tips_msg: msgRef[code]
  })
}