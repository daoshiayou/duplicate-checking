function LCS() {
    let arrayA, arrayB, lengthArr, LCSString, percentage;
    let strategy = priorA;
    let repeatA = [], repeatB = [];
    function setArrayA(a) {
        if (typeof (a) === 'string') {
            arrayA = a.split('');
        } else if (a instanceof Array) {
            arrayA = a;
        } else {
            throw new Error('TypeError: arrayA must be a string or an array');
        }
    }
    function getArrayA() { return arrayA; }
    function getArrayB() { return arrayB; }
    function setArrayB(b) {
        if (typeof (b) === 'string') {
            arrayB = b.split('');
        } else if (b instanceof Array) {
            arrayB = b;
        } else {
            throw new Error('TypeError: arrayB must be a string or an array');
        }
    }
    function calLength() {
        if (arrayA === undefined || arrayB === undefined) {
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
    function calLCS() {
        if (arrayA === undefined || arrayB === undefined) {
            throw new Error('TypeError: arrayA or arrayB is undefined');
        }
        if (lengthArr === undefined) {
            calLength();
        }
        repeatA.splice(0, repeatA.length);
        repeatB.splice(0, repeatB.length);
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
                temp.push(arrayA[indexA - 1]);
                repeatA.push(indexA - 1);
                repeatB.push(indexB - 1);
                indexA--;
                indexB--;
            } else {
                [indexA, indexB] = strategy(indexA, indexB);
            }
        }
        LCSString = temp.reverse().join('');
        percentage = (LCSString.length / arrayA.length * 100).toFixed(2);
    }
    function getLCSLength() {
        if (lengthArr === undefined) {
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
        if (percentage === undefined) {
            calLCS();
        }
        return percentage;
    }
    function getRepeatA() {
        return repeatA;
    }
    function getRepeatB() {
        return repeatB;
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
        changeStrategy: changeStrategy
    }
    return publicAPI;
}
