// const { default: PageJump } = require("../../../../helper/page-jump");
import PageJump from '../../../../helper/page-jump.js'
module.exports = Behavior({
  behaviors: [],
  properties: {
  },
  data: {
    // myBehaviorData: 'my-behavior-data'
  },
  created: function () {
    console.log('[my-behavior] created')
  },
  attached: function () {
    console.log('[my-behavior] attached')
  },
  ready: function () {
    console.log('[my-behavior] ready')
  },

  methods: {
    jump(e){
      console.log('jump',e);
      let dataset = e.currentTarget.dataset||{};
      let link = dataset.link;
      PageJump(link||{})
      // let link = e.link||{};
      // let code=e.code||"",sn = e.sn||"",name=e.name||"",typeName=e.typeName||"";
      // let params = init.call(this);

      return
      if(code == 'qmenu'){
        params.func_type = "TOJUMP";
        params.related_id = link.sn;
        
      }
      else if(code == 'pageUrl'){

      }
      else if(code == 'goodsUrl'){

      }
      else if(code == 'goodsCatUrl'){

      }
      else if(code == 'goodsVcatUrl'){

      }
      else if(code == 'goodsUrl'){

      }
    }
  }
})

function init(){
   let params = {
     extend_content:"",
     func_type:"",
     goods_id:"",
     img_patah:"",
     item_id:"",
     link_url:"",
     module_id:"",
     page_id:"",
     related_id:"",
     sort:"",
     tag:"",
     update_time:"",
   }
   return params;
  //  params.func_type = 
} 