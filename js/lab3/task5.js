const countVowels = (str) => {
    const vowels = "аеєиіїоуюяaeiou";
    let count = 0;

    for (let char of str.toLowerCase()) {
        if (vowels.includes(char)) {
            count++;
        }
    }

    return count;
};

function runTask5() {
    const text = document.getElementById("textInput").value;
    const result = countVowels(text);

    document.getElementById("result5").textContent =
        `Кількість голосних літер: ${result}`;

    console.log("Завдання 5:", result);
}
