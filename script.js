class LetterButton {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.value = generateKindOfRandomLetter();
  }

  display() {
    if (selectedButtons.indexOf(this) < 0) fill("#ffcaff");
    else if (checkSelectedWord()) fill("#a2d2ff");
    else fill("#ffafcc");

    rect(this.x * this.w, this.y * this.w, this.w, this.w);
    fill("#000000");
    text(this.x * this.w + this.w / 2, this.y * this.w + this.w / 1.5, this.w / 2, this.value);
  }

  showLine() {
    if (selectedButtons.indexOf(this) < 0) return;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = this.w / 8;
    ctx.lineTo(this.x * this.w + this.w / 2, this.y * this.w + this.w / 2);
  }

  checkClicked(x, y) {
    let padding = this.w / 25;
    let leftBound = this.x * this.w + padding;
    let rightBound = this.x * this.w + this.w - padding;
    let upperBound = this.y * this.w + padding;
    let lowerBound = this.y * this.w + this.w - padding;
    return x > leftBound && x < rightBound && y > upperBound && y < lowerBound;
  }
}

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const width = 500;
const height = 500;
const gridWidth = 4;
const buttonWidth = width / gridWidth;
const grid = makeGrid(gridWidth);

let selectedButtons = [];
let submittedWords = [];
let dragging = false;

function makeGrid(n) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      row.push(new LetterButton(i, j, buttonWidth));
    }
    arr.push(row);
  }
  return arr;
}

function generateKindOfRandomLetter() {
  const letters = [
    { letter: "e", weight: 13 },
    { letter: "a", weight: 12 },
    { letter: "i", weight: 10 },
    { letter: "o", weight: 9 },
    { letter: "n", weight: 8 },
    { letter: "r", weight: 7 },
    { letter: "t", weight: 7 },
    { letter: "l", weight: 6 },
    { letter: "s", weight: 6 },
    { letter: "u", weight: 5 },
    { letter: "d", weight: 4 },
    { letter: "g", weight: 4 },
    { letter: "c", weight: 3 },
    { letter: "m", weight: 3 },
    { letter: "b", weight: 2 },
    { letter: "p", weight: 2 },
    { letter: "f", weight: 2 },
    { letter: "h", weight: 2 },
    { letter: "v", weight: 1 },
    { letter: "w", weight: 1 },
    { letter: "y", weight: 1 },
    { letter: "k", weight: 1 },
    { letter: "j", weight: 1 },
    { letter: "x", weight: 1 },
    { letter: "q", weight: 1 },
    { letter: "z", weight: 1 },
  ];
  const totalWeight = letters.reduce((sum, { weight }) => sum + weight, 0);
  let randomValue = Math.floor(Math.random() * totalWeight);
  for (const { letter, weight } of letters) {
    if (randomValue < weight) {
      return letter.toUpperCase();
    }
    randomValue -= weight;
  }
  return "E";
}

function getFullyRandomLetter() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function setup() {
  document.body.appendChild(canvas);
  canvas.width = width;
  canvas.height = height;
  setInterval(draw, 25);
  canvas.addEventListener("mousemove", checkClicked);
  canvas.addEventListener("clicked", checkClicked);
  canvas.addEventListener("mousedown", (e) => {
    dragging = true;
  });
  window.addEventListener("mouseup", (e) => {
    dragging = false;
    submitWord();
  });
}

function draw() {
  fill("black");
  rect(0, 0, width, height);
  ctx.beginPath();
  if (selectedButtons.length > 0) {
    ctx.moveTo(
      selectedButtons[0].x * buttonWidth + buttonWidth / 2,
      selectedButtons[0].y * buttonWidth + buttonWidth / 2
    );
    for (const btn of selectedButtons) {
      btn.showLine();
    }
  }
  for (const row of grid) {
    for (const btn of row) {
      btn.display();
    }
  }
  ctx.stroke();
}

function fill(color) {
  ctx.fillStyle = color;
}

function rect(x, y, w, h) {
  ctx.fillRect(x, y, w, h);
}

function text(x, y, size, str) {
  ctx.font = `${size}px arial`;
  ctx.textAlign = "center";
  ctx.fillText(str, x, y);
}

function getNeighbors(button) {
  let x = button.x;
  let y = button.y;

  let directions = [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
  ];

  const neighbors = [];
  for (const dir of directions) {
    let nextX = x + dir.x;
    let nextY = y + dir.y;
    if (nextX >= 0 && nextY >= 0 && nextX < grid.length && nextY < grid.length) {
      neighbors.push(grid[nextX][nextY]);
    }
  }
  return neighbors;
}

function checkClicked(e) {
  if (!dragging) return;
  for (const row of grid) {
    for (const btn of row) {
      if (btn.checkClicked(e.offsetX, e.offsetY)) {
        if (addButtonToSelection(btn)) break;
      }
    }
  }
}

function addButtonToSelection(btn) {
  if (selectedButtons.indexOf(btn) >= 0) return false;
  if (selectedButtons.length > 0) {
    const neighbors = getNeighbors(selectedButtons[selectedButtons.length - 1]);
    for (const neighbor of neighbors) {
      if (neighbor == btn) {
        selectedButtons.push(btn);
        return true;
      }
    }
  } else {
    selectedButtons.push(btn);
    return true;
  }
}

function getSelectedWord() {
  let str = "";
  for (const btn of selectedButtons) {
    str += btn.value;
  }
  return str;
}

function submitWord() {
  if (checkSelectedWord()) {
    submittedWords.push(getSelectedWord());
    console.log(submittedWords);
  }
  selectedButtons = [];
}

function checkSelectedWord() {
  return wordIsValid(getSelectedWord());
}

function wordIsValid(word) {
  return submittedWords.indexOf(word) < 0 && wordlist.indexOf(word.toLowerCase()) >= 0;
}

setup();
