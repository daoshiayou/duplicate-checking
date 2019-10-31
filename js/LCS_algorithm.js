/**
 * 用于计算两个字符串的最长公共子序列
 * @module LCS_algorithm
 */
define(['./Util'], function (Util) {
    let arrayA, arrayB, lengthArr, LCSString, percentage;
    let strategy = priorA;
    let repeatA = [], repeatB = [];
    // let blockList = [' ', ',', '.', '\n', '?', '!', ':', ';'];
    let blockList = ['的', 'A.', 'B.', 'C.', 'D.'];
    let filter = true;

    /**
     * 设置被比较的A数组，并重置LCS内部参数
     * @param {string} a 要设置的数据
     */
    function setArrayA(a) {
        if (arrayA) {
            arrayA.splice(0, arrayA.length);
        }
        if (typeof (a) === 'string') {
            if (filter) {
                arrayA = wordFilter(a);
            } else {
                arrayA = a.split('');
            }
        } else {
            throw new Error('TypeError: arrayA must be a string');
        }
        lengthArr = undefined;
        LCSString = undefined;
        percentage = undefined;
        repeatA.splice(0, repeatA.length);
        repeatB.splice(0, repeatB.length);
    }

    /**
     * 设置比较的B数组，并重置LCS内部参数
     * @param {string} b 要设置的数据
     */
    function setArrayB(b) {
        if (arrayB) {
            arrayB.splice(0, arrayB.length);
        }
        if (typeof (b) === 'string') {
            if (filter) {
                arrayB = wordFilter(b);
            } else {
                arrayB = b.split('');
            }
        } else {
            throw new Error('TypeError: arrayB must be a string');
        }
        lengthArr = undefined;
        LCSString = undefined;
        percentage = undefined;
        repeatA.splice(0, repeatA.length);
        repeatB.splice(0, repeatB.length);
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
                    if (arrayA[i - 1] === arrayB[j - 1] && arrayA[i - 1] !== '{placeholder}') {
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
            if (arrayA[indexA - 1] === arrayB[indexB - 1] && arrayA[indexA - 1] !== '{placeholder}') {
                indexA--;
                indexB--;
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


    /**
     * 设置过滤模式
     * @param {boolean} bool 是否开启过滤
     */
    function setFilter(bool) {
        filter = bool;
    }
    function addBlockWord(string) {
        if (blockList.find(string) === undefined) {
            blockList.push(string);
        }
    }
    function removeBlockWord(string) {
        let index = blockList.indexOf(string);
        if (index !== -1) {
            blockList.splice(index, 1);
        }
    }
    function clearBlockWord() {
        blockList.splice(0, blockList.length);
    }
    function getBlockWord() {
        return Util.copy(blockList);
    }
    /**
     * 根据屏蔽词处理字符串,将屏蔽词替换为 {placeholder}
     * @param {stirng} str 要处理的字符串
     * @return {Array} 处理完毕的数组
     */
    function wordFilter(str) {
        let arr = str.split('');
        for (let word of blockList) {
            let reg = new RegExp(word, 'g');
            let result;
            while ((result = reg.exec(str)) !== null) {
                let index = result.index;
                for (let i = 0; i < word.length; i++) {
                    arr[index + i] = '{placeholder}';
                }
            }
        }
        return arr;
    }

    let publicAPI = {
        setArrayA: setArrayA,
        setArrayB: setArrayB,
        getLCSLength: getLCSLength,
        getLCSString: getLCSString,
        getPercentage: getPercentage,
        getRepeatA: getRepeatA,
        getRepeatB: getRepeatB,

        setFilter: setFilter,
        addBlockWord: addBlockWord,
        removeBlockWord: removeBlockWord,
        clearBlockWord: clearBlockWord,
        getBlockWord: getBlockWord
    }
    return publicAPI;
});
