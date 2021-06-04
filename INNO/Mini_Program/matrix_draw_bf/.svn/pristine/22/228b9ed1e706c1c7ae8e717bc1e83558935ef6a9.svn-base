import MyStr from "../../common/support/utils/string-util";

const app = getApp();
Component({
    properties: {
        questions: {
            type: Array,
            observer(obj) {
                this.setQuestions({ questions: obj });
            }
        }
    },
    data: {
        questionList: [],
    },
    ready() {
        this.isReady = true;
        this.setQuestions({ questions: this.data.questions });
    },
    methods: {
        setQuestions({ questions }) {
            if (!this.isReady) {
                return
            }
            this.questions = questions || [];
            this.checkQuestions();
        },
        checkQuestions() {
            let qs = this.questions;
            let newAnswers = {};
            // if (this.answers) {
            //     let oldAnswers = this.answers;
            //     for (let i = 0, n = qs.length; i < n; i++) {
            //         let q = qs[i];
            //         let answer = oldAnswers[q.id];
            //         if (!answer || answer.type != q.type) {
            //             continue;
            //         }
            //         newAnswers[q.id] = answer;
            //         q.value = answer.value;
            //     }
            // }
            this.answers = newAnswers;
            this.setData({ questionList: qs })
        },
        onOptionsChange(e) {
            let q = e.currentTarget.dataset.question;
            if (!q) {
                return;
            }
            let value = e.detail.value;
            let hasValue = false;

            try {
                let index = parseInt(value);
                if (index >= 0 && index < q.options.length) {
                    value = q.options[index].name;
                    hasValue = true;
                }
            } catch (e) {
            }

            if (hasValue) {
                this.answers[q.id] = value;
            } else if (q.id in this.answers) {
                delete this.answers[q.id];
            }
        },
        onNameChange(e) {
            let q = e.currentTarget.dataset.question;
            if (!q) {
                return;
            }
            let value = e.detail.value;
            value = MyStr.trim(value);
            let hasValue = false;
            if (value) {
                let arr = value.split("-");
                hasValue = arr.length >= 2 && MyStr.trim(arr[0]) && MyStr.trim(arr[1]);
            }
            if (hasValue) {
                this.answers[q.id] = value;
            } else if (q.id in this.answers) {
                delete this.answers[q.id];
            }

        },
        onChange(e) {
            let q = e.currentTarget.dataset.question;
            if (!q) {
                return;
            }
            let value = e.detail.value;
            value = MyStr.trim(value);
            let hasValue = !!value;

            if (hasValue) {
                this.answers[q.id] = value;
            } else if (q.id in this.answers) {
                delete this.answers[q.id];
            }
        },
        checkComplete() {
            let qs = this.questions;
            let rs = {}
            for (let i = 0, n = qs.length; i < n; i++) {
                let q = qs[i];
                let value = MyStr.trim(this.answers[q.id]);
                if (!value && q.must) {
                    let fc = this.selectComponent(`#field${q.id}`);
                    console.log(fc);
                    fc && fc.showError();
                    throwErr(q);
                }
                rs[q.id] = value;
            }
            return rs;
        }
    }
});

function throwErr(q) {
    if (q.type == "LIST" || q.type == "GRID") {
        throw `请选择 '${q.name}'`;
    } else {
        throw `请填写 '${q.name}'`;
    }
}