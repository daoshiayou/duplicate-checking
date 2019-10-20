/* 
    FIXME: Edge will throw error on this script, I'll use Babel to comppile again later
            But now, let focus on the logic
*/
(function () {
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
    require(['./multiple_file'], function (MF) {
        // fileUl.addEventListener('click', function (e) {
        //     //TODO: click file to show detail
        //     fileContent.innerHTML = '';
        //     debugger;
        //     MF.markContent(this.textContent, fileContent);
        // });
        inputFile.onchange = function () {
            inputButton[0].classList.add('hide');
            inputButton[1].classList.remove('hide');
            let files = this.files;
            fileUl.innerHTML = '';
            fileUl.classList.remove('hide');
            for (let i = 0; i < files.length; i++) {
                // for (file of files) {
                //show file'name in ul
                let li = newFileLi(files[i].name);
                fileUl.appendChild(li);
                let reader = new FileReader();
                reader.name = files[i].name;
                reader.readAsText(files[i], 'utf-8');
                reader.onload = function () {
                    let string = reader.result;
                    //TODO: pass the string to the multiple module
                    MF.addFile(reader.name, string);
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
                if (MF.isValid(this.textContent)) {
                    fileContent.innerHTML = MF.markAllContent(this.textContent);
                }
            });
            return li;
        }
    });

})();