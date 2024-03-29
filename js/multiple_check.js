/* 
    FIXME: Edge will throw error on this script, I'll use Babel to comppile again later
            But now, let focus on the logic
*/
(function () {
    require(['./Util', './multiple_file'], function (Util, MF) {

        //文件上传
        let inputFile = document.querySelector('input[type="file"]');
        let inputButton = document.querySelectorAll('.file-input button');
        inputButton.forEach((node) => {
            node.addEventListener('click', function () {
                inputFile.click();
            });
        });
        let fileUl = document.querySelector('.files');
        let fileDiv = document.querySelector('.files-div');
        let validUl = document.querySelector('.valid-files');
        let fileContent = document.getElementById('file-content');
        inputFile.onchange = async function () {
            inputButton[0].classList.add('hide');
            inputButton[1].classList.remove('hide');
            MF.clearFiles();
            fileUl.innerHTML = '';
            validUl.innerHTML = '';
            fileContent.innerHTML = '';
            let files = this.files;
            fileDiv.classList.remove('hide');

            // //我和我最后的倔强，async的写法
            // for (let i = 0; i < files.length; i++) {
            //     let li = newFileLi(files[i].name);
            //     let name = await readFile(files[i]);
            //     if (MF.isValid(name)) {
            //         fileUl.appendChild(li);
            //     } else {
            //         validUl.appendChild(li);
            //     }
            // }
            // function readFile(file) {
            //     return new Promise(function (resolve, reject) {
            //         let reader = new FileReader();
            //         reader.name = file.name;
            //         reader.readAsText(file, 'gb2312');
            //         reader.onload = () => {
            //             let string = reader.result;
            //             let promise = MF.addFile(reader.name, string);
            //             promise.then(() => {
            //                 resolve(reader.name);
            //             });
            //         }
            //     });
            // }

            function* liGen(fileList) {
                for (let i = 0; i < fileList.length; i++) {
                    let li = newFileLi(fileList[i].name);
                    if (yield new Promise(function (resolve, reject) {
                        let reader = new FileReader();
                        reader.name = fileList[i].name;
                        reader.readAsText(fileList[i], 'gb2312');
                        // reader.readAsText(fileList[i], 'utf-8');
                        reader.onload = () => {
                            let string = reader.result;
                            let promise = MF.addFile(reader.name, string);
                            promise.then(() => {
                                resolve(MF.isValid(reader.name));
                            });
                        }
                    })) {
                        fileUl.appendChild(li);
                    } else {
                        validUl.appendChild(li);
                    }
                }
                inputFile.value = '';
            }
            let gen = liGen(files);
            Util.co(gen);
        }
        let fileOn;
        function newFileLi(fileName) {
            let li = document.createElement('li');
            //NOTE: 如果后面要做多文件类型再更正，这里先做txt了
            //FIXME: 谷歌浏览器中，使用js添加的文本节点无法应用font-size
            let img = document.createElement('img');
            img.src = '/img/txt.png';
            li.innerHTML = fileName;
            li.insertBefore(img, li.childNodes[0]);
            li.addEventListener('click', function () {
                if (!!fileOn) {
                    fileOn.classList.remove('on');
                }
                li.classList.add('on');
                fileOn = li;
                let name = this.textContent;
                if (!MF.isValid(name)) {
                    // MF.compare(this.textContent);
                }
                console.time('markAll');
                let string = MF.markAllContent(name);
                fileContent.innerHTML = string;
                console.timeEnd('markAll');
                //添加标记
                let legendUl = document.getElementById('legends');
                legendUl.innerHTML = '';
                let legendOn;
                let record = MF.getRecord(name);
                let i = 0;
                for (let [key, value] of record) {
                    i++;
                    let li = document.createElement('li');
                    li.innerHTML = `<div class="rect color${i}"></div>${key}`
                    let j = i;
                    li.addEventListener('click', () => {
                        if (!!legendOn) {
                            legendOn.classList.remove('on');
                        }
                        li.classList.add('on');
                        legendOn = li;
                        let str = MF.markCompareContent(name, key, j);
                        fileContent.innerHTML = str;
                    });
                    legendUl.append(li);
                }
            });
            return li;
        }

        //屏蔽词
        let blockUl = document.getElementById('block-word');
        let input = document.querySelector('.blockTag input');
        document.getElementById('addTag').addEventListener('click', () => {
            let li = document.createElement('li');
            let value = input.value;
            input.value = '';
            li.innerHTML = value + '<div class="x-icon"></div>';
            blockUl.append(li);
            MF.addBlockWord(value);
        });
        document.getElementById('clearTag').addEventListener('click', () => {
            blockUl.innerHTML = '';
            MF.clearBlockWord();
        });
        blockUl.addEventListener('click', (e) => {
            if (e.target.classList.contains('x-icon')) {
                let li = e.target.parentNode;
                MF.removeBlockWord(li.innerText);
                blockUl.removeChild(li);
            }
        });

        //下载
        let downloadBut = document.getElementById('download');
        let editor = document.getElementById('editor');
        downloadBut.addEventListener('click', function () {
            let text = editor.innerHTML;
            text = text.replace(/(<span.*?>|<\/span>)/g, '');
            text = text.replace(/&nbsp;/g, ' ');
            text = text.replace(/<br>/g, '\r\n');
            let fileName = prompt('输入保存的文件名：', '各方面都不行的查重工具下载的没用文档');
            if (fileName != null) {
                download(fileName, text);
            }
        });
        function download(fileName, text) {
            let ele = document.createElement('a');
            ele.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            ele.setAttribute('download', fileName);
            ele.click();
        }
    });
})();