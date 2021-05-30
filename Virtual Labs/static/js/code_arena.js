let template = document.getElementById("code-question-template");
let template_container = document.getElementsByClassName("template-container")[0];

let test_cases = [];
let test_cases_solved = [];
let codeMirrors = [];

for (let idx = 0; idx < problems.length; idx++) {
    let problem = problems[idx];
    let clone = template.content.cloneNode(true);
    let mainDiv = clone.children[0];
    mainDiv.id = idx;

    let title = clone.querySelector("#code-question-title");
    title.textContent = problem["title"];

    let desc = clone.querySelector("#code-question-desc");
    desc.innerHTML = problem["desc"];

    let inputs = clone.querySelector("#code-question-inputs");
    for (let input of problem["inputs"]) {
        inputs.innerHTML += `<p>${input}</p>`;
    }

    let outputs = clone.querySelector("#code-question-outputs");
    for (let output of problem["outputs"]) {
        outputs.innerHTML += `<p>${output}</p>`;
    }

    let area = clone.querySelector("#code-question-area");
    let codeMirror = CodeMirror.fromTextArea(area, {
        matchBrackets: true,
        mode: "text/x-c++src",
        indentUnit: 2,
        theme: "material"
    });
    codeMirrors.push(codeMirror);

    template_container.appendChild(clone);

    test_cases.push(problem["inputs"].length);
    test_cases_solved.push(0);
}

// console.log(test_cases);
// console.log(test_cases_solved);
// console.log(codeMirrors);


let runButtons = document.getElementsByClassName("run-button");
for (let btn of runButtons) {
    btn.onclick = async function () {
        let code_question = this.parentElement.parentElement.parentElement.parentElement;
        let id = code_question.id;

        let source = codeMirrors[id].getValue();
        let lang = code_question.querySelector(".code-lang").value;

        let inputs = problems[id]["inputs"];
        let expected_output = problems[id]["outputs"];
        let outputDest = code_question.querySelector(".code-area-output");

        let outputs = await runSnippet(source, lang, outputDest, inputs);
        let results = 0
        for (let idx = 0; idx < outputs.length; idx++) {
            let output = outputs[idx].trim();
            if (output == expected_output[idx])
                results++;
        }

        let old_solved = test_cases_solved[id];
        if (old_solved < results) {
            test_cases_solved[id] = results;
            allowCertificate();
        }

        let outputSummary = code_question.querySelector("#code-question-summary");
        outputSummary.textContent = test_cases_solved[id] + "/" + test_cases[id] + " solved";
        console.log(outputSummary);
    }
}

let runSnippet = async function (source, lang, output, inputs) {
    outputs = [];
    for (let input of inputs) {
        const data = JSON.stringify({
            "language": lang,
            "source": source,
            "stdin": input
        });
        const options = {
            method: 'POST',
            url: 'https://emkc.org/api/v1/piston/execute',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        let response = await axios.request(options);

        let json = response.data;
        let output_p = output.children[0];
        let result;

        if (json["stderr"]) {
            result = json["stderr"];
            output_p.style.color = "red";

        } else {
            result = json["output"];
            output_p.style.color = "green";
        }

        output_p.textContent = result;
        outputs.push(result);
    }

    return outputs;
}

function allowCertificate() {
    let total = test_cases.reduce((total, num) => total + num, 0);
    let solved = test_cases_solved.reduce((total, num) => total + num, 0);
    if (solved / total >= 0.8) {

        let certButton = document.getElementById("cert-button");
        if (!certButton) {
            if (localStorage.getItem("studentName") == null)
                template_container.innerHTML += `
                    <div class='heading1'>Congratulations on solving the problems, here is your certificate!</div>
                    <div class='row my-3'>
                        <div class='col-4-lg col-4 col-12-md my-2'>
                            <input type='text' id='studentName' class='form-control' placeholder='Enter your name here' />
                        </div>
                        <button class='gradient-head btn btn-light border col-auto my-2' onclick='generateCertificate(this)'>Download certificate</button>
                    </div>`;
            else
                template_container.innerHTML += `
                    <div class='heading1'>Congratulations on solving the problems, here is your certificate!</div>
                    <div class='row my-3'>
                        <div class='col-4-lg col-4 col-12-md my-2'>
                            <input type='text' id='studentName' class='form-control' value='${localStorage.getItem('studentName')}' disabled/>
                        </div>
                        <button class='gradient-head btn btn-light border col-auto my-2' onclick='generateCertificate(this)'>Download certificate</button>
                    </div>`;

            let lastChild = template_container.childNodes[template_container.childElementCount];
            scrollTo(lastChild);
        }
    }
}

const generateCertificate = function (e) {
    let expt = "CUSTOMIZE HERE";
    let parent = e.parentElement;
    let name;
    if (localStorage.getItem("studentName") == null) {
        localStorage.setItem("studentName", parent.querySelector("input").value);
    }
    name = localStorage.getItem("studentName")
    let now = new Date();

    let certificate_container = document.getElementsByClassName("certificate")[0];

    certificate_container.innerHTML = `
        <div class="text-center border border-5 p-3 border-secondary">
            <div class="text-center border border-1 border-secondary">
                <div class="h2 fw-bold my-5 gradient-head">Certificate of Completion</div>

                <div class="h4 fw-normal"><i>This is to certify that</i></div>
                <br><br>
                <span class="h3 text-decoration-underline"><b>${name}</b></span><br /><br />
                <span class="h5 fw-lighter"><i>has completed the coding assignments</i></span> <br /><br />
                <span class="h3">${expt}</span> <br /><br />
                <span class="h6 fw-normal">with score of more than <b>80%</b></span> <br /><br /><br /><br />
                <div class="h5 my-3">${now.toDateString()}</div>

            </div>
        </div>`;

}