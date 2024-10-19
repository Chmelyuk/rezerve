// Селекторы элементов
const dots = document.querySelectorAll('.dot');
const buttons = document.querySelectorAll('.keypad button:not(.empty)');
const deleteBtn = document.querySelector('.image-btn');

// Переменные для отслеживания состояния
let pin = [];
const maxLength = dots.length;

// Функция для обновления точек
function updateDots() {
    dots.forEach((dot, index) => {
        if (index < pin.length) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Обработка нажатия на цифровые кнопки
buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (pin.length < maxLength) {
            pin.push(button.textContent);
            updateDots();
        }

        // Проверка пин-кода после каждой нажатой кнопки
        if (pin.length === maxLength) {
            checkPin();
        }
    });
});

// Обработка нажатия на кнопку удаления
deleteBtn.addEventListener('click', () => {
    pin.pop(); // Удаляем последний введённый символ
    updateDots();
});

// Функция для проверки пин-кода
function checkPin() {
    const inputPin = pin.join('');
    if (inputPin === "0540") {
        // Переход на следующую страницу
        window.location.href = "main.html"; // Замените на ваш URL
    } else {
        // Очистка введённого пин-кода, если он неправильный
        alert("Неверный код. Попробуйте снова.");
        pin = [];
        updateDots();
    }
}

document.getElementById('flip-container').addEventListener('click', function() {
    this.classList.toggle('flipped');
});

const itemsWrap = document.querySelector('.items-wrap');

// Клонируем элементы
const items = itemsWrap.children;
const itemsArray = Array.from(items);

// Клонирование каждого элемента для создания бесшовной анимации
itemsArray.forEach(item => {
    const clone = item.cloneNode(true);
    itemsWrap.appendChild(clone);
});

// Измеряем ширину элемента
const itemWidth = items[0].getBoundingClientRect().width; // Получаем ширину первого элемента
const totalWidth = itemWidth * itemsWrap.children.length; // Общая ширина элементов
const animationDuration = (totalWidth / 50); // Устанавливаем скорость анимации, чем больше значение, тем медленнее

itemsWrap.style.width = `${totalWidth}px`; // Устанавливаем ширину контейнера
itemsWrap.style.animationDuration = `${animationDuration}s`; // Устанавливаем длительность анимации

// Функция для включения камеры
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.play();

        // Добавляем видео на страницу
        document.body.appendChild(videoElement);
        videoElement.style.position = 'fixed';
        videoElement.style.top = '0';
        videoElement.style.left = '0';
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.zIndex = '1000'; // Чтобы видео было поверх остальных элементов
        videoElement.style.objectFit = 'cover'; // Чтобы изображение занимало весь экран

    } catch (error) {
        console.error('Ошибка доступа к камере:', error);
    }
}

// Обработчик события для кнопки
document.getElementById('scan-button').addEventListener('click', startCamera);
