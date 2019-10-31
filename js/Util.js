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

    return {
        stringSplice: stringSplice,
        copy: copy,
        co: co
    }
});