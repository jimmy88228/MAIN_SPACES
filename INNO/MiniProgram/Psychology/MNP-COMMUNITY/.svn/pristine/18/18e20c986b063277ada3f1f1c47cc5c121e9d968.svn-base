import {
  Apis
} from "../http/http.api.install.js";
import {
  Http
} from "../http/http.interceptor.js";
import StorageH from "../helper/storage-handler.js";
import SMH from "../helper/show-msg-handler.js";

//courseManager记录组织列表 组织id 
class courseManager {
  static getInstance() {
    if (!courseManager.instance) {
      courseManager.instance = new courseManager();
    }
    return courseManager.instance;
  }
  constructor() {
    Func._initStorage.call(this);
  }

  get courseList() {
    return this._courseList || {}
  }

  get scrollIds() {
    return this._scrollIds || 0
  }

  getCurrSub(dataset = {}) {
    let chaptersIndex = dataset.chaptersIndex || "";
    let sIndex = dataset.sIndex || "";
    // let cIndex = dataset.cIndex;
    let chapters = this.courseList.chaptersList || [];
    let subItem = (sIndex || sIndex === 0) ? chapters[chaptersIndex].chaptFlat : ""

    return subItem || []
  }

  getCourseList(id) {
    return Http(Apis.getLectureDetailInfo, {
      data: {
        lectureId:id
      }
    }).then((res) => {
      if (res.code == 1) {
        return this.formatDetail(res.data.courseDetail).then(detail => {
          this._courseList = {...detail,joinState:res.data.joinState,endTime:res.data.endTime,startTime:res.data.startTime}
          console.log(this._courseList,"_courseList")
          return this._courseList;
        })
      } else {
        return Promise.reject()
      }
    });
  }


  formatDetail(courseDetail) {
    // if(this._courseList.id) return Promise.resolve(this._courseList)
    return new Promise((resolve, reject) => {
      let learningPrecent = parseInt((courseDetail.hadLearnCount / courseDetail.totalCount) * 100);
      let chaptersList = JSON.parse(JSON.stringify(courseDetail.chapters));
      let limitOrder = courseDetail.limitOrder;
      let isLock = false;
      for (let i in chaptersList) {
        let chaptersListItem = chaptersList[i]
        if (this._openIndex == i) {
          chaptersListItem.open = true;
        } else {
          chaptersListItem.open = false;
        }
        let chaptFlat = [];
        let subsections = chaptersListItem.subsections || [];
        let classI = 1
        for (let sIndex = 0; sIndex < subsections.length; sIndex++) {
          let subsectionsItem = subsections[sIndex] || []
          subsectionsItem.classI = String(Number(i) + 1) + '.' + classI;
          if (subsectionsItem.subsectionType == "group") {
            classI = classI + 1;
            let contentList = subsectionsItem.contentList;
            for (let cIndex = 0; cIndex < contentList.length; cIndex++) {
              if (limitOrder) {
                let isFinish = contentList[cIndex].isFinish;
                if (isFinish) {
                  contentList[cIndex].needlock = false
                } else {
                  contentList[cIndex].needlock = isLock;
                }
                if ((!isLock && !isFinish)) {
                  isLock = true
                }
              } else {
                contentList[cIndex].needlock = false
              }
              contentList[cIndex].title = subsectionsItem.classI + ' ' + subsectionsItem.subsectionName
            }
            chaptFlat.push(...contentList)
          } else {
            subsections[sIndex] = subsectionsItem.contentList[0]
            if (limitOrder) {
              let isFinish = subsectionsItem.contentList[0].isFinish;
              if (isFinish) {
                subsections[sIndex].needlock = false
              } else {
                subsections[sIndex].needlock = isLock;
              }
              if ((!isLock && !isFinish)) {
                isLock = true
              }
            } else {
              subsections[sIndex].needlock = false
            }
            subsections[sIndex].title = String(Number(i) + 1) + ' ' + chaptersListItem.chapterName
            chaptFlat.push(subsections[sIndex]);
          }
        }
        chaptersListItem.chaptFlat = chaptFlat;
      }
      let formatDetail = {
        ...courseDetail,
        learningPrecent,
        chaptersList
      }
      resolve(formatDetail)
    })
  }

  punchCard(formData) {
    console.log(formData, "123")
    let activityId = Number(formData.activityId)
    return Http(Apis.punchCardLecture, {
      data: {
        activityId,
        contentId: formData.contentId,
        courseId: formData.courseId,
        isCard: formData.isCard,
        viewTime: formData.viewTime,
        progressTime: formData.progressTime
      }
    }).then(res => {
      if (res.code == 1) {
        if (formData.isCard) {
          return this.getCourseList(activityId).then(courseList => {
            return courseList
          })
        } else {
          return res
        }
      } else {
        return Promise.reject(res)
      }
    })
  }

  changeOpenTap(e) {
    let courseList = this._courseList;
    let chaptersList = JSON.parse(JSON.stringify(courseList.chaptersList))
    for (let i = 0; i < chaptersList.length; i++) {
      chaptersList[i].open = false
      // options.forEach(item => {
      if (e || e === 0) {
        chaptersList[e].open = true
      }
      // })
    }
    this._openIndex = e;
    this.courseList.chaptersList = chaptersList
  }

  setScrollIds(id) {
    this._scrollIds = id
  }

  initCourse() {
    this._courseList = [];
    this._scrollId = 0;
    this._openIndex = '0'
  }

}

const Func = {
  _initStorage() {
    this._courseList = [];
    this._scrollId = 0;
    this._openIndex = '0'
  },
}

export default courseManager.getInstance();