
import SIH from "@/common/helper/sys-infos-handler.js";
import SMH from "@/common/helper/show-msg-handler.js";
import LM from "@/common/manager/login-manager.js";
import uniApi from "@/common/support/tools/uni-api-promise.js"
class posterManager {
    static getInstance() {
        if (!posterManager.instance) {
            posterManager.instance = new posterManager();
        }
        return posterManager.instance;
    }
    constructor() {
			this.rpx = initRpx();
			this.canvas = null;
			this.width = 0;
			this.height = 0;
			this.compObj = null;
		}
		initCanvas(viewData, posterDom, compObj){
			if(!posterDom){
				SMH.showToast({
					title: "无效canvas"
				})
			}
			this.compObj = compObj || {}; // 组件实例对象
			return this.installData(viewData).then((_viewData)=>{
				return this.createCanvas(_viewData, posterDom);
			})
		}
		createCanvas(viewData, posterDom){
			let saveMult = this.saveMult || 1;
			return new Promise((rs, rj)=>{
				if(posterDom) {
				  posterDom.fields({ node: true, size: true })
				  .exec((res) =>{
				    let data = res[0] || {};
				    let width = this.width = data.width || 0;
				    let height = this.height = data.height || 0;
				    const canvas = res[0].node;
				    const ctx = canvas.getContext('2d');
				    const dpr = SIH.pixelRatio;
				    canvas.width = width;
				    canvas.height = height;
				    ctx.fillStyle = "#fff";
				    ctx.fillRect(0, 0, width, height);
				    ctx.scale(saveMult, saveMult);
				    this.drawCanvas(viewData, ctx, canvas);
				    this.canvas = canvas || {};
				    setTimeout(()=>{
				      this.saveCanvasHandle().then((canvasPoster)=>{
								return rs(canvasPoster);
							})
				    },1000)
				  })
				}
			})
		}
		// 绘制内容
		drawCanvas(viewData, ctx, canvas){
		  if(ctx){
		    const dpr = this.rpx;
		    for(let i = 0; i < viewData.length; i++){
		      let type = viewData[i].type;
		      let css = viewData[i].css || {};
		      let _url = viewData[i]._url;
		      switch(type){
		        case "avatar":
		          if(_url) {
		            let img = canvas.createImage()
		            img.src = _url;
		            img.onload = function(){
		              const offsetX = css.left * dpr
		              const offsetY = css.top * dpr
		              const r = (css.width * dpr) / 2
		              const circle = {
		                    x: offsetX + r,
		                    y: offsetY + r,
		                    r: r
		                  }
		              ctx.save()
		              // 切圆角
		              ctx.beginPath()
		              ctx.arc(circle.x, circle.y, circle.r, Math.PI * 2, false)
		              ctx.clip()
		              // 画成指定的长和高
		              ctx.drawImage(img, offsetX, offsetY, css.width * dpr, css.height * dpr)
		              ctx.restore();
		            }
		          }
		          break;
		        case "avatarName":
		        case "text":
		          if(css.fontSize || css.fontStyle){
		            let _font = ((css.fontSize || 24) * dpr).toFixed(2) + "px " + (css.fontStyle || "");
		            ctx.font = _font;
		          }
		          ctx.fillStyle = css.color;
		          ctx.textBaseline = "top";
		          ctx.fillText(viewData[i].text, css.left * dpr, css.top * dpr);
		          break;
		        case "image":
		          if(_url) {
		            let img = canvas.createImage();
		            img.src = _url;
		            img.onload = function(){
		              const offsetX = css.left * dpr;
		              const offsetY = css.top * dpr;
		              // 画成指定的长和高
		              ctx.drawImage(img, offsetX, offsetY, css.width * dpr, css.height * dpr)
		              // ctx.restore();
		            }
		          }
		          break;
		        case "code":
		          if(_url) {
		            let img = canvas.createImage();
		            img.src = _url;
		            img.onload = function(){
		              const offsetX = css.left * dpr;
		              const offsetY = css.top * dpr;
		              // 画成指定的长和高
		              ctx.drawImage(img, offsetX, offsetY, css.width * dpr, css.height * dpr)
		            }
		          }
		          break;
		      }
		    }
		  }
		  return ctx;
		}
		saveCanvasHandle(type){
		  let rpx = this.rpx;
		  let width = this.width;
		  let height = this.height;
		  let that = this;
		  if(!this.canvas) return;
		  return uniApi.canvasToTempFilePath({
		    x: 0,
		    y: 0,
		    width: width,
		    height: height,
		    destWidth: width * rpx * 2,
		    destHeight: height * rpx * 2,
		    canvas: this.canvas,
		  }, this.compObj).then((res)=>{
				if(!res.tempFilePath) return Promise.reject();
				if(type == "save"){
				  return uniApi.saveImageToPhotosAlbum({
				    filePath: res.tempFilePath,
				    success (res) {
				      SMH.showToast({
				        title: '保存成功'
				      })
				      that.dismiss();
				    },
				    fail(error){
				      SMH.showToast({
				        title: error || '保存失败'
				      })
				    }
				  }).then((saveRes)=>{
						SMH.showToast({
						  title: '保存成功'
						})
					}).catch((saveError)=>{
						console.log("saveError",saveError);
						SMH.showToast({
						  title: saveError || '保存失败'
						})
						return Promise.reject();
					})
				} else {
					return res;
				}
			}).catch((error)=>{
				console.log("error",error);
				return Promise.reject();
			})
		}
		// 拼装数据
		installData(viewData = []){
		  let viewPromise = [];
		  for(let i = 0; i < viewData.length; i++){
		    let type = viewData[i].type;
		    switch(type){
		      case "avatar":
		        viewPromise.push(getUserInfo.call(this).then( resInfo =>{
		          return getImgInfo.call(this, resInfo.portrait_path).then(_info=>{
		            viewData[i]._url = _info.path;
		            viewData[i].width = _info.width;
		            viewData[i].height = _info.height;
		          });
		         }).catch(()=>{
		           return "";
		         }));
		        break;
		      case "avatarName":
		        viewPromise.push(getUserInfo.call(this).then( resInfo =>{
		          viewData[i].text = resInfo.realName;
		          return resInfo.nickname;
		         }).catch(()=>{
		          return "";
		        }));
		          break;
		      case "image":
		        let url = viewData[i].url || "";
		        if(url){
		          viewPromise.push(getImgInfo.call(this, url).then(_info=>{
		            viewData[i]._url = _info.path;
		            viewData[i].width = _info.width;
		            viewData[i].height = _info.height;
		          }));
		        }
		        break;
		      case "code":
		        // viewPromise.push(appletCode.getAppletCode(viewData[i].data).then(resInfo=>{
		        //   let file_url = resInfo.file_url || "";
		        //   return getImgInfo.call(this, file_url).then(_info=>{
		        //       viewData[i]._url = _info.path;
		        //       viewData[i].width = _info.width;
		        //       viewData[i].height = _info.height;
		        //     });
		        // }))
		        break;
		    }
		  }
		  //
		  return new Promise((rs, rj)=>{
		    Promise.all(viewPromise).finally(()=>{
		      rs(viewData)
		    })
		  })
		}
}
export default posterManager.getInstance();

//
function initRpx(){
	let sysTemInfo = SIH.getSystemInfoSync || {};
	let rpx = (sysTemInfo.windowWidth / 750) || 1;
	return rpx;
}
//
function getImgInfo(imgPath){
  return new Promise((rs, rj)=>{
    uni.getImageInfo({
      src: imgPath,
      success: res => {
        rs(res);
      },
      fail: res => {
        rs("");
      }
    })
  })
}
//
function getUserInfo(){
	return new Promise((rs, rj)=>{
		if(LM.isLogin && LM.userInfo.cardNum){
			rs(LM.userInfo)
		} else {
			return rs({})
		}
	})
}