// Importera nödvändiga moduler
const fs = require("fs");
const readline = require("readline");

// Singleton-klass för studenthantering
class StudentManagementSystem {
  constructor() {
    if (StudentManagementSystem.instance) {
      return StudentManagementSystem.instance;
    }

    this.students = new Map(); // Datastruktur för att lagra studentposter
    StudentManagementSystem.instance = this;
  }

  // Lägg till student
  addStudent(id, name, grade) {
    if (this.students.has(id)) {
      console.log("Student med ID redan existerar.");
    } else {
      this.students.set(id, { name, grade });
      console.log("Student tillagd.");
    }
  }

  // Spara studenter till fil
  saveToFile(fileName) {
    const data = Array.from(this.students).map(([id, { name, grade }]) => `${id},${name},${grade}`).join("\n");
    fs.writeFileSync(fileName, data);
    console.log("Poster sparade till fil.");
  }

  // Läs studenter från fil
  loadFromFile(fileName) {
    if (!fs.existsSync(fileName)) {
      console.log("Fil saknas.");
      return;
    }
    const data = fs.readFileSync(fileName, "utf-8").split("\n");
    data.forEach((line) => {
      const [id, name, grade] = line.split(",");
      if (id && name && grade) {
        this.students.set(id, { name, grade });
      }
    });
    console.log("Poster laddade från fil.");
  }

  // Sök student via ID
  findStudentById(id) {
    if (this.students.has(id)) {
      const { name, grade } = this.students.get(id);
      console.log(`ID: ${id}, Namn: ${name}, Betyg: ${grade}`);
    } else {
      console.log("Student hittades inte.");
    }
  }

  // Visa alla studenter
  displayAllStudents() {
    if (this.students.size === 0) {
      console.log("Inga studenter tillgängliga.");
    } else {
      this.students.forEach((value, key) => {
        console.log(`ID: ${key}, Namn: ${value.name}, Betyg: ${value.grade}`);
      });
    }
  }
}

// Menybaserat konsolgränssnitt
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const system = new StudentManagementSystem();
const menu = () => {
  console.log("\nStudenthanteringssystem:");
  console.log("1. Lägg till studentuppgifter");
  console.log("2. Spara poster till fil");
  console.log("3. Läs poster från fil");
  console.log("4. Sök student via ID");
  console.log("5. Visa alla studenter");
  console.log("6. Avsluta programmet");
  rl.question("Välj ett alternativ: ", handleMenu);
};

const handleMenu = (choice) => {
  switch (choice) {
    case "1":
      rl.question("Ange ID: ", (id) => {
        rl.question("Ange namn: ", (name) => {
          rl.question("Ange betyg: ", (grade) => {
            system.addStudent(id, name, grade);
            menu();
          });
        });
      });
      break;
    case "2":
      rl.question("Ange filnamn: ", (fileName) => {
        system.saveToFile(fileName);
        menu();
      });
      break;
    case "3":
      rl.question("Ange filnamn: ", (fileName) => {
        system.loadFromFile(fileName);
        menu();
      });
      break;
    case "4":
      rl.question("Ange ID: ", (id) => {
        system.findStudentById(id);
        menu();
      });
      break;
    case "5":
      system.displayAllStudents();
      menu();
      break;
    case "6":
      console.log("Avslutar programmet...");
      rl.close();
      break;
    default:
      console.log("Ogiltigt val, försök igen.");
      menu();
  }
};

menu();
