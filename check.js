(function () {
    require(['./LCS_algorithm'], function (LCS) {
        document.getElementById('comfirm').addEventListener('click', function () {
            let a = document.getElementById('textA').innerText.split('');
            let b = document.getElementById('textB').innerText.split('');
            LCS.setArrayA(a);
            LCS.setArrayB(b);
            let result = LCS.getLCSString();
            let repeatA = LCS.getRepeatA();
            for (index of repeatA) {
                a[index] = `<i>${a[index]}</i>`;
            }
            let repeatB = LCS.getRepeatB();
            for (index of repeatB) {
                b[index] = `<i>${b[index]}</i>`;
            }
            document.getElementById('textA').innerHTML = a.join('');
            document.getElementById('textB').innerHTML = b.join('');
            document.getElementById('result').innerHTML = `<h4>重复部分为</h4><p>${result}</p><h4>重复率：<span class="number">${LCS.getPercentage()}%</span></h4>`;
            console.log(LCS.getLCSLength());
        });
        let loadFile = document.getElementsByClassName('load');
        for (let i = 0; i < loadFile.length; i++) {
            loadFile[i].addEventListener('click', function () {
                this.previousElementSibling.click();
                console.log(fa===this.previousElementSibling||fb===this.previousElementSibling);
            })
        }
        let fa = document.querySelector('.boxA > div.option > input[type=file]');
        let fb = document.querySelector('.boxB > div.option > input[type=file]');
        fa.onchange = function () {
            let file = this.files[0];
            let reader = new FileReader();
            reader.readAsText(file, 'utf-8');
            reader.onload = function () {
                let string = reader.result;
                document.getElementById('textA').innerHTML = string;
                fa.value='';
            }
        }
        fb.onchange = function () {
            let file = this.files[0];
            let reader = new FileReader();
            reader.readAsText(file, 'utf-8');
            reader.onload = function () {
                let string = reader.result;
                document.getElementById('textB').innerHTML = string;
                fb.value='';
            }
        }
        let clearButts = document.getElementsByClassName('clear');
        for (let i = 0; i < clearButts.length; i++) {
            clearButts[i].addEventListener('click', function () {
                this.parentElement.parentElement.lastElementChild.innerHTML = '';
            })
        }
    });
})();
