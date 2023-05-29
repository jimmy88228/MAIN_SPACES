// pages/micro_mall/questionnaire/vote/vote.js
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
      value: {}, 
    }
  }, 
  data: {
    region: [],
    arr:[{},{},{}]
  },
  ready(){
    this.arr = [];
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
      let dataset = e.currentTarget.dataset || {};
      let num = dataset.num || 0;
      let child_id = dataset.child_id || 0;
      let info = this.data.info || {};
      let status = info.child_list[num].status ? false : true;
      if (info.selection_type == 1) {
        if (info.child_list[num].status) return
        info.child_list && info.child_list.forEach(item=>{
          item.status = false;
        })
      }
      info.child_list[num].status = status;  
      this.setData({
        info
      })
      console.log('num', num,child_id,this.data.info);
    },
    getData(e) {
      let data = {}; 
      data.value = [];
      let check = false;  
      if (this.data.info.vote_type_code == 'vote_text' || this.data.info.vote_type_code == 'vote_image'){
        let list = this.data.info.child_list;
        let arr = [];
        list.forEach(item=>{
          if (item.status){
            arr.push({
              "voteOptionId": this.data.info.option_id || 0,
              "voteOptionChildId": item.child_id || 0,
              "txtData": ""
            })
          }
        })
        data.value = arr; 
        check = (this.data.info.is_required != 1 || arr.length>0) ? true : false; 
      }
      data.type = this.data.info.vote_type_code;
      data.id = this.data.info.option_id || 0;
      data.label = this.data.label || 0;
      return {
        check,
        data
      }
    }
  }
}))
