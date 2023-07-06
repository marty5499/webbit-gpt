import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'

/**
 * filename：wa-run-python.js
 * descript：按下此按鈕，可以使用 pyodide 套件執行 python 程式
 * associate: editor , wa-output , Main
 * Author: Marty
 * Date: 2022/02
 */
export class RunPython extends LitElement {

    static properties = {
        console: {},
    };

    constructor() {
        super();
    }

    static styles = [css`
    svg {
        fill: #990;
        width: 24px;
        height: 24px;
    }  
    .btn {
        transition: all 0.5s ease;
        cursor: pointer;
        color: #990;
        float:left;
        font-size: 16px;
        display: flex;
        align-items: center; 
        width:70px;
    }
    .btn:hover {
        transform: translateY(-3px);
        color: #fff;
    }
    .btn svg + span {
        margin-left: 1px;
      }     
  `];

    async runPythonCode(code) {
        try {
            await this.pyodide.runPythonAsync(code);
            return null;
        } catch (err) {
            if (err instanceof this.pyodide.PythonError) {
                var errMsg = err.message.split('\n').slice(-3).join(' ');
                var result = errMsg.replace(/(line )(\d+)/, function (match, p1, p2) {
                    return p1 + (parseInt(p2) - 2);
                });
                return result;
            } else {
                throw err;
            }
        }
    }

    async firstUpdated() {
        let self = this;
        const run = this.renderRoot.querySelector("#run");
        const icon = this.renderRoot.querySelector("#icon");
        const output = document.getElementById(this.console);
        this.run = run;

        function stdout_func(msg) {
            output.show(msg);
            output.scrollBottom();
        }

        function stderr_func(msg) {
            output.show(msg);
            output.scrollBottom();
        }

        function convertCode(code) {
            var imp = 'import js\nimport asyncio\n';
            var convertCode = imp +
                //code.replace(/input()\(/g, 'str(await js.window.Main.input()');
                code.replaceAll(/input\(/g, 'await js.window.Main.input(');
            //console.log("=========\n", convertCode);
            return convertCode;
        }

        run.addEventListener('click', async function () {
            output.cls();
            var newCode = convertCode(editor.getCode());
            self.runPythonCode(newCode).then(result => {
                if (result != null) {
                    result = result.substring(result.indexOf(',') + 1);
                    output.showErr(result);
                }
            });
            //pyodide.runPython(editor.getCode());
        });

        let pyodide;
        console.log("init pyodide....");
        pyodide = await loadPyodide({
            //stdin: stdin_func,
            stdout: stdout_func,
            stderr: stderr_func,
        });
        run.style['color'] = '#eee';
        icon.style['fill'] = '#eee';

        window.Main.input = async function (msg) {
            return new Promise((resolve, reject) => {
                output.addInput(msg, function (rtnData) {
                    resolve(rtnData);
                })
            });
        }
        this.pyodide = pyodide;
        this.output = output;
        // Pyodide is now ready to use...
        console.log("pyodide ready !");
        run.removeAttribute('disabled');
    }

    testCase(idx, newCode, sampleinput, sampleoutput) {
        console.log("testcase #" + idx);
        //        console.log("sampleinput:" + sampleinput);
        //        console.log("sampleoutput:" + sampleoutput);
        let allInputData = ''; // for debug
        this.pyodide.setStdin({
            stdin: function () {
                var anInput = sampleinput.shift();
                if (typeof (anInput) == 'undefined') {
                    throw "EOF";
                } else {
                    anInput = anInput + '\n';
                }
                allInputData += anInput;
                return anInput;
            },
            //autoEOF: true
        });
        var self = this;
        return new Promise((resolve, reject) => {
            this.output.cls();
            self.runPythonCode(newCode).then(result => {
                if (result != null) {
                    result = result.substring(result.indexOf(',') + 1);
                    output.showErr(result);
                }
                var outputData = self.output.getOutputData();
                //cut of last \n
                outputData = outputData.substring(0, outputData.length - 1);
                //console.log("sampleinput=", sampleinput, " \noutputData=" + outputData);
                let correctOutput = sampleoutput.join('\n');
                let resultOutput = outputData;
                //console.log("input:", allInputData, " , check [" + correctOutput + "]==[" + resultOutput + "]");
                //console.log(correctOutput, correctOutput.length);
                //console.log(resultOutput, resultOutput.length);
                resolve(correctOutput == resultOutput);
            });
        });
    }

    async frontTest(exam) {
        //var exam = document.getElementById("exam");
        var info = exam.getInfo();
        // copy testdata
        var sample = JSON.parse(info['sample']);
        this.output.cls();
        var newCode = editor.getCode();
        var success = true;
        for (var i = 0; i < sample.length; i = i + 2) {
            var idx = (i / 2) + 1;
            var input = sample[i];
            var out = sample[i + 1];
            //            console.log(">>>", input, out);
            var result = await this.testCase(idx, newCode, input, out);
            if (!result) {
                success = false;
                break;
            }
        }
        alert('測試' + (success ? "成功" : "失敗"));
    }

    hide(state) {
        if (state) {
            this.run.style['display'] = 'none';
        } else {
            this.run.style['display'] = '';
        }
    }

    render() {
        return html`
        <div id='run' class='btn'>
        <svg id='icon' viewBox="0 0 24 24">
            <path d="M3 22V2L19 12L3 22Z" fill="currentColor"/>
        </svg>
        <span>執行</span>
        </div>
        `;
    }
}
customElements.define('wa-run-python', RunPython);
