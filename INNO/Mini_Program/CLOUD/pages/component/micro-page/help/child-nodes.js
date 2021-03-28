const nodes = {
  '../content/content':{
    type: 'child',
    linked: function(target) {
      console.log('content linked',target.data._data.moduleId,target);
      this.initQuery('content-key',{});
      // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
    }, 
    linkChanged: function(target) {
      console.log('box linkChanged',target);
       // 每次被移动后执行，target是custom-ul节点实例对象，触发在moved生命周期之后
    }, 
    unlinked: function(target) {
      console.log('box unlinked',target);
       // 每次被移除时执行，target是custom-ul节点实例对象，触发在detached生命周期之后
    }, 
  },
    // '../items/advertise/advertise': {
    //     type: 'child',
    //     linked: function(target) {
    //       console.log('advertise linked',target.data._data.moduleId);
    //       this.cleanTimeOutJob('advertiseKey',this.getQueryInfo,target,{key:'advertise-key',id:'main'});
    //       // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
    //     }, 
    //     linkChanged: function(target) {
    //       console.log('advertise linkChanged',target);
    //        // 每次被移动后执行，target是custom-ul节点实例对象，触发在moved生命周期之后
    //     }, 
    //     unlinked: function(target) {
    //       console.log('advertise unlinked',target);
    //        // 每次被移除时执行，target是custom-ul节点实例对象，触发在detached生命周期之后
    //     }, 
    //   },
    //   '../items/ad-nav/ad-nav': {
    //     type: 'child',
    //     linked: function(target) {
    //       console.log('ad-nav linked',target);
    //     },   
    //   }, 
    //   '../items/goods-list/goods-list': {
    //     type: 'child',
    //     linked: function(target) {
    //       console.log('goods-list linked',target);
    //     }, 
    //     linkChanged: function(target) {
    //       console.log('goods-list linkChanged',target);
    //     }, 
    //     unlinked: function(target) {
    //       console.log('goods-list unlinked',target);
    //     }, 
    //   },  
    //   '../items/notice/notice': {
    //     type: 'child',
    //     linked: function(target) {
    //       console.log('notice linked',target);
    //     },   
    //   }, 
    //   '../items/rich-text/rich-text': {
    //     type: 'child',
    //     linked: function(target) {
    //       console.log('rich-text linked',target);
    //     },   
    //   }, 
    //   '../items/text-header/text-header': {
    //     type: 'child',
    //     linked: function(target) {
    //       console.log('text-header linked',target);
    //     },   
    //   }, 
    //   '../items/video/video': {
    //     type: 'child',
    //     linked: function(target) {
    //       console.log('video linked',target);
    //     },   
    //   }, 
}
console.log('nodesnodes',nodes)
export default nodes;