interface Animal {
    name: string;
    age?: number;
    move(): void;
}

class Cat implements Animal {
    constructor(
        public name: string,
        public age?: number,
    ) {}

    move(): void {
        console.log(`${this.name} walks and jumps.`);
    }
}

class Bird implements Animal {
    constructor(
        public name: string,
        public age?: number,
    ) {}

    move(): void {
        console.log(`${this.name} flies.`);
    }
}

class Fish implements Animal {
    constructor(
        public name: string,
        public age?: number,
    ) {}

    move(): void {
        console.log(`${this.name} swims.`);
    }
}

const cat = new Cat("Murka", 3);
const bird = new Bird("Kesha");
const fish = new Fish("Nemo", 1);

cat.move();
bird.move();
fish.move();
