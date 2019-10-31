(function () {
    console.time('load');
    require(['./Util', './LCS_algorithm'], function (Util, LCS) {
        document.getElementById('comfirm').addEventListener('click', function () {
            console.time('LCS');
            let a = document.getElementById('textA').innerHTML.replace(/(<i.*?>|<\/i>)/g, '').replace(/<br>/g, '\r\n');
            let b = document.getElementById('textB').innerHTML.replace(/(<i.*?>|<\/i>)/g, '').replace(/<br>/g, '\r\n');
            LCS.setArrayA(a);
            LCS.setArrayB(b);
            let result = LCS.getLCSString();
            let repeatA = LCS.getRepeatA();
            a = Util.textProcess(a, repeatA);
            let repeatB = LCS.getRepeatB();
            b = Util.textProcess(b, repeatB);
            document.getElementById('textA').innerHTML = a.replace(/(\r\n|\r|\n)/g, '<br>');
            document.getElementById('textB').innerHTML = b.replace(/(\r\n|\r|\n)/g, '<br>');
            let string = `<h4>重复部分为</h4><p>${result}</p><h4>重复率：<span class="${LCS.getPercentage() < 30 ? 'green' : 'red'}">${LCS.getPercentage()}%</span></h4>`;
            document.getElementById('result').innerHTML = string;
            console.timeEnd('LCS');
        });
        let loadFile = document.getElementsByClassName('load');
        for (let i = 0; i < loadFile.length; i++) {
            loadFile[i].addEventListener('click', function () {
                this.previousElementSibling.click();
            })
        }

        let fa = document.querySelector('.boxA > div.option > input[type=file]');
        let fb = document.querySelector('.boxB > div.option > input[type=file]');
        fa.onchange = function () {
            let file = this.files[0];
            let reader = new FileReader();
            // reader.readAsText(file, 'utf-8');
            reader.readAsText(file, 'gb2312');
            reader.onload = function () {
                let string = reader.result;
                string = string.replace(/(\r\n|\r|\n)/g, '<br>');
                document.getElementById('textA').innerHTML = string;
                fa.value = '';
            }
        }
        fb.onchange = function () {
            let file = this.files[0];
            let reader = new FileReader();
            // reader.readAsText(file, 'utf-8');
            reader.readAsText(file, 'gb2312');
            reader.onload = function () {
                let string = reader.result;
                string = string.replace(/(\r\n|\r|\n)/g, '<br>');
                document.getElementById('textB').innerHTML = string;
                fb.value = '';
            }
        }
        let clearButts = document.getElementsByClassName('clear');
        for (let i = 0; i < clearButts.length; i++) {
            clearButts[i].addEventListener('click', function () {
                this.parentElement.parentElement.lastElementChild.innerHTML = '';
            })
        }
    });
    console.timeEnd('load');
})();
