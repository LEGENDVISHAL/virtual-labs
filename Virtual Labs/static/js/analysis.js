let mcq_template = document.getElementById("mcq-template");
let mcq_container = document.getElementsByClassName("mcq-container")[0];

for (let mcq of mcqs) {
    let clone = mcq_template.content.cloneNode(true);
    let mcq_image = clone.getElementById("mcq-image");
    if (mcq["image"] != "")
        mcq_image.src = mcq["image"];
    else
        mcq_image.style.display = "none";

    let mcq_question = clone.getElementById("mcq-question");
    mcq_question.textContent = mcq["question"];

    let mcq_options = clone.getElementById("mcq-options");
    let options = [];

    for (let idx = 0; idx < mcq["options"].length; idx++) {
        let option = mcq["options"][idx];
        if (idx == 0)
            options.push(`<button type="button" class="btn border btn-sm mx-1 correct" onclick="showAnswer(this)">${option}</button>`);
        else
            options.push(`<button type="button" class="btn border btn-sm mx-1" onclick="showAnswer(this)">${option}</button>`);
    }

    options = options.sort(() => Math.random() - 0.5);
    mcq_options.innerHTML = ""
    for (let idx = 0; idx < options.length; idx++) {
        let option = options[idx];
        mcq_options.innerHTML += option;
    }

    mcq_container.appendChild(clone);
}

const showAnswer = function (btn) {
    if (btn.classList.contains("correct"))
        btn.classList += " btn-success";
    else
        btn.classList += " btn-danger";
};