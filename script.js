// Получаем элементы
const flipContainer = document.getElementById('flip-container');
const dotsButton = document.querySelector('.dots');
const modal = document.getElementById('modal');
const scanButton = document.getElementById('scan-button');
const itemsWrap = document.querySelector('.items-wrap');

// Получаем элементы для видео и canvas
const video = document.createElement('video');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Обработчик клика для flip-container (флип при нажатии на сам контейнер)
flipContainer.addEventListener('click', function () {
    this.classList.toggle('flipped');
});

// Обработчик клика для кнопки .dots
dotsButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Останавливаем всплытие, чтобы не происходил флип
    modal.style.display = 'flex'; // Открываем модальное окно
});

// Закрытие модального окна при клике на фон (вне контента)
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Функция для включения камеры и захвата фото
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { exact: "environment" } } // Используем заднюю камеру
        });

        // Устанавливаем видео поток в элемент video
        video.srcObject = stream;
        video.play();

        // Добавляем видео на страницу для предпросмотра
        document.body.appendChild(video);
        video.style.position = 'fixed';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.zIndex = '1000'; // Чтобы видео было поверх остальных элементов
        video.style.objectFit = 'cover'; // Заполняем экран

        // Запускаем сканирование QR-кодов с помощью canvas
        requestAnimationFrame(scanQRCode); // Начинаем цикл сканирования

    } catch (error) {
        console.error('Ошибка доступа к камере:', error);
    }
}

// Функция для сканирования QR-кода
function scanQRCode() {
    // Настроим размеры canvas, чтобы они соответствовали видео
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Перерисовываем видео на canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Получаем данные изображения с canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Используем библиотеку jsQR для поиска QR-кода на изображении
    const code = jsQR(imageData.data, canvas.width, canvas.height, {
        inversionAttempts: "dontInvert",
    });

    if (code) {
        console.log("QR-код найден:", code.data);
        alert("QR-код найден: " + code.data); // Здесь можно сделать что-то полезное с данными QR-кода
    } else {
        // Если QR-код не найден, повторяем сканирование
        requestAnimationFrame(scanQRCode);
    }
}

// Запуск камеры при нажатии на кнопку "Start Camera"
scanButton.addEventListener('click', startCamera);

// --- Логика для анимации ленты ---
const items = itemsWrap.children;
const itemsArray = Array.from(items);

itemsArray.forEach(item => {
    const clone = item.cloneNode(true);
    itemsWrap.appendChild(clone);
});

// Определяем размеры и длительность анимации
const itemWidth = items[0].getBoundingClientRect().width; // Ширина первого элемента
const totalWidth = itemWidth * itemsWrap.children.length; // Общая ширина всех элементов
const animationDuration = totalWidth / 50; // Длительность анимации (чем больше, тем медленнее)

// Устанавливаем параметры анимации
itemsWrap.style.width = `${totalWidth}px`;
itemsWrap.style.animationDuration = `${animationDuration}s`;

// Логика для модальных окон, кнопок и других взаимодействий (не изменена)
dotsButton.addEventListener('click', () => {
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
});

const fullModal = document.getElementById('full-modal');
const fullModalContent = document.querySelector('.full-modal-content');
const closeButton = document.querySelector('.close-button');
const fullInfoLink = document.querySelector('#myElement');

// Открытие полноэкранного модального окна
fullInfoLink.addEventListener('click', (event) => {
    event.preventDefault(); // Предотвращаем переход по ссылке
    fullModal.classList.add('show');
    document.body.classList.add('modal-open'); // Отключаем прокрутку
});

// Закрытие окна при нажатии на кнопку "×"
closeButton.addEventListener('click', () => {
    fullModal.classList.remove('show');
    document.body.classList.remove('modal-open'); // Включаем прокрутку
});

// Закрытие окна при нажатии вне контента
fullModal.addEventListener('click', (event) => {
    if (event.target === fullModal) {
        fullModal.classList.remove('show');
        document.body.classList.remove('modal-open'); // Включаем прокрутку
    }
});

// Код для копирования в буфер обмена
const copyLink = document.querySelector('.copy-link');
const statusMessage = document.querySelector('.status-message');
const code = "8556E824-7E16-4C51-9B96-A10EFC375F50";

// Обработчик нажатия на кнопку копирования
copyLink.addEventListener('click', (event) => {
    event.preventDefault(); // Предотвращаем переход по ссылке

    // Копируем код в буфер обмена
    navigator.clipboard.writeText(code).then(() => {
        // Отображаем символ "✔️"
        statusMessage.textContent = "✔️";
        

        // Убираем сообщение через 3 секунды
        setTimeout(() => {
            statusMessage.textContent = "";
        }, 3000);
    }).catch(err => {
        console.error("Ошибка при копировании: ", err);
    });
});
