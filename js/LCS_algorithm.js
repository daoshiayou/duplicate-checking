/**
 * 用于计算两个字符串的最长公共子序列
 * @module LCS_algorithm
 */
define(['./Util'], function (Util) {
    let arrayA, arrayB, lengthArr, LCSString, percentage;
    let strategy = priorA;
    let repeatA = [], repeatB = [];
    let blockList = [' ', ',', '.', '\n', '?', '!', ':', ';'];
    // let blockList = [];

    /**
     * 设置被比较的A数组，并重置LCS内部参数
     * @param {string|Array} a 要设置的数据
     */
    function setArrayA(a) {
        if (arrayA) {
            arrayA.splice(0, arrayA.length);
        }
        if (typeof (a) === 'string') {
            arrayA = a.split('');
        } else if (a instanceof Array) {
            arrayA = a;
        } else {
            throw new Error('TypeError: arrayA must be a string or an array');
        }
        lengthArr = undefined;
        LCSString = undefined;
        percentage = undefined;
        repeatA.splice(0, repeatA.length);
        repeatB.splice(0, repeatB.length);
    }

    /**
     * 设置比较的B数组，并重置LCS内部参数
     * @param {string|Array} b 要设置的数据
     */
    function setArrayB(b) {
        if (arrayB) {
            arrayB.splice(0, arrayB.length);
        }
        if (typeof (b) === 'string') {
            arrayB = b.split('');
        } else if (b instanceof Array) {
            arrayB = b;
        } else {
            throw new Error('TypeError: arrayB must be a string or an array');
        }
        lengthArr = undefined;
        LCSString = undefined;
        percentage = undefined;
        repeatA.splice(0, repeatA.length);
        repeatB.splice(0, repeatB.length);
    }

    /**
     * 获取被比较的数组
     * @return {Array}
     */
    function getArrayA() { return arrayA; }

    /**
     * 获取比较的数组
     * @return {Array}
     */
    function getArrayB() { return arrayB; }

    function addBlockWord(string) {
        if (blockList.find(string) === undefined) {
            blockList.push(string);
        }
    }
    function clearBlockWord() {
        blockList.splice(0, blockList.length);
    }

    /**
     * 根据LCS内部设置的数组计算其LCS长度数组
     */
    function calLength() {
        if (!arrayA || !arrayB) {
            throw new Error('TypeError: arrayA or arrayB is undefined');
        } else if (Math.min(arrayA.length, arrayB.length) < 1) {
            lengthArr = 0;
            return;
        }
        lengthArr = new Array(arrayA.length + 1);
        for (let i = 0; i < lengthArr.length; i++) {
            lengthArr[i] = new Array(arrayB.length + 1);
        }
        for (let i = 0; i < arrayA.length + 1; i++) {
            for (let j = 0; j < arrayB.length + 1; j++) {
                if (i === 0 || j === 0) {
                    lengthArr[i][j] = 0;
                } else {
                    if (arrayA[i - 1] === arrayB[j - 1]) {
                        lengthArr[i][j] = lengthArr[i - 1][j - 1] + 1;
                    } else {
                        lengthArr[i][j] = Math.max(lengthArr[i - 1][j], lengthArr[i][j - 1]);
                    }
                }
            }
        }
    }
    /**
     * 根据LCS内部设置的LCS长度数组计算LCS
     */
    function calLCS() {
        if (!arrayA || !arrayB) {
            throw new Error('TypeError: arrayA or arrayB is undefined');
        }
        if (!lengthArr) {
            calLength();
        }
        if (lengthArr === 0) {
            LCSString = '';
            percentage = 0;
            return;
        }
        let indexA = arrayA.length;
        let indexB = arrayB.length;
        let temp = new Array();
        while (indexA !== 0 && indexB !== 0) {
            if (arrayA[indexA - 1] === arrayB[indexB - 1]) {
                indexA--;
                indexB--;
                // for (let char of blockList) {
                //     if (arrayA[indexA] === char) {
                //         continue;
                //     }
                // }
                temp.push(arrayA[indexA]);
                repeatA.push(indexA);
                repeatB.push(indexB);
            } else {
                [indexA, indexB] = strategy(indexA, indexB);
            }
        }
        LCSString = temp.reverse().join('');
        percentage = (LCSString.length / arrayA.length * 100).toFixed(2);
    }
    function getLCSLength() {
        if (!lengthArr) {
            calLength();
        }
        return lengthArr[arrayA.length][arrayB.length];
    }
    function getLCSString() {
        if (LCSString === undefined) {
            calLCS();
        }
        return LCSString;
    }
    function getPercentage() {
        if (!percentage) {
            calLCS();
        }
        return percentage;
    }
    function getRepeatA() {
        if (repeatA.length === 0) {
            calLCS();
        }
        return Util.copy(repeatA);
    }
    function getRepeatB() {
        if (repeatB.length === 0) {
            calLCS();
        }
        return Util.copy(repeatB);
    }
    function priorA(indexA, indexB) {
        return lengthArr[indexA - 1][indexB] < lengthArr[indexA][indexB - 1] ? [indexA, indexB - 1] : [indexA - 1, indexB];
    }
    function priorB(indexA, indexB) {
        return lengthArr[indexA - 1][indexB] > lengthArr[indexA][indexB - 1] ? [indexA - 1, indexB] : [indexA, indexB - 1];
    }
    function changeStrategy() {
        if (strategy === priorA) {
            strategy = priorB;
        } else {
            strategy = priorA;
        }
    }

    function* wordFilter(string) {
        for (let word of list) {
            yield new Promise((resolve, reject) => {
                setTimeout(() => {
                    let reg = new RegExp(word, 'g');
                    let result;
                    while (result = reg.exec(string) !== null) {
                        let index = result.index;
                        repeatA.splice(string.length - index - 1, word.length);
                        repeatB.splice(string.length - index - 1, word.length);
                    }
                    string = string.replace(reg, '');
                    resolve(string);
                }, 0);
            });
        }
    }
    let publicAPI = {
        setArrayA: setArrayA,
        setArrayB: setArrayB,
        getArrayA: getArrayA,
        getArrayB: getArrayB,
        getLCSLength: getLCSLength,
        getLCSString: getLCSString,
        getPercentage: getPercentage,
        getRepeatA: getRepeatA,
        getRepeatB: getRepeatB,
        changeStrategy: changeStrategy,
        addBlockWord: addBlockWord,
        clearBlockWord: clearBlockWord,
    }
    return publicAPI;
});
