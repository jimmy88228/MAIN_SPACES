// 资源方式
const codeForPage = {
  "SUBSCRIBE-COUNSEL": "pages/psychology/tutor/tutor"
}

// 资源库
const repositoryPage = {
  "video":"pages/video-detail/video-detail",
  "audio":"pages/audio-detail/audio-detail",
  "article":"pages/article-detail/article-detail",
  "course":"pages/work-bench/course-details/course-details",
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
          if(item.type == "course"){
            result = { url: repositoryPage[item.type] + "?courseActivityId=" + item.id, code:item.code }
          }else{
            result = { url: repositoryPage[item.type] + "?id=" + item.id, code:item.code }
          }
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