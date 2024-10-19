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

// Функция для включения камеры и захвата фото
async function startCamera() {
    try {
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

        // Захват изображения после короткой задержки
        setTimeout(async () => {
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            // Остановить поток видео
            stream.getTracks().forEach(track => track.stop());
            videoElement.remove();

            // Получаем данные изображения
            const imageData = canvas.toDataURL('image/png');

            // Здесь можно добавить код для обработки изображения и сканирования QR-кода
            console.log('Фото захвачено:', imageData);

        }, 3000); // Задержка 3 секунды перед захватом фото

    } catch (error) {
        console.error('Ошибка доступа к камере:', error);
    }
}
// --- Логика для бесконечной анимации ленты ---

// Клонируем элементы для бесшовной анимации
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

let scrollPosition = 0;
function disableScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    // Предотвращаем прокрутку на сенсорных устройствах
    window.addEventListener('touchmove', preventDefault, { passive: false });
}
