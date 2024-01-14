
let words;
let order = 4;
let ngrams = {};

let input_box = document.getElementById("input_text");
let input_text = "";
let answer_box = document.getElementById("answer_text");

String.prototype.hashCode = function () {
    var hash = 0,
        i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
function jsf32(a, b, c, d) {
    return function () {
        a |= 0; b |= 0; c |= 0; d |= 0;
        var t = a - (b << 27 | b >>> 5) | 0;
        a = b ^ (c << 17 | c >>> 15);
        b = c + d | 0;
        c = d + t | 0;
        d = a + t | 0;
        return (d >>> 0) / 4294967296;
    }
}

function build_chain() {
    for (let i = 0; i < words.length - order; i++) {
        let word = words[i];
        for (let j = 0; j <= word.length - order; j++) {
            let gram = word.slice(j, j + order);
            let next = word[j + order];
            if (!ngrams[gram]) {
                ngrams[gram] = [];
            }
            if (next) {
                ngrams[gram].push(next);
            }
        }
    }
    Object.keys(ngrams).forEach(key => {
        ngrams[key].push(" ");
    });
}

function generate_text(currentGram, rng) {
    let generated_text = ""
    let num_words = Math.floor(70 + rng() * 500);
    console.log("Number of words", num_words);
    for (let i = 0; i < num_words; i++) {
        if (!ngrams[currentGram]) {
            currentGram = Object.keys(ngrams)[Math.floor(rng() * Object.keys(ngrams).length)].slice(0, order);
        }
        let possibilities = ngrams[currentGram];
        let next = possibilities[Math.floor(rng() * possibilities.length)];
        generated_text += next;
        let len = generated_text.length;
        currentGram = generated_text.slice(len - order, len);
    }
    return generated_text;
}

function generate_answer() {
    input_text = input_box.value.toLowerCase();
    seed = input_text.hashCode();
    rng = jsf32(0xF1EA5EED, seed, seed, seed);
    let answer = generate_text(input_text.slice(input_text.length - order, input_text.length), rng);
    console.log(answer);
    console.log(answer.length);
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

