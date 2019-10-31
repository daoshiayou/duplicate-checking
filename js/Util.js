/**
 * 自定义工具
 * @module Util
 */
define(function () {

    /**
     * string实现模拟数组的splice
     * @param {string} string 要切割的数组
     * @param {num} begin 开始下标
     * @param {num} deleteCount 要删除的元素数目
     * @param  {...any} item 要添加的字符串
     * @return {string} 处理完的字符串
     */
    function stringSplice(string, begin, deleteCount, ...item) {
        let array = string.split('');
        array.splice(begin, deleteCount, ...item);
        return array.join('');
    }

    /**
     * 对象深拷贝
     * @param {*} obj 
     * @return {*} 拷贝后的对象
     */
    function copy(obj) {
        // debugger;
        if (obj instanceof Array) {
            return obj.slice(0, obj.length);
        }
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * 生成器自轮转
     * @param {generator} gen 要跑的生成器
     * @return {Promise}
     */
    function co(gen) {
        return new Promise((resolve, reject) => {
            (function next(data) {
                let { value, done } = gen.next(data);
                if (!done) {
                    Promise.resolve(value).then((data) => next(data));
                } else {
                    resolve(data);
                }
            })();
        });
    }

    /** 处理处理字符串的输出：转换换行和添加标记
     *  @method textProcess
     *  @param {string} text 要处理的字符串
     *  @param {num[]} array 需要在周围添加标记的字符位置下标
     *  @param {string} [iClass = ''] 添加的<i>标记类名（用于后续添加样式
     *  @return {string} 处理好的带标记的字符串
     */
    function textProcess(text, array, iClass = '') {
        let preIndex = array[0];
        let result = stringSplice(text, preIndex + 1, 0, '</i>');
        for (let i = 1; i < array.length; i++) {
            //判断和preIndex是否连续
            if (array[i] != preIndex - 1) {
                result = stringSplice(result, preIndex, 0, '<i class=' + iClass + '>')
                result = stringSplice(result, array[i] + 1, 0, '</i>');
            }
            preIndex = array[i];
        }
        result = stringSplice(result, array[array.length - 1], 0, '<i class=' + iClass + '>');
        result = result.replace(/(\r\n|\r|\n)/g, '<br>');
        return result;
    }

    return {
        stringSplice: stringSplice,
        copy: copy,
        co: co,
        textProcess: textProcess
    }
});