let campusTypeList = [
  {name: "小学", key: "primary"},
  {name: "初中", key: "junior"},
  {name: "高中", key: "senior"}
];
function campusJson(){
  let jsonData = {};
  campusTypeList.map((item)=>{
    jsonData[item.key] = item.name;
  })
  return jsonData
}
export default {
  campusTypeList,
  campusJson: campusJson()
}