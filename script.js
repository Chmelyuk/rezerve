// Получаем элементы
const flipContainer = document.getElementById('flip-container');
const dotsButton = document.querySelector('.dots');
const modal = document.getElementById('modal');
const scanButton = document.getElementById('scan-button');
const video = document.getElementById('video');
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

// Функция для включения камеры и сканирования QR-кода
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" } // Используем заднюю камеру
        });

        // Устанавливаем поток видео в элемент video
        video.srcObject = stream;

        // После загрузки видео запускаем сканирование
        video.onloadedmetadata = () => {
            video.play();
            scanQRCode(); // Запускаем сканирование
        };
    } catch (error) {
        console.error('Ошибка доступа к камере:', error);
    }
}

// Функция для сканирования QR-кода
function scanQRCode() {
    // Устанавливаем размеры canvas, чтобы они соответствовали видео
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Копируем кадр с видео на canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Получаем данные изображения с canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Используем jsQR для сканирования QR-кода
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
const itemsWrap = document.querySelector('.items-wrap');
const items = itemsWrap.children;
const itemsArray = Array.from(items);

itemsArray.forEach(item => {
    const clone = item.cloneNode(true);
    itemsWrap.appendChild(clone);
});

const itemWidth = items[0].getBoundingClientRect().width;
const totalWidth = itemWidth * itemsWrap.children.length;
const animationDuration = totalWidth / 50;

itemsWrap.style.width = `${totalWidth}px`;
itemsWrap.style.animationDuration = `${animationDuration}s`;
