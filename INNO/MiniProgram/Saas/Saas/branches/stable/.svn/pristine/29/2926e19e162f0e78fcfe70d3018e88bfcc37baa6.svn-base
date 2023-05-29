// pages/micro_mall/questionnaire/vote/vote.js
// terminationstatechange [Function] 投票终止状态改变 
const app = getApp();
const status = {
  ['vote_text']: { type: 'vote_text'},
  ['vote_image']: { type: 'vote_image'},
  ['date']: { type: 'date'},
  ['location']: { type: 'region'},
} 
Component(app.BTAB({
  properties: {
    label:{
      type:Number,
      value:0
    },
    info: {
      type: Object,
      value: {}
    },
    goodsList: {
      type: Array,
      value: []
    },
    firstStarIndex:{
      type:Number,
      value:-1
    },
    lastStarIndex:{
      type:Number,
      value:-1
    },
  },
  data: {
    region: [],
    arr:[{},{},{}],
    score: 0, // 评分
    tips_msg: "",
    date: "",
  },
  ready(){
    this.arr = [];
    this.terminationstate = true;
  }, 
  methods: {
    loadData(_options){
      let options = _options || {};
      this.options = options; 
      let temp = options;
      this.setData({
        date: temp.default_time
      })
      // let type_val = status[options.vote_type_code] && status[options.vote_type_code].type || ''; 
    },
    handle_select(e){
      let {num = 0, child_id = 0} = e.currentTarget.dataset || {}
      let info = this.data.info || {};
      let status = info.child_list[num].status ? false : true;
      if (info.selection_type == 1) { // 单选
        if (info.child_list[num].status) return
        info.child_list && info.child_list.forEach(item=>{
          item.status = false;
        })
      }
      info.child_list[num].status = status;
      this.triggerEvent("setoptiondata", {
        label: this.properties.label,
        setobj: {
          child_list: info.child_list
        }
      })
      wx.nextTick(() => {
        checkIsTerminationStateChanged.call(this)
      })
      setTipsMsg.call(this, true)
    },
    handleStarTap(e) {
      console.log("点击评论图标", e);
      if (e.detail === this.data.score) return 
      let childList = this.data.info.child_list;
      childList.forEach(item => item.txtData = "")
      this.setData({
        score: e.detail,
        "info.child_list": childList
      })
      if (this.data.tips_msg) this.getData()
    },
    handleUserInput(e) {
      const index = e.currentTarget.dataset.index,
        value = e.detail.value;
      this.triggerEvent("setoptiondata", {
        label: this.properties.label,
        setobj: {
          [`child_list[${index}].txtData`]: value
        }
      })
    },
    getData(e) {
      let data = {}; 
      data.value = [];
      let check = false; 
      let otherMsg = ""; // 其他的错误信息
      if (this.data.info.vote_type_code == 'vote_text' || this.data.info.vote_type_code == 'vote_image'){
        let list = this.data.info.child_list;
        let arr = [];
        list.some(item=>{
          if (item.status){
            if (item.is_other_option != 0 && item.can_edit && !(item.txtData || "").trim()) {
              otherMsg = "其他选项请输入文本"
              return true
            };
            arr.push({
              "voteOptionId": this.data.info.option_id || 0,
              "voteOptionChildId": item.child_id || 0,
              "txtData": item.txtData || ""
            })
          }
        })
        data.value = arr; 
        check = ((this.data.info.is_required != 1 || arr.length>0) && !otherMsg) ? true : false;
      } else if (this.data.info.vote_type_code == 'vote_star') {
        const score = this.data.score;
        let info = this.data.info || {};
        let list = info.child_list || [];
        data.value = list.filter((v,i) => i + 1 == score);
        data.value.length && (data.value[0] = {
          voteOptionId: info.option_id || 0,
          voteOptionChildId: data.value[0].child_id || 0,
          txtData: data.value[0].txtData || ""
        });
        let notRequired = info.is_required != 1,
          userAlreadyVoted = data.value.length > 0,
          textAreaIsActivated = info.need_question_num > 0 && score <= info.need_question_num,
          userAlreadyInputReason = (data.value && data.value[0] && data.value[0].txtData || "").trim();
        if (notRequired) check = true
        else if (userAlreadyVoted && !textAreaIsActivated) check = true
        else if (userAlreadyVoted && textAreaIsActivated && userAlreadyInputReason) check = true
        else if (userAlreadyVoted && textAreaIsActivated && !userAlreadyInputReason) {
          otherMsg = "请填写原因"
          check = false;
        }
        else check = false;
      }
      data.type = this.data.info.vote_type_code;
      data.id = this.data.info.option_id || 0;
      data.label = this.data.label || 0;
      setTipsMsg.call(this, check, otherMsg)
      return {
        check,
        data,
      }
    },
    _noFn: () => {},
  }
}))

function checkIsIncludedCheckedTerminationOptions() {
  const {child_list = []} = this.data.info || {};
  let included = false;
  child_list.some(option => {
    if (option.is_stop && option.status) return included = true
  })
  return included
}

function checkIsTerminationStateChanged() {
  let terminationstate = this.terminationstate
  if (checkIsIncludedCheckedTerminationOptions.call(this) != terminationstate) {
    this.terminationstate = !terminationstate
    const {info, label} = this.data
    this.triggerEvent("terminationstatechange", {vote_type_code: info.vote_type_code, label, status: terminationstate ? 0 : 1});
  }else { // else是专门为GOSO定制的，原本不需要每次都triggerEvent，只有变化的时候才触发；不过这里没办法，每次触发一下吧
    const {info, label} = this.data
    this.triggerEvent("terminationstatechange", {vote_type_code: info.vote_type_code, label, status: terminationstate ? 1 : 0});
  }
}
function setTipsMsg(valid, otherMsg = "") {
  if(otherMsg) return this.setData({tips_msg: otherMsg});
  else if(valid) return this.setData({ tips_msg: ""});
  const code = this.data.info.vote_type_code || '';
  const msgRef = {
    vote_text: "请至少选择一项",
    vote_image: "请至少选择一项",
    vote_star: "请进行评分"
  }
  this.setData({
    tips_msg: msgRef[code]
  })
}