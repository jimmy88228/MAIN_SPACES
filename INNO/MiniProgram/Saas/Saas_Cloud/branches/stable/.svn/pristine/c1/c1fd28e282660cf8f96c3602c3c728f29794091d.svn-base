// pages/micro_mall/employee_center/distribution_service/rank/r_list/r_list.js
const app = getApp();
Component(app.BTAB({
  properties: {
    list:{
      type:Array,
      value:[],
    },
    empty:{
      type:Boolean,
      value:false,
    }, 
  },
  ready(){
    let rank_fst = this.data.brand_info.default_icon_url + 'rank_fst.png'
    let rank_snd = this.data.brand_info.default_icon_url + 'rank_snd.png'
    let rank_trd = this.data.brand_info.default_icon_url + 'rank_trd.png'
    this.setData({
      rank_fst,
      rank_snd,
      rank_trd
    })
  },
  data: {
    initH:350,
    high_light:"#FF7200",
    // listData:[
    //   {'rank':1,'name':'路人甲','address':'广州萝岗万达广场店','sales':441},
    //   {'rank':2,'name':'路人甲2','address':'广州萝岗万达广场万达广场店','sales':442},
    //   {'rank':3,'name':'路人甲3','address':'广州萝岗万达广场万达广场店广场店场店','sales':443},
    //   {'rank':4,'name':'路人甲4','address':'广州萝岗万达广场万达广场店广场店场店','sales':444},
    // ]
  },
  methods: {
    paging(e){
      this.triggerEvent('paging',{});
    }
  }
}))
