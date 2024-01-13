
let words;
let order = 4;
let ngrams = {};

let input_box = document.getElementById("input_text");
let input_text = "";
let answer_box = document.getElementById("answer_text");

function build_chain() {
    for (let i = 0; i < words.length - order; i++) {
        let word = words[i];
        for (let j = 0; j <= word.length - order; j++) {
            let gram = word.slice(j, j + order);
            let next = word[j + order] || "";
            if (!ngrams[gram]) {
                ngrams[gram] = [];
            }
            ngrams[gram].push(next);
        }
    }
    Object.keys(ngrams).forEach(key => {
        ngrams[key].push(" ");
      });
}

function generate_text(currentGram) {
    let generated_text = ""
    for (let i = 0; i < Math.floor(30 + Math.random()*101); i++) {
        if (!ngrams[currentGram]) {
            currentGram = Object.keys(ngrams)[Math.floor(Math.random() * Object.keys(ngrams).length)].slice(0, order);
        }
        let possibilities = ngrams[currentGram];
        let next = possibilities[Math.floor(Math.random() * possibilities.length)];
        generated_text += next;
        let len = generated_text.length;
        currentGram = generated_text.slice(len - order, len);
    }
    return generated_text;
}

function generate_answer() {
    input_text = input_box.value.toLowerCase();
    console.log(input_text);
    let answer = generate_text(input_text.slice(input_text.length - order, input_text.length));
    console.log(answer);
    answer_box.innerHTML = answer;
}

fetch("./words_dictionary.json").then(function (response) {
    return response.json();
}).then(function (json) {
    words = Object.keys(json);
    console.log(words);
    build_chain();
    console.log(ngrams);
});

