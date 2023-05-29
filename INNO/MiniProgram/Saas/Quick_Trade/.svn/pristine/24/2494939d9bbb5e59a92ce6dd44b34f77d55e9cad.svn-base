const PATH = {
  'quick':'./module/quick',
  'list':'./module/list',
};
const App = getApp();
Component(App.BC({
  options: {
    multipleSlots: true
  },
  relations: {
    './module/quick': {
      type: 'child',
      linked: function() {
        cleanTimeOutJob.call(this,'getFirstQueryId',getQueryInfo,this);
      }, 
    },
    './module/list': {
      type: 'child', 
      linked: function() {
        cleanTimeOutJob.call(this,'getQueryId',getFirstQuickNode,this);
      }, 
    },

  },
  properties: {
    cur_key:{
      type:String,
      value:""
    },
    maxFindLen:{
      type:Number,
      value:1, 
    },
    current:{
      type:Number,
      value:0, 
    }, 
  }, 
  data: {
  },  
  methods: { 
    scroll(e) {
      let dt = e.detail||{};
      let top = dt.scrollTop||0;
      let nodes = getNodes.call(this,PATH['list']);
      let pre = this.data.current;
      nodes.some((item, index, self) => {
        let contentH = item.top + item.height;
        console.log(index, item.data.key,item,top,contentH,item.top);
        if (top < contentH && top >= item.top) { 
          if (pre != index) {
            nodes[pre].setActivivate(false);
            nodes[index].setActivivate(true);
            updateStatus.call(this,index);
          }
          return true;
        }
      })
    },
    touchMove(e) {
      let tc = e.touches||[];
      let tc_i = tc[0] ||{};
      let y = tc_i.pageY ||0;
      if(!this.firstQuickNode || !this.firstQuickNode.height)return;
      let dtY = y - (this.firstQuickNode && this.firstQuickNode.top || 0);
      let pre = this.data.current;
      let index = parseInt(dtY/this.firstQuickNode.height);
      if(pre<0 || index<0 || index>(this.properties.maxFindLen - 1))return
      if(!this.data.showIndex){
        this.setData({
          showIndex:true,  
        })
      }
      if(pre != index){
        // console.log(pre,index)
        let nodes = getNodes.call(this,PATH['list']);
        nodes[pre].setActivivate(false);
        nodes[index].setActivivate(true);
        let i = index-1;
        this.setData({
          scrollTop: i < 0 ? 0 : nodes[i].top + nodes[i].height
        })
        updateStatus.call(this,index); 
      }
      // console.log(dtY,this.firstQuickNode)
    },
    touchEnd(e){
      this.setData({
        showIndex:false
      })
    },
    listTap(e) {
      let dt = e.detail||{};
      console.log(dt);
      App.StorageH.set('Shipping_Company',{
        shippingId:dt.id || 0,
        shippingName:dt.name || "",
      })
      wx.navigateBack({
        delta:1, 
      })
    }, 
    firstNodeBack(e){
      let dt = e.detail||{}; 
      if(dt.type == 'quick'){
        this.firstQuickNode = this.firstQuickNode||{};
        this.firstQuickNode.height = dt.height;
        this.firstQuickNode.key = dt.key;
        this.firstQuickNode.top = dt.top;
      }
      // else if(dt.type == 'list'){
        // this.firstListNode = this.firstListNode||{};
      //   this.firstListNode.height = dt.height;
      //   this.firstListNode.key = dt.key;
      //   this.firstListNode.top = dt.top;
      // }
      // console.log(this.firstQuickNode,'firstQuickNode');
    },
  },
}))

function getQueryInfo(type) {
  let arr = getNodes.call(this,PATH[type||'list']);
  arr && arr.forEach(item=>{
    item.getQuery && item.getQuery();
  })
}

function getNodes(path) {
  return this.getRelationNodes(path);
}

function getFirstQuickNode(type) {
  let nodes = getNodes.call(this,PATH[type||'quick']);
  if(!nodes || !nodes[0])return
  nodes[0].getQuery && nodes[0].getQuery();
}

function updateStatus(index=0){
  let data = index;
  this.triggerEvent('updateStatus',data,{ bubbles: true, composed: true });
}
  
function cleanTimeOutJob(key,fnc,that) {
  if(that[key]){
    clearTimeout(that[key]);
    delete that[key];
  }
  that[key] = setTimeout(()=>{
    fnc && fnc.call(that);
  },0)
}