const loopTime = 7;
const normalTime = 6;
function calculate(numbers = 8, prizeId, prizeList, indexRecord = 0) {
    return {
        [Symbol.iterator]: function () {
            let index = indexRecord;
            let addTime = loopTime - normalTime;
            let currentIndex = prizeList.findIndex(item => item.prizeId === prizeId);
            console.log('findIndex',currentIndex,prizeList,prizeId);
            let totalDuration = Array.from({ length: normalTime * numbers }, (v, i) => {
                if (i < numbers) {
                    // 第一圈加速
                    return Number(((0.4 + numbers * 0.1) - i * 0.1).toFixed(1));
                } else {
                    // 匀速
                    return 0.4;
                }
            }).concat(Array.from({ length: addTime * numbers + (currentIndex + 1) }, (v, i) => i === 0 ? 0.4 : Number((i * 0.2).toFixed(1))));
            console.log(totalDuration) //数量X圈数 concat (中奖奖品在第N个偏移)
            return {
                next: function () {
                    if (index < totalDuration.length) {
                        return {
                            value: {
                                duration: totalDuration[index] * 100,
                                currentIndex: index++ % numbers,
                                isEnded: totalDuration[index] ? false : true,
                                isPaused: totalDuration[index] * 100 > 40 && index > 8
                            },
                            done: false
                        };
                    } else {
                        return {
                            value: undefined,
                            done: true
                        };
                    }
                }
            }
        }
    };
}
export default calculate;