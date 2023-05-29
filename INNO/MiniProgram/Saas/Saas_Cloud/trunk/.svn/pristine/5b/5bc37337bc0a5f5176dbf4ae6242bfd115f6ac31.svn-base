// pages/component/css3/snow/snow.js
// import WxApi from "../../../../support/tools/wx-api-promise";
let app = getApp();
// 存储所有的雪花
let snows = [];

// 下落的加速度
const G = 0.005;
// const G = 0.005;

const fps = 30;

// 速度上限，避免速度过快
const SPEED_LIMIT_X = 0.7;
const SPEED_LIMIT_Y = 0.5;

const W = app.SIH.screenWidth;
const H = app.SIH.screenHeight;
const showTime = 9000;
const ratio =  (app.SIH.screenWidth * app.SIH.pixelRatio / W) || 1;

let tickCount = 800;  //毫秒刷新雪花判断
let ticker = 0;       //毫秒差
let snowMaxNum = 120; //雪花总数
let lastTime = new Date().getTime(); //时间
let deltaTime = 0;    //时差
let canvas = null;
let ctx = null;
let animId = null;
let timeId = null;
let initImageInfo = null;
let animShow = true;
Component(app.BTAB({
  properties: {

  },
  data: {
    show:false
  },
  methods: {
    start(){
      if(this.data.show && !this.data.hidden)return
      // console.log('雪花start');
      this.init();
    },
    end(){
      canvas && animId && canvas.cancelAnimationFrame(animId);
      canvas && timeId && clearTimeout(timeId);
      this.setData({
        hidden:true
      })
    },
    createCanvas(){
      let that = this;
      wx.createSelectorQuery().in(this)
      .select('#canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        canvas = res[0].node;
        let width = res[0].width || W;
        let height = res[0].height || H;
        ctx = canvas.getContext("2d");
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        this.anim(this,false);
        getImage(this.data.brand_info.default_icon_url + "wave.png").then(res=>{
          initImageInfo = initImageInfo || res; 
          loop();
        });
      })
    },
    init() {
      snows = [];
      this.anim(this,true);
      wx.nextTick(()=>{
        this.createCanvas();
      })
    },
    anim(that,bool){
      if(!bool){
        if(!that.snowId){
          that.snowId = setTimeout(() => {
            that.snowId = 0;
            animShow = false;
            setTimeout(() => {
              that.end();
              that.triggerEvent('status','end');
            }, 2000);
          }, showTime);
        }
      }else{
        animShow = true;
        this.setData({
          show:true,
          hidden:false
        })
      }
    }
  }
})) 

function loop() {
  animId = canvas.requestAnimationFrame && canvas.requestAnimationFrame(loop) 
  ||  function (callBack) {
   timeId = setTimeout(()=>{
      callBack();
    }, 1000 / fps);
  }(loop); 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const now = Date.now();
  deltaTime = now - lastTime;
  lastTime = now;
  ticker += deltaTime; 
  if (ticker > tickCount) {
      if(!snows || snows.length==0){
          for(let i = 0,len=snowMaxNum - snows.length;i<len;i++){
            snows.push(
              new Snow(Math.random() * canvas.width, Math.random() * canvas.height / 1.2)
              );
            }
          }else if(snows.length < (snowMaxNum*1.2) ){
            for(let i = 0,len=5;i<len;i++){
              snows.push(
                new Snow(Math.random() * canvas.width, 0)
              );
            }
          }
    ticker %= tickCount;
  }
  snows.map(function(s, i) {
    s.update();
    s.draw();
    if (s.y >= canvas.height) {
      snows.splice(i, 1);
    }
  });
} 

function Snow(x, y) {
  this.x = x;
  this.y = y;
  this.sx = 0;
  this.sy = 0;
  this.deg = 0;
  this.ax = Math.random() < 0.5 ? 0.001*Math.random()*0.5 : -0.001*Math.random()*0.5; 
  // this.r = Math.random()*5;
  // this.r = Math.random()*10 + 2;
  this.r = Math.random()*15;
  this.r = this.r<10 ? (this.r + 4 + 5*Math.random()) : this.r
  this.op = Math.random()+0.3;
}

Snow.prototype.update = function() {
  const deltaDeg = Math.random() * 0.5 + 0.1;

  this.sx += this.ax;
  if (this.sx >= SPEED_LIMIT_X || this.sx <= -SPEED_LIMIT_X) {
    this.ax *= -1;
  }

  if (this.sy < SPEED_LIMIT_Y) {
    this.sy += G;
  }

  this.deg += deltaDeg;
  this.x += this.sx;
  this.y += this.sy;
}

Snow.prototype.draw = function() {
  ctx.save();
  if(animShow){
    (this.op < 0.1) && (this.op -= 0.0008) || (this.op -= 0.002)
    this.op < 0 && (this.op = 0.9)
  }else{
    this.op > 0 && (this.op -= 0.01);
  }
  // console.log(animShow)
  // ctx.beginPath();
  // ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2 , true);
  // ctx.closePath();
  // ctx.fillStyle = `rgba(255, 255, 255, ${this.op})`;
  // ctx.fill();
  // ctx.scale(ratio,ratio);
  ctx.globalAlpha = this.op<0?0:this.op;
  ctx.translate(this.x, this.y);
  ctx.rotate(this.deg * Math.PI / 180);
  ctx.drawImage(initImageInfo, 0, 0, this.r*ratio, this.r*ratio);
  ctx.restore();
}

function getImage(url=''){
  if(!url)return Promise.reject()
  if(initImageInfo)return Promise.resolve(initImageInfo); 
  return new Promise((rs, rj) => {
    url = changeHttp(url);
    let img = canvas.createImage();
    img.src = url;
    img.onload = () => {
        rs(img);
    };
    img.onerror = () => {
        rj();
    };
  });
}



function changeHttp(link) {
  if (!link || typeof link == 'object') return 'https://';
  if (link.indexOf("http://") == "-1" && link.indexOf("https://") == "-1") {
    link = "https://" + link;
  } else if (link.indexOf("https://") == "-1") {
    link = link.replace('http://', 'https://');
  }
  return link;
}  