/* 
    FIXME: Edge will throw error on this script, I'll use Babel to comppile again later
            But now, let focus on the logic
*/
(function () {
    require(['./multiple_file'], function (MF) {
        let inputFile = document.querySelector('input[type="file"]');
        let inputButton = document.querySelectorAll('.file-input button');
        // files
        inputButton.forEach((node) => {
            node.addEventListener('click', function () {
                inputFile.click();
            });
        });
        let fileUl = document.querySelector('.files');
        let fileContent = document.getElementById('file-content');
        inputFile.onchange = function () {
            inputButton[0].classList.add('hide');
            inputButton[1].classList.remove('hide');
            let files = this.files;
            fileUl.innerHTML = '';
            fileUl.classList.remove('hide');
            for (let i = 0; i < files.length; i++) {
                //show file'name in ul
                let li = newFileLi(files[i].name);
                fileUl.appendChild(li);
                let reader = new FileReader();
                reader.name = files[i].name;
                // reader.readAsText(files[i], 'utf-8');
                reader.readAsText(files[i], 'gb2312');
                reader.onload = function () {
                    let string = reader.result;
                    string = string.replace(/\n/g,'<br>');
                    console.time('addFile');

                    MF.addFile(reader.name, string);

                    console.timeEnd('addFile');
                }
            }
            inputFile.value = '';
        }
        function newFileLi(fileName) {
            let li = document.createElement('li');
            //NOTE: 如果后面要做多文件类型再更正，这里先做txt了
            //FIXME: 谷歌浏览器中，使用js添加的文本节点无法应用font-size
            // li.innerHTML = fileName;
            let img = document.createElement('img');
            img.src = '/img/txt.jpg';
            // li.appendChild(img);
            li.innerHTML = fileName;
            li.insertBefore(img, li.childNodes[0]);
            li.addEventListener('click', function () {
                //TODO: show detail
                if (!MF.isValid(this.textContent)) {
                    MF.compare(this.textContent);
                }

                console.time('markAll');
                
                fileContent.innerHTML = MF.markAllContent(this.textContent);

                console.timeEnd('markAll');
            });
            return li;
        }
        //TODO: download the txt
        let downloadBut = document.getElementById('download');
        let editor = document.getElementById('editor');
        downloadBut.addEventListener('click', function () {
            let text = editor.textContent;
            let fileName = prompt('输入保存的文件名：', '各方面都不行的查重工具下载的没用文档');
            download(fileName, text);
        });
        function download(fileName, text) {
            let ele = document.createElement('a');
            ele.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            ele.setAttribute('download', fileName);
            ele.click();
        }
    });
})();