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
        qrCodeInfo.style.fontSize = '12px';
        qrCodeInfo.style.zIndex = '2000'; // Чтобы текст был поверх всех элементов
        qrCodeInfo.style.borderRadius = '8px';
        qrCodeInfo.style.textAlign = 'center';

        // Устанавливаем ширину окна с текстом равной ширине экрана устройства
        qrCodeInfo.style.width = '90vw';  // 90% от ширины экрана
        qrCodeInfo.style.maxWidth = '100%'; // Убедимся, что ширина не превышает 100% экрана
        qrCodeInfo.style.wordWrap = 'break-word';  // Перенос слов в случае длинных строк

        // Добавляем кнопку для закрытия окна с QR-кодом
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Закрыть';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.backgroundColor = '#f00';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';

        // Обработчик для закрытия окна с QR-кодом
        closeButton.addEventListener('click', () => {
            qrCodeInfo.style.display = 'none';  // Скрыть окно с QR-кодом
            stopCamera(stream, videoElement);  // Останавливаем камеру и удаляем видео
        });

        qrCodeInfo.appendChild(closeButton); // Добавляем кнопку закрытия в окно с информацией

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
                qrCodeInfo.textContent = "QR-код знайдений: " + code.data;
                qrCodeInfo.appendChild(closeButton); // Добавляем кнопку закрытия
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
// Существующий код для анимации и других действий...
