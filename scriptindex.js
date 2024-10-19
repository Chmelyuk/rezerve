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

let scrollPosition = 0;

function disableScroll() {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
}

function enableScroll() {
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo(0, scrollPosition);
}
