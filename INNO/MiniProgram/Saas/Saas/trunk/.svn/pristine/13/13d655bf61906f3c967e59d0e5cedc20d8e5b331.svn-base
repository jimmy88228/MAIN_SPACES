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
          initDate.call(this, n)
        }
      }
    },
  },
  data: {
    region:[],
    code:"",
    dateTimePicker: {
      placeholder: "请选择日期",
      date: "",
      disabled: false,
      startDate: "1990-01-01 00:00",
      endDate: "2022-02-18 15:55"
    },
    inputFocus: "",
    tips_msg: "",
  },
  methods: {
    loadData(_options){
      let options = _options || {};
      this.options = options;
      let info = options;
      let type_val = status[options.vote_type_code] && status[options.vote_type_code].type || '';
      // info.type_val = type_val; 
      this.setData({
        info:info,
        // type_val,
        // is_required: options.is_required || 0
      })
    },
    handle_input(e){
      let value = e.detail.value || '';
      check.call(this, value);
      this.setData({
        input_val:value
      })
    },
    handle_focus(e){
      this.setData({ inputFocus: true})
    },
    handle_blur(e){
      let valid = this.data.info.is_required ? e.detail.value.trim() : true
      setTipsMsg.call(this, valid)
      if (this.data.info && this.data.info.vote_type_code == 'text')this.setData({inputFocus: false})
    },
    handle_change(e) {
      let dataset = e.currentTarget.dataset || {};
      let type = dataset.type || ''; 
      this.setData({
        [`${type}`]: e.detail.value || [],
        code: e.detail.code || '',
        showMsg: true,
      });
      this.data.info.is_required && setTipsMsg.call(this,true)
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
        data.value = this.data.code;
        checkBool = (this.data.info.is_required != 1 || data.value) ? true : false; 
      }
      if (code == 'date') {
        data.value = this.data.showMsg && this.data.dateTimePicker.date || '';
        checkBool = (this.data.info.is_required != 1 || (data.value && this.data.showMsg)) ? true : false;
      } 
      if (code == 'text' || code == "phone"  || code =="email"){
        checkBool = check.call(this, this.data.input_val);
        data.value = this.data.input_val || '';
      }
      data = { value: data.value || '', type: this.data.info.vote_type_code || '', id: this.data.info.option_id || 0 };
      data.label = this.data.label || 0;
      setTipsMsg.call(this, checkBool)
      return {
        check: checkBool,
        data
      }
    },
    onDateTimePickerChange(e) {
      console.log("选择的日期", e)
      let dateString = e.detail.dateString || e.detail.value || ""
      if (dateString) {
        this.setData({
          'dateTimePicker.date': dateString,
          showMsg: true
        })
        this.data.info.is_required && setTipsMsg.call(this, true)
      }
    }
  }
}))

function initDate(info){
  console.log("timepicker-initDate-info", info)
  let {default_time, from_time, to_time} = info;
  let formatFn = (date, transfer = false) => transfer ? MyDate.format(new Date(date), "yyyy-MM-dd") : date;
  this.setData({
    'dateTimePicker.date': default_time ? formatFn(default_time, true) : formatFn(to_time),
    'dateTimePicker.startDate': formatFn(from_time),
    'dateTimePicker.endDate': formatFn(to_time),
    showMsg: default_time ? true : false
  })
  console.log(this.data.dateTimePicker)
}

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

function setTipsMsg(valid) {
  if(valid) return this.setData({ tips_msg: ""});
  const code = this.data.info.vote_type_code || '';
  const msgRef = {
    text: "请输入文字",
    phone: "请输入正确的手机号码",
    email: "请输入正确的邮箱地址",
    location: "请选择地址",
    date: "请选择日期"
  }
  this.setData({
    tips_msg: msgRef[code]
  })
}