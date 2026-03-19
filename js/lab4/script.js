function task1() {
    let fruits = ["яблуко", "банан", "груша", "апельсин", "слива"];

    console.log("Завдання 1");
    console.log("Початковий масив:", fruits);

    fruits.pop();
    console.log("1) Після видалення останнього елемента:", fruits);

    fruits.unshift("ананас");
    console.log("2) Після додавання 'ананас' на початок:", fruits);

    fruits.sort().reverse();
    console.log(
        "3) Відсортований масив у зворотному алфавітному порядку:",
        fruits,
    );

    const indexApple = fruits.indexOf("яблуко");
    console.log("4) Індекс елемента 'яблуко':", indexApple);
    console.log("-----------------------------------");
}

function task2() {
    let colors = [
        "червоний",
        "синій",
        "зелений",
        "жовтий",
        "фіолетовий",
        "синій темний",
    ];

    console.log("Завдання 2");
    console.log("Початковий масив:", colors);

    let longest = colors[0];
    let shortest = colors[0];

    for (let color of colors) {
        if (color.length > longest.length) longest = color;
        if (color.length < shortest.length) shortest = color;
    }

    console.log("1) Найдовший елемент:", longest);
    console.log("2) Найкоротший елемент:", shortest);

    let filteredColors = colors.filter((color) => color.includes("синій"));
    console.log("3) Масив після фільтрації:", filteredColors);

    let resultString = filteredColors.join(", ");
    console.log("4) Рядок після join():", resultString);

    console.log("5) Отриманий рядок:", resultString);
    console.log("-----------------------------------");
}

function task3() {
    let employees = [
        { name: "Іван", age: 25, position: "розробник" },
        { name: "Марія", age: 30, position: "дизайнер" },
        { name: "Олег", age: 22, position: "розробник" },
        { name: "Анна", age: 35, position: "менеджер" },
    ];

    console.log("Завдання 3");
    console.log("Початковий масив працівників:", employees);

    employees.sort((a, b) => a.name.localeCompare(b.name));
    console.log("1) Відсортований масив за іменами:", employees);

    let developers = employees.filter((emp) => emp.position === "розробник");
    console.log("2) Працівники з посадою 'розробник':", developers);

    employees = employees.filter((emp) => emp.age >= 25);
    console.log("3) Після видалення працівників молодше 25 років:", employees);

    employees.push({ name: "Сергій", age: 28, position: "тестувальник" });
    console.log("4) Після додавання нового працівника:", employees);
    console.log("-----------------------------------");
}

function task4() {
    let students = [
        { name: "Олексій", age: 19, course: 2 },
        { name: "Ірина", age: 21, course: 3 },
        { name: "Максим", age: 18, course: 1 },
        { name: "Наталія", age: 22, course: 4 },
    ];

    console.log("Завдання 4");
    console.log("Початковий масив студентів:", students);

    students = students.filter((student) => student.name !== "Олексій");
    console.log("1) Після видалення студента 'Олексій':", students);

    students.push({ name: "Андрій", age: 20, course: 3 });
    console.log("2) Після додавання нового студента:", students);

    students.sort((a, b) => b.age - a.age);
    console.log("3) Відсортовані студенти за віком:", students);

    const thirdCourseStudent = students.find((student) => student.course === 3);
    console.log("4) Студент 3-го курсу:", thirdCourseStudent);
    console.log("-----------------------------------");
}

function task5() {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    console.log("Завдання 5");
    console.log("Початковий масив:", numbers);

    const squaredNumbers = numbers.map((num) => num ** 2);
    console.log("1) Квадрати чисел:", squaredNumbers);

    const evenNumbers = numbers.filter((num) => num % 2 === 0);
    console.log("2) Парні числа:", evenNumbers);

    const sum = numbers.reduce((acc, num) => acc + num, 0);
    console.log("3) Сума всіх елементів:", sum);

    const extraNumbers = [11, 12, 13, 14, 15];
    numbers = numbers.concat(extraNumbers);
    console.log("4) Після додавання 5 нових чисел:", numbers);

    numbers.splice(0, 3);
    console.log("5) Після видалення перших 3 елементів:", numbers);
    console.log("-----------------------------------");
}

function libraryManagement() {
    let books = [
        {
            title: "Кобзар",
            author: "Тарас Шевченко",
            genre: "Поезія",
            pages: 400,
            isAvailable: true,
        },
        {
            title: "Лісова пісня",
            author: "Леся Українка",
            genre: "Драма",
            pages: 220,
            isAvailable: true,
        },
        {
            title: "Тіні забутих предків",
            author: "Михайло Коцюбинський",
            genre: "Повість",
            pages: 180,
            isAvailable: false,
        },
    ];

    function addBook(title, author, genre, pages) {
        books.push({
            title,
            author,
            genre,
            pages,
            isAvailable: true,
        });
    }

    function removeBook(title) {
        books = books.filter((book) => book.title !== title);
    }

    function findBooksByAuthor(author) {
        return books.filter((book) => book.author === author);
    }

    function toggleBookAvailability(title) {
        books = books.map((book) => {
            if (book.title === title) {
                return { ...book, isAvailable: !book.isAvailable };
            }
            return book;
        });
    }

    function sortBooksByPages() {
        books.sort((a, b) => a.pages - b.pages);
    }

    function getBooksStatistics() {
        const totalBooks = books.length;
        const availableBooks = books.filter((book) => book.isAvailable).length;
        const borrowedBooks = books.filter((book) => !book.isAvailable).length;
        const averagePages =
            books.reduce((sum, book) => sum + book.pages, 0) / totalBooks;

        return {
            totalBooks,
            availableBooks,
            borrowedBooks,
            averagePages,
        };
    }

    console.log("Завдання 6");
    console.log("Початковий масив книг:", books);

    addBook("Захар Беркут", "Іван Франко", "Історична повість", 300);
    console.log("1) Після додавання книги:", books);

    removeBook("Лісова пісня");
    console.log("2) Після видалення книги 'Лісова пісня':", books);

    const booksByAuthor = findBooksByAuthor("Тарас Шевченко");
    console.log("3) Книги автора 'Тарас Шевченко':", booksByAuthor);

    toggleBookAvailability("Кобзар");
    console.log("4) Після зміни доступності книги 'Кобзар':", books);

    sortBooksByPages();
    console.log("5) Після сортування за кількістю сторінок:", books);

    const stats = getBooksStatistics();
    console.log("6) Статистика бібліотеки:", stats);
    console.log("-----------------------------------");
}

function task7() {
    let student = {
        name: "Дмитро",
        age: 20,
        course: 3,
    };

    console.log("Завдання 7");
    console.log("Початковий об'єкт:", student);

    student.subjects = ["Математика", "Програмування", "Англійська мова"];
    console.log("1) Після додавання subjects:", student);

    delete student.age;
    console.log("2) Після видалення властивості age:", student);

    console.log("3) Оновлений об'єкт студента:", student);
    console.log("-----------------------------------");
}

task1();
task2();
task3();
task4();
task5();
libraryManagement();
task7();
