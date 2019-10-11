(function () {
    let inputFile = document.querySelector('input[type="file"]');
    let inputButton = document.querySelectorAll('.file-input button');
    inputButton.forEach((node) => {
        node.addEventListener('click', function () {
            inputFile.click();
        });
    });
    let fileUl = document.querySelector('.files');
    fileUl.addEventListener('click', function () {
        alert(this.innerHTML);
    }, true);
    inputFile.onchange = () => {
        debugger;
        inputButton[0].classList.add('hide');
        inputButton[1].classList.remove('hide');
        let files = this.files;
        fileUl.innerHTML = '';
        fileUl.classList.remove('hide');
        for (file of files) {
            //show file'name in ul
            let li = newFileLi(file.name);
            fileUl.appendChild(li);
            let reader = new FileReader();
            reader.readAsText(file, 'utf-8');
            reader.onload = function () {
                let string = reader.result;
                document.getElementById('file-content').innerHTML = string;
            }
        }
        inputFile.value = '';
    }

    function changeMode() {
        
    }
    function newFileLi(fileName) {
        let li = document.createElement('li');
        //NOTE: 如果后面要做多文件类型再更正，这里先做txt了
        let img = document.createElement('img');
        img.src = '/img/txt.jpg';
        li.appendChild(img);
        li.appendChild(document.createTextNode(fileName));
        return li;
    }
    // function 
    function showFile() { }
})();