
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


let scrollPosition = 0;

function disableScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    // Предотвращаем прокрутку на сенсорных устройствах
    window.addEventListener('touchmove', preventDefault, { passive: false });
}
