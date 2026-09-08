interface Payable {
    pay(): void;
}

abstract class Employee {
    constructor(
        public name: string,
        public age: number,
        protected salary: number,
    ) {}

    abstract getAnnualBonus(): number;
}

class Developer extends Employee implements Payable {
    getAnnualBonus(): number {
        return this.salary * 0.1;
    }

    pay(): void {
        console.log(
            `${this.name} received salary: ${this.salary} and annual bonus: ${this.getAnnualBonus()}`,
        );
    }
}

class Manager extends Employee implements Payable {
    getAnnualBonus(): number {
        return this.salary * 0.2;
    }

    pay(): void {
        console.log(
            `${this.name} received salary: ${this.salary} and annual bonus: ${this.getAnnualBonus()}`,
        );
    }
}

const employees: Employee[] = [
    new Developer("Alex", 25, 3000),
    new Developer("John", 28, 3500),
    new Manager("Anna", 35, 5000),
    new Manager("Michael", 40, 6000),
];

let totalAnnualBonus = 0;

for (const employee of employees) {
    totalAnnualBonus += employee.getAnnualBonus();
}

console.log("Total annual bonuses:", totalAnnualBonus);
