// pages/main/staff-module/activity/cps/goods-list/index.js
const App = getApp();
const ERR_KEY_FRAMES = [  
  { translateX: 0, backgroundColor: 'rgba(0, 0, 0, 0)' },
  { translateX: -9, backgroundColor: 'rgba(0, 0, 0, 0.04)' },
  { translateX: 3, backgroundColor: 'rgba(0, 0, 0, 0.08)' },
  { translateX: -9, backgroundColor: 'rgba(0, 0, 0, 0.1)' },
  { translateX: 3, backgroundColor: 'rgba(0, 0, 0, 0.08)' }, 
  { translateX: -3, backgroundColor: 'rgba(0, 0, 0, 0.04)' },
  { translateX: 3, backgroundColor: 'rgba(0, 0, 0, 0.02)' }, 
  { translateX: 0, backgroundColor: '' },
]
Component(App.BC({ 
    options: {
        addGlobalClass: true,
    },
    properties: {
        list:{
            type:Array,
            value:[]
        },
        inited:{
            type:Boolean,
            value:false
        },
        activity_id:{
            type:Number,
            value:0
        },
        domainPath:{
            type:String,
            value:""
        },
    },
    data: {
        msgList:[{
            key:"goods_name",
            name:"商品名称",
        },{
          key:"sale_price",
          name:"抢购价格",
        },{
            key:"goods_number",
            name:"可购数量",
        },{
            key:"goods_sn",
            name:"商品款号",
        }]
    }, 
    methods: {
        addGoods(){ 
          let func = ()=>{
            this.jumpAction(`/pages/main/staff-module/repository/goods/index?activity_id=${this.properties.activity_id}&fromType=activityAdd`);
          }
          this.checkSetTime(func)
        },
        editGoods(e){ 
            let goodsInfo = this.getDataset(e,'item')||{}; 
            App.StorageH.set("ReposityGoodsGallery", {galleryList: goodsInfo.goods_gallery || [], domainPath: this.properties.domainPath});
            let transData = encodeURIComponent(JSON.stringify(goodsInfo));
            this.jumpAction(`/pages/main/staff-module/repository/goods/index?goodsInfo=${transData}&activity_id=${this.properties.activity_id}&isEdit=1&fromType=activity&goodsId=${goodsInfo.goods_id||0}`);
        },
        onImport(){
          let func = ()=>{
            this.jumpAction(`/pages/main/staff-module/repository/index?fromType=activity&activity_id=${this.properties.activity_id||0}`);
          }  
          this.checkSetTime(func)
        },
        checkSetTime(func){
          if(!this.properties.activity_id){
            this.triggerEvent('checkSetTime',func)
            return
          }
          func();
        },
        sortTap(e){
            let dataset = this.getDataset(e)||{};
            let {index,tap} = dataset;
            let list = this.data.list||[];
            let temp=JSON.parse(JSON.stringify(list[index]||{}));
            if(tap == 'top'){ 
                list.splice(index,1);
                list.unshift(temp);
            }else{
                let changeIndex = tap == 'up' ? index - 1 : index + 1; 
                list[index] = JSON.parse(JSON.stringify(list[changeIndex]));
                list[changeIndex] = temp;
            }
            this.triggerEvent('change',{list});
        },
        onDelete(e){
          let {index,insert,goodsId} = this.getDataset(e); 
          this._showModal({content:"确定要删除该商品?"}).then(()=>{ 
            this.triggerEvent('onDelete',{index,insert,goodsId})
          })
        },
        setScrollTop(index){
          let id = `#box-${index}`;
          return this._selectQuery(`#box-0,${id}`,'component','all').then(res=>{
            let arr = res && res[0] || [];
            let top = (arr[1] && arr[1].top || 0) - (arr[0] && arr[0].top || 0);
            this.oriScrollView = this.oriScrollView || this.selectComponent('#ori-scroll-view');
            return this.oriScrollView.setScrollTop(top).then(()=>{
              this.animate(id,ERR_KEY_FRAMES,300,() => {
                this.clearAnimation(id, { translate: true, rotate: true }); 
              })
              return true
            });
          });
        },
    }
}))
