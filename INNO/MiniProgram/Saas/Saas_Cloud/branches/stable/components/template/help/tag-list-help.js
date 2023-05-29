export default {
  setTagJson({tagList=[],tagJson={},pathKey="pic_path",idKey="goods_id"}) {
    pathKey = pathKey || "pic_path";
    idKey = idKey || "goods_id";
    tagList && tagList.forEach(item => {
      let urlTemp = item[pathKey];
      let keyIndex = urlTemp.lastIndexOf("/");
      let urlKey = urlTemp.slice(keyIndex + 1);
      let goods_id = item[idKey];
      if (!(tagJson[goods_id] instanceof Array)) {
        tagJson[goods_id] = [];
      } else {
        for (let i = 0; i < tagJson[goods_id].length; i++) {
          if (tagJson[goods_id][i].pic_key == urlKey) { //同一个goods_id下存在相同的图片，不再添加
            return;
          }
        }
      }
      tagJson[goods_id].push({
        path: urlTemp,
        pic_key: urlKey
      })
    })
    // console.log("setTagJsonsetTagJson", tagJson);
    return tagJson
  },
  loadTag(e,that){
    let dataset = e.currentTarget.dataset || {};
    let id = dataset.id;
    let index = dataset.index;
    let width = e.detail.width;
    let height = e.detail.height;
    let key = `tagJson.${id}[${index}].width`;
    let key2 = `tagJson.${id}[${index}].height`;
    that.setData({
      [key]: width,
      [key2]: height
    })
  }
}