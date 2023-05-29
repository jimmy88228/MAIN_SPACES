const questionType = [// 1单选，2多选，3问答
  {
    type: 'single_choice',
    number: 1, 
    name: '单选题',
  },
  {
    type: 'multi_choice',
    number: 2, 
    name: '多选题',
  },
  {
    type: 'q_a',
    number: 3, 
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