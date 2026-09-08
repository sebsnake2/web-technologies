interface LibraryItem {
    name: string;
    author: string;
    isBorrowed: boolean;

    borrow(): void;
}

class Book implements LibraryItem {
    public isBorrowed: boolean = false;

    constructor(
        public name: string,
        public author: string,
        public pages: number,
    ) {}

    borrow(): void {
        this.isBorrowed = true;
        console.log(`Book "${this.name}" has been borrowed.`);
    }
}

class Magazine implements LibraryItem {
    public isBorrowed: boolean = false;

    constructor(
        public name: string,
        public author: string,
        public issueNumber: number,
    ) {}

    borrow(): void {
        this.isBorrowed = true;
        console.log(`Magazine "${this.name}" has been borrowed.`);
    }
}

class DVD implements LibraryItem {
    public isBorrowed: boolean = false;

    constructor(
        public name: string,
        public author: string,
        public duration: number,
    ) {}

    borrow(): void {
        this.isBorrowed = true;
        console.log(`DVD "${this.name}" has been borrowed.`);
    }
}

class Library {
    private items: LibraryItem[] = [];

    addItem(item: LibraryItem): void {
        this.items.push(item);
    }

    findItemByName(name: string): LibraryItem | undefined {
        return this.items.find((item) => item.name === name);
    }

    showAvailableItems(): void {
        console.log("Available library items:");

        for (const item of this.items) {
            if (!item.isBorrowed) {
                console.log(`${item.name} — ${item.author}`);
            }
        }
    }
}

const library = new Library();

const book = new Book("The Hobbit", "J. R. R. Tolkien", 310);

const magazine = new Magazine(
    "National Geographic",
    "National Geographic Society",
    245,
);

const dvd = new DVD("Interstellar", "Christopher Nolan", 169);

library.addItem(book);
library.addItem(magazine);
library.addItem(dvd);

library.showAvailableItems();

console.log("\nSearching for Interstellar:");
console.log(library.findItemByName("Interstellar"));

console.log("\nBorrowing The Hobbit:");
book.borrow();

console.log("");
library.showAvailableItems();
