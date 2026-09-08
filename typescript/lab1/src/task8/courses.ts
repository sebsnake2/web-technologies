interface Course {
    name: string;
    duration: number;
    students: string[];
}

class OnlineCourse implements Course {
    constructor(
        public name: string,
        public duration: number,
        public students: string[] = [],
    ) {}

    registerStudent(student: string): void {
        if (!this.isStudentRegistered(student)) {
            this.students.push(student);
        }
    }

    isStudentRegistered(student: string): boolean {
        return this.students.includes(student);
    }
}

class CourseManager {
    private courses: Course[] = [];

    addCourse(course: Course): void {
        this.courses.push(course);
    }

    removeCourse(courseName: string): void {
        const courseIndex = this.courses.findIndex(
            (course) => course.name === courseName,
        );

        if (courseIndex !== -1) {
            this.courses.splice(courseIndex, 1);
        }
    }

    findCourse(courseName: string): Course | undefined {
        return this.courses.find((course) => course.name === courseName);
    }

    showCourses(): void {
        for (const course of this.courses) {
            console.log(`Course: ${course.name}`);
            console.log(`Duration: ${course.duration} hours`);
            console.log(`Students: ${course.students.join(", ")}`);
            console.log("--------------------");
        }
    }
}

const typescriptCourse = new OnlineCourse("TypeScript", 40);
const javascriptCourse = new OnlineCourse("JavaScript", 35);
const htmlCourse = new OnlineCourse("HTML & CSS", 25);

const courseManager = new CourseManager();

courseManager.addCourse(typescriptCourse);
courseManager.addCourse(javascriptCourse);
courseManager.addCourse(htmlCourse);

typescriptCourse.registerStudent("Sebastian");
typescriptCourse.registerStudent("Anna");

javascriptCourse.registerStudent("John");
javascriptCourse.registerStudent("Michael");

htmlCourse.registerStudent("Kate");

console.log(
    "Is Sebastian registered for TypeScript:",
    typescriptCourse.isStudentRegistered("Sebastian"),
);

console.log("Found course:", courseManager.findCourse("JavaScript"));

console.log("\nCourse list:");
courseManager.showCourses();
