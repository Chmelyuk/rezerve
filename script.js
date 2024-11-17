// Получаем элементы
const flipContainer = document.getElementById('flip-container');
const dotsButton = document.querySelector('.dots');
const modal = document.getElementById('modal');
const scanButton = document.getElementById('scan-button');
const itemsWrap = document.querySelector('.items-wrap');

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

scanButton.addEventListener('click', startCamera);

// Функция для включения камеры и сканирования QR-кода
async function startCamera() {
    try {
        // Запрашиваем доступ к камере
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { exact: "environment" } } // Используем заднюю камеру
        });

        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.play();

        // Добавляем видео на страницу для предпросмотра
        document.body.appendChild(videoElement);
        videoElement.style.position = 'fixed';
        videoElement.style.top = '0';
        videoElement.style.left = '0';
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.zIndex = '1000'; // Чтобы видео было поверх остальных элементов
        videoElement.style.objectFit = 'cover'; // Заполняем экран

        // Функция для сканирования QR-кодов
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Элемент для отображения информации QR-кода
        const qrCodeInfo = document.createElement('div');
        qrCodeInfo.style.position = 'fixed';
        qrCodeInfo.style.top = '50%';
        qrCodeInfo.style.left = '50%';
        qrCodeInfo.style.transform = 'translate(-50%, -50%)';
        qrCodeInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        qrCodeInfo.style.color = 'white';
        qrCodeInfo.style.padding = '20px';
        qrCodeInfo.style.fontSize = '20px';
        qrCodeInfo.style.zIndex = '2000'; // Чтобы текст был поверх всех элементов
        qrCodeInfo.style.borderRadius = '8px';
        qrCodeInfo.style.textAlign = 'center';

        // Устанавливаем ширину окна с текстом равной ширине экрана устройства
        qrCodeInfo.style.width = '90vw';  // 90% от ширины экрана
        qrCodeInfo.style.maxWidth = '100%'; // Убедимся, что ширина не превышает 100% экрана
        qrCodeInfo.style.wordWrap = 'break-word';  // Перенос слов в случае длинных строк

        function scanQRCode() {
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height, {
                inversionAttempts: "dontInvert"
            });

            if (code) {
                console.log("QR-код найден:", code.data);
                
                // Показываем информацию с QR-кода на экране
                qrCodeInfo.textContent = "QR-код найден: " + code.data;
                document.body.appendChild(qrCodeInfo); // Добавляем информацию на экран

                // Останавливаем поток камеры и удаляем видео
                stopCamera(stream, videoElement);
            }
        }

        // Интервал для регулярного сканирования
        const scanInterval = setInterval(scanQRCode, 100);

        // Функция для остановки камеры и удаления видео
        function stopCamera(stream, videoElement) {
            clearInterval(scanInterval); // Останавливаем регулярное сканирование
            videoElement.pause(); // Останавливаем воспроизведение видео
            videoElement.srcObject = null; // Очищаем источник видео
            stream.getTracks().forEach(track => track.stop()); // Останавливаем все потоки видео
            videoElement.remove(); // Удаляем видео с экрана
        }

    } catch (error) {
        console.error('Ошибка доступа к камере:', error);
    }
}

// --- Логика для бесконечной анимации ленты ---
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

// Открытие полноэкранного модального окна
const fullModal = document.getElementById('full-modal');
const fullModalContent = document.querySelector('.full-modal-content');
const closeButton = document.querySelector('.close-button');
const fullInfoLink = document.querySelector('#myElement');

fullInfoLink.addEventListener('click', (event) => {
    event.preventDefault();
    fullModal.classList.add('show');
    document.body.classList.add('modal-open');
});

closeButton.addEventListener('click', () => {
    fullModal.classList.remove('show');
    document.body.classList.remove('modal-open');
});

fullModal.addEventListener('click', (event) => {
    if (event.target === fullModal) {
        fullModal.classList.remove('show');
        document.body.classList.remove('modal-open');
    }
});

// Открытие и закрытие модального окна бургера
const burgerMenu = document.getElementById('burger-menu');
const burgerModal = document.getElementById('burger-modal');
const closeBurgerButton = document.querySelector('.close-burger-button');

burgerMenu.addEventListener('click', () => {
    burgerModal.style.display = 'block';
});

closeBurgerButton.addEventListener('click', () => {
    burgerModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === burgerModal) {
        burgerModal.style.display = 'none';
    }
});

// Код для копирования в буфер обмена
const copyLink = document.querySelector('.copy-link');
const statusMessage = document.querySelector('.status-message');
const code = "8556E824-7E16-4C51-9B96-A10EFC375F50";

copyLink.addEventListener('click', (event) => {
    event.preventDefault();

    navigator.clipboard.writeText(code).then(() => {
        statusMessage.textContent = "✔️";
        setTimeout(() => {
            statusMessage.textContent = "";
        }, 3000);
    }).catch(err => {
        console.error("Ошибка при копировании: ", err);
    });
});
