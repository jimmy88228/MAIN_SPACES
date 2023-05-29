// pages/micro_mall/questionnaire/survey/survey.js
const app = getApp();
const status = {
  ['text']: { type: 'text', regExp: /\S+/},
  ['phone']: { type: 'phone', regExp: /^\d{11}$/},
  ['email']:{type:'text',regExp: /\@{1}/},
}
import MyDate from '../../../../common/support/utils/date-util.js';

Component(app.BTAB({
  properties: {
    label: {
      type: Number,
      value: 0
    },
    info: {
      type: Object,
      value: {},
      observer:function (n,o){
        if (n && n.vote_type_code=='date'){
          this.changeTime(n);
        }
      }
    },
  },
  data: {
    region:[],
    code:[],
    isShowPicker:false,
    mode: "YMDhm",
    dataPicker: { type: "YMDhm" },
    date:0
  },
  methods: {
    loadData(_options){
      let options = _options || {};
      this.options = options;
      // options.vote_type_code = 'phone';
      // options.title = '测试1';
      // options.child_title = '测试2';
      // options.is_required = 1;

      let info = options;
      let type_val = status[options.vote_type_code] && status[options.vote_type_code].type || '';
      // info.type_val = type_val; 
      this.setData({
        info:info,
        // type_val,
        // is_required: options.is_required || 0
      })
    }, 
    changeTime(obj={}){
      let arr = [];
      if (obj.default_time){
        obj.default_time = MyDate.format(new Date(obj.default_time), "yyyy-MM-dd HH:mm");
        obj.default_timeVal = new Date(obj.default_time).getTime();
      }
      if (obj.from_time){
        // obj.from_time = MyDate.format(new Date(obj.from_time), "yyyy-MM-dd HH:mm");
        obj.from_time = parseInt(MyDate.format(new Date(obj.from_time), "yyyy"));
        arr.push(obj.from_time)
      }
      if (obj.to_time){
        obj.to_time = parseInt(MyDate.format(new Date(obj.to_time), "yyyy"));
        arr.push(obj.to_time)
      }
      this.setData({
        infoObj:obj,
        arr
      })
    },
    handle_input(e){
      let dataset = e.currentTarget.dataset || {};
      let value = e.detail.value || '';
      // let type = this.data.typeVal || dataset.type || '';
      // if (!type)return
      check.call(this, value);
      this.setData({
        input_val:value
      })
    },
    handle_blur(e){
      if (this.data.checked)return
      this.setData({
        checked : true
      }) 
    },
    handle_change(e) {
      let dataset = e.currentTarget.dataset || {};
      let type = dataset.type || ''; 
      if (type == 'date'){
        let isShowPicker = this.data.isShowPicker || false; 
        isShowPicker = !isShowPicker;
        this.setData({
          isShowPicker,
        })
        return
      }
      this.setData({
        [`${type}`]: e.detail.value || [],
        code: e.detail.code || '',
        showMsg: true,
      });
    },
    close(e){
      this.setData({
        input_val:""
      });
      check.call(this,'')
    },
    getData(e) {
      let code = this.data.info.vote_type_code || '';
      let data = {};
      let checkBool = false;
      if (code == 'location') {
        data.value = this.data.code || [];
        checkBool = (this.data.info.is_required != 1 || data.value) ? true : false; 
      }
      if (code == 'date') {
        data.value = this.data.date || '';
        checkBool = (this.data.info.is_required != 1 || data.value) ? true : false; 
      } 
      if (code == 'text' || code == "phone"  || code =="email"){
        checkBool = check.call(this, this.data.input_val);
        data.value = this.data.input_val || '';
      } 
      data = { value: data.value || '', type: this.data.info.vote_type_code || '', id: this.data.info.option_id || 0 };
      data.label = this.data.label || 0;
      return {
        check: checkBool,
        data
      }
    },

    datePickerCancellEvent: function (e) {
      this.setData({
        isShowPicker: false
      })
    },
    datePickerOkEvent: function (e) {
      this.setData({
        isShowPicker: false
      })
      let mode = e.detail.data.type;
      let date = e.detail.date;
      console.log('看看',e, mode,date)
      switch (mode) {
        case "YMDhm":
          {
            let temp = MyDate.format(new Date(date || 0), "yyyy-MM-dd HH:mm"); 
            this.setData({
              date: temp,
              showMsg: true
            })
            break;
          }
        default:
        break
      }
      
    },
  }
}))

function check(value=''){
  let type = '';
  let test = false; 
  if (this.data.info.is_required == 1 && (this.data.info.vote_type_code == 'phone' || this.data.info.vote_type_code == 'email' )) {
    type = this.data.info.vote_type_code || '';
    let regExp = status[type] && status[type].regExp;
    if (!regExp) return
    test = regExp.test(value || ''); 
  } else if (this.data.info.is_required == 1){
    test = /\S+/.test(value || '');
  }else{
    test = true
  }

  if (test && !this.data.testReg) {
    this.setData({
      testReg: true,
    })
  } else if (!test && this.data.testReg) {
    this.setData({
      testReg: false
    })
  }
  return test
}
