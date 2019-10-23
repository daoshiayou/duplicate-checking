/** Module's funtion:   1. stoge files'name and its content
 *                      2. stage the record of compare between files
 *                      3. stage the highlight remark of thr files
 *                      4. deal with input files' operation: compare, filter out, mark, package
 */

define(['LCS_algorithm'], function (LCS) {
    'use strict';
    let files = new Map();

    function addFile(name, content) {
        //初始化value
        let value = {};
        value.content = content;
        let record = new Map();
        value.record = record;
        value.isValid = true;
        LCS.setArrayA(content);

        //用于异步等待value记录完成
        let promise = new Promise(function (resolve, reject) {
            //存放文件遍历的Promise对象
            let pArr = [];
            //遍历文件建立Promise异步执行比较
            for (let [fileKey, fileValue] of files) {
                let p = new Promise(function (resolve, reject) {
                    setTimeout(() => {
                        //如果该文件无效或者对比文件无效，直接跳过比较
                        if (!value.isValid || !fileValue.isValid) {
                            resolve();
                        }
                        //开始比较
                        LCS.setArrayB(fileValue.content);
                        value.record.set(fileKey, copy(LCS.getRepeatA()));
                        //如果有高重复文件，将这个文件置为无效
                        if (LCS.getPercentage() > 30) {
                            value.isValid = false;
                        }
                        //在比较文件中记录重复下标
                        fileValue.record.set(name, copy(LCS.getRepeatB()));
                        resolve();
                    }, 500);
                });
                pArr.push(p);
            }
            //当所有文件遍历完成后
            Promise.all(pArr).then(function () {
                files.set(name, value);
            });
        });
    }

    //addFile
    function addFile_bak(name, content) {
        let value = firstCompare(name, content);
        files.set(name, value);
    }
    function firstCompare(name, content) {
        LCS.setArrayA(content);
        let value = {};
        value.content = content;
        value.isValid = true;
        let record = new Map();
        for (let [fileKey, fileValue] of files) {
            //跳过高重复文件
            if (fileValue.isValid === false) {
                continue;
            }
            LCS.setArrayB(fileValue.content);
            //记录比较结果
            let repeat = copy(LCS.getRepeatA());
            record.set(fileKey, repeat);
            //如果高重复，标记并退出循环
            if (LCS.getPercentage() > 30) {
                value.isValid = false;
                break;
            }
            //如果不是高重复，在比较文件记录其比较结果
            repeat = copy(LCS.getRepeatB());
            fileValue.record.set(name, repeat);
            fileValue.recordIndexes = undefined;
        }
        value.record = record;
        return value;
    }
    //继续比较高重复文件
    // function compare(name) {
    //     let value = files.get(name);
    //     LCS.setArrayA(value.content);
    //     for (let [fileKey, fileValue] of files) {
    //         //跳过自己
    //         if (fileKey === name) {
    //             continue;
    //         }
    //         //跳过已比较的文件
    //         if (files.get(name).record.has(fileKey)) {
    //             continue;
    //         }
    //         LCS.setArrayB(fileValue.content);
    //         value.record.set(fileKey, LCS.getRepeatA());
    //         //不在比较文件里记录了
    //     }
    //     files.set(name, value);
    // }
    function delFile(name) {
        files.delete(name);
        for (let content of files.keys()) {
            content.value.record.delete(name);
        }
    }
    function calRecordIndexes(name) {
        let value = files.get(name);
        let indexes = [];
        for (let array of value.record.values()) {
            array.forEach((index) => {
                if (!indexes.find((item) => item === index)) {
                    indexes.push(index);
                }
            })
        }
        indexes.sort((a, b) => b - a);
        value.recordIndexes = indexes;
        files.set(name, value);
    }
    function markAllContent(name) {
        let file = files.get(name);
        if (!file.recordIndexes) {
            calRecordIndexes(name);
        }
        let text = file.content;
        let array = file.recordIndexes;
        let preIndex = array[0];
        text = stringSplice(text, preIndex + 1, 0, '</i>');
        for (let i = 1; i < array.length - 2; i++) {
            //判断和preIndex是否连续
            if (array[i] != preIndex - 1) {
                text = stringSplice(text, preIndex, 0, '<i class="allFiles">')
                text = stringSplice(text, array[i] + 1, 0, '</i>');
            }
            preIndex = array[i];
        }
        text = stringSplice(text, array[array.length - 1], 0, '<i class="allFiles">');
        return text;
    }



    //Util
    function createTagI(index) {
        let tagI = document.createElement('i');
        tagI.classList.add('color' + index);
        return tagI;
    }
    function clearFiles() {
        files.clear();
    }
    //TODO: export
    function stringSplice(string, begin, deleteCount, ...item) {
        let array = string.split('');
        array.splice(begin, deleteCount, ...item);
        return array.join('');
    }
    function copy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }


    //public

    let publicAPI = {
        addFile: addFile,
        delFile: delFile,
        // compare: compare,
        markAllContent: markAllContent,
        clearFiles: clearFiles,
        isValid: (name) => files.get(name).isValid
    };
    return publicAPI;
});