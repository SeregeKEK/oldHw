const readline = require("readline");
const fs = require("fs");

class FamilyTree {
  constructor() {
    this.tree = {};
  }

  addMember(name, surname, parentName = null, parentSurname = null) {
    if (!parentName) {
      this.tree[`${name} ${surname}`] = { children: [] };
    } else {
      if (!this.tree[`${parentName} ${parentSurname}`]) {
        console.log(`Родитель ${parentName} ${parentSurname} не найден.`);
        return;
      }
      this.tree[`${name} ${surname}`] = { children: [] };
      this.tree[`${parentName} ${parentSurname}`].children.push(
        `${name} ${surname}`
      );
    }
  }

  viewTree() {
    return this.tree;
  }

  restoreFromFile(fileName) {
    this.tree = JSON.parse(fs.readFileSync(fileName, "utf-8"));
    console.log(`Генеалогическое древо восстановлено из файла ${fileName}.`);
  }
}

const familyTree = new FamilyTree();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function appendToFile(fileName, data) {
  let existingData = {};
  if (fs.existsSync(fileName)) {
    existingData = JSON.parse(fs.readFileSync(fileName, "utf-8"));
  }
  const newData = { ...existingData, ...data };
  fs.writeFileSync(fileName, JSON.stringify(newData, null, 2), "utf-8");
  console.log(`Данные добавлены в файл ${fileName}.`);
}

rl.setPrompt(
  "Введите имя и фамилию участника (или имя и фамилию участника и имя и фамилию его родителя): "
);
rl.prompt();

rl.on("line", (input) => {
  const args = input.split(" ");
  if (args.length === 2) {
    familyTree.addMember(args[0], args[1]);
  } else if (args.length === 4) {
    familyTree.addMember(args[0], args[1], args[2], args[3]);
  } else {
    console.log("Неверный формат ввода. Попробуйте снова.");
  }
  rl.prompt();
}).on("close", () => {
  appendToFile("data.json", familyTree.viewTree());
  console.log("Работа с генеалогическим древом завершена.");
  process.exit(0);
});

familyTree.restoreFromFile("data.json");

console.log(familyTree.viewTree());


