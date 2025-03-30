
let container = document.querySelector('.container');
let container2 = document.querySelector('.container2');
let saveBtn = document.getElementById('saveBtn');
let loadBtn = document.getElementById('loadBtn');
let exportBtn = document.getElementById('exportBtn');
let current_color = 'gray';

// Установка цветов палитры
let colors = ['red', 'blue', 'green', 'white', 'pink', 'purple', 'orange', 'black', 'aqua', 'gray'];

// Создание сетки
for (let i = 0; i < 390; i++) {
    let div = document.createElement('div');
    div.classList.add('box');
    div.style.background = 'gray';
    container.appendChild(div);
}
for (let i = 0; i < colors.length; i++) {
    let div = document.createElement('div');
    div.classList.add('box2');
    div.style.background = colors[i];
    container2.appendChild(div);
}

// Получаем списки клеток
let buttons = Array.from(document.querySelectorAll('.box'));
let buttons2 = Array.from(document.querySelectorAll('.box2'));

let gridWidth = 30;
let gridHeight = Math.ceil(buttons.length / gridWidth);

// Выбор цвета
buttons2.forEach((button) => {
    button.addEventListener('click', function () {
        current_color = button.style.background;
    });
});

// Обычное рисование (по клику)
buttons.forEach((button) => {
    button.addEventListener('click', function (event) {
        if (event.ctrlKey) {
            let index = buttons.indexOf(button);
            floodFill(index);
        } else {
            button.style.background = current_color;
        }
    });
});

// Рисование по удержанию мышки
function paint(event) {
    if (event.target.classList.contains('box')) {
        event.target.style.background = current_color;
    }
}

container.addEventListener('mousedown', () => container.addEventListener('mousemove', paint));
container.addEventListener('mouseup', () => container.removeEventListener('mousemove', paint));

// **ФУНКЦИЯ ЗАЛИВКИ**
function floodFill(startIndex) {
    let targetColor = buttons[startIndex].style.background;
    if (targetColor === current_color) return;

    let stack = [startIndex];
    let visited = new Set();

    while (stack.length > 0) {
        let index = stack.pop();
        let cell = buttons[index];

        if (!cell || visited.has(index)) continue;
        visited.add(index);

        let cellColor = cell.style.background;
        if (cellColor === targetColor) {
            cell.style.background = current_color;

            let x = index % gridWidth;
            let y = Math.floor(index / gridWidth);

            if (x > 0) stack.push(index - 1);
            if (x < gridWidth - 1) stack.push(index + 1);
            if (y > 0) stack.push(index - gridWidth);
            if (y < gridHeight - 1) stack.push(index + gridWidth);
        }
    }
}

// **СОХРАНЕНИЕ В localStorage**
function saveToStorage() {
    let colorData = buttons.map(btn => btn.style.background);
    localStorage.setItem('drawing', JSON.stringify(colorData));
    alert("Рисунок сохранён!");
}

// **ЗАГРУЗКА ИЗ localStorage**
function loadFromStorage() {
    let savedData = localStorage.getItem('drawing');
    if (savedData) {
        let colorData = JSON.parse(savedData);
        buttons.forEach((btn, i) => {
            btn.style.background = colorData[i] || 'gray';
        });
        alert("Рисунок загружен!");
    } else {
        alert("Нет сохранённого рисунка!");
    }
}

// **ЭКСПОРТ В ИЗОБРАЖЕНИЕ**
exportBtn.addEventListener('click', function () {
    setTimeout(() => {
        domtoimage.toPng(container)
            .then(function (dataUrl) {
                let link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'pixel-art.png';
                link.click();
            })
            .catch(function (error) {
                console.error('Ошибка экспорта:', error);
            });
    }, 100);
});

// **Кнопки управления**
saveBtn.addEventListener('click', saveToStorage);
loadBtn.addEventListener('click', loadFromStorage);