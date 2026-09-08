abstract class Car {
    constructor(
        public brand: string,
        public model: string,
        protected year: number,
        private vin: string,
    ) {}

    protected getVin(): string {
        return this.vin;
    }

    abstract getDescription(): void;
}

class Audi extends Car {
    constructor(
        model: string,
        year: number,
        vin: string,
        public bodyType: string,
        protected horsepower: number,
        private fuelType: string,
    ) {
        super("Audi", model, year, vin);
    }

    getDescription(): void {
        console.log(`
Brand: ${this.brand}
Model: ${this.model}
Year: ${this.year}
VIN: ${this.getVin()}
Body type: ${this.bodyType}
Horsepower: ${this.horsepower}
Fuel type: ${this.fuelType}
`);
    }
}

class BMW extends Car {
    constructor(
        model: string,
        year: number,
        vin: string,
        public bodyType: string,
        protected horsepower: number,
        private fuelType: string,
    ) {
        super("BMW", model, year, vin);
    }

    getDescription(): void {
        console.log(`
Brand: ${this.brand}
Model: ${this.model}
Year: ${this.year}
VIN: ${this.getVin()}
Body type: ${this.bodyType}
Horsepower: ${this.horsepower}
Fuel type: ${this.fuelType}
`);
    }
}

class Mercedes extends Car {
    constructor(
        model: string,
        year: number,
        vin: string,
        public bodyType: string,
        protected horsepower: number,
        private fuelType: string,
    ) {
        super("Mercedes", model, year, vin);
    }

    getDescription(): void {
        console.log(`
Brand: ${this.brand}
Model: ${this.model}
Year: ${this.year}
VIN: ${this.getVin()}
Body type: ${this.bodyType}
Horsepower: ${this.horsepower}
Fuel type: ${this.fuelType}
`);
    }
}

const cars: Car[] = [
    new Audi("S6", 2020, "AUDI001", "Sedan", 444, "Petrol"),
    new Audi("Q7", 2022, "AUDI002", "SUV", 286, "Diesel"),

    new BMW("M3", 2021, "BMW001", "Sedan", 510, "Petrol"),
    new BMW("X5", 2023, "BMW002", "SUV", 340, "Diesel"),

    new Mercedes("C-Class", 2020, "MB001", "Sedan", 204, "Petrol"),
    new Mercedes("GLE", 2022, "MB002", "SUV", 330, "Diesel"),
];

for (const car of cars) {
    car.getDescription();
}
