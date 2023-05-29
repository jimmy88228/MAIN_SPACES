const questionType = [
  {
    type: 'radio',
    name: '单选题',
  },
  {
    type: 'checkbox',
    name: '多选题',
  },
  {
    type: 'question',
    name: '问答题',
  }
]

function getQuestion(key){
  if(!key) return {};
  for(let i = 0; i < questionType.length; i++){
    if(key == questionType[i].type){
      return questionType[i] || {}
    }
  }
}


export default {
  questionType,
  getQuestion
}