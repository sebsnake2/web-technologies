function repeatText(text: string, count: number = 1): void {
    for (let i = 0; i < count; i++) {
        console.log(text);
    }
}

repeatText("Hello Typescript", 3);
repeatText("Default value");
