// import Promise from "../../../../libs/promise/promise.js";
const duration = 3000;
function pollingBox(fn) {
  let count = 5;
  function polling() {
    count = count - 1;
    if (count >= 0) {
      return fn().then((res) => {
        console.log('轮询中', res)
        if (res.data == 1 || count <= 0) {
          return Promise.resolve(res);
        }
        return new Promise ((rs,rj)=>{
          setTimeout(() => {
            rs(polling())
          }, duration)
        }) 
      }).catch(e=>{
        console.log("polling catch",e)
      })
    }
    return Promise.resolve(res);
  }
  return polling;
}

export default pollingBox; 