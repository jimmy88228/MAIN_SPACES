const ERR_KEY_FRAMES = [ 
  { translateX: 0, backgroundColor: 'rgba(0, 0, 0, 0)' },
  { translateX: -4, backgroundColor: 'rgba(0, 0, 0, 0.04)' },
  { translateX: 3, backgroundColor: 'rgba(0, 0, 0, 0.08)' },
  { translateX: -4, backgroundColor: 'rgba(0, 0, 0, 0.1)' },
  { translateX: 3, backgroundColor: 'rgba(0, 0, 0, 0.08)' }, 
  { translateX: -3, backgroundColor: 'rgba(0, 0, 0, 0.04)' },
  { translateX: 3, backgroundColor: 'rgba(0, 0, 0, 0.02)' }, 
  { translateX: 0, backgroundColor: '' },
] 

const OFFSET_KEY_FRAMES = [
  { translateX: 0 , opacity:1},
  { translateX: -3, opacity:0.8},
  { translateX: 3, opacity:0.6},
  { translateX: -3, opacity:0.5},
  { translateX: 3, opacity:0.5}, 
  { translateX: -3, opacity:0.6},
  { translateX: 3, opacity:0.8}, 
  { translateX: 0, opacity:1},
]

const Anims = {
  error(target, selector, callback) {
      if(target.animateShowingError)return;
      target.animateShowingError = true;
      target.animate(selector,ERR_KEY_FRAMES,220,() => {
        target.clearAnimation(selector, { translate: true , backgroundColor: true}); 
        target.animateShowingError = false;
        callback && callback();
      })
  },
  offset(target, selector, callback) {
    if(target.animateShowingOffset)return;
    target.animateShowingOffset = true;
    target.animate(selector,OFFSET_KEY_FRAMES,220,() => {
      target.clearAnimation(selector, { translate: true }); 
      target.animateShowingOffset = false;
      callback && callback();
    })
  },

};

wx.MyAnims = Anims;
export default Anims;