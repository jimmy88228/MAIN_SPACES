// 资源方式
const codeForPage = {
  "SUBSCRIBE-COUNSEL": "pages/psychology/tutor/tutor"
}

// 资源库
const repositoryPage = {
  "video":"pages/content-library/video-detail/video-detail",
  "audio":"pages/content-library/audio-detail/audio-detail",
  "article":"pages/content-library/article-detail/article-detail",
}



export default {
  searchPage(item, callback) {
    console.log(item)
    let result = {};
    if(typeof(item) == 'string'){
      result = { url: item }
    } else if(typeof(item) == 'object'){
      if(item.url){
        result = { url: item.url }
      } else if(item.code){
        if(item.code == "CUSTOM-URL"){
          result = { url: item.url, code:item.code }
        }else if(item.code == "CONTENT-REPOSITORY"){
          result = { url: repositoryPage[item.type] + "?id=" + item.id, code:item.code }
        }else{
          result = { url: codeForPage[item.code], code:item.code }
        }
      }else{
        result = item
      }
    }
    typeof callback == 'function' && callback(result)
  }
}