export const BoxChildNodes = {
  '../content/content':{
    type: 'child',
    linked: function(target) {
      this.initQuery('content-key',{});
    },
  }, 
}
export const ContentChildNodes = {
      '../items/advertise/advertise': {
        type: 'child',
      },
      '../items/ad-nav/ad-nav': {
        type: 'child',
      }, 
      '../items/goods-list/goods-list': {
        type: 'child',
      },  
      '../items/notice/notice': {
        type: 'child',
      }, 
      '../items/rich-text/rich-text': {
        type: 'child',
      }, 
      '../items/text-header/text-header': {
        type: 'child',
      }, 
      '../items/video/video': {
        type: 'child',
      }, 
} 