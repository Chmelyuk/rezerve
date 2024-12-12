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

// Получаем элементы
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

// Открытие и закрытие модального окна бургера
 
const burgerModal = document.getElementById('burger-modal');
const closeBurgerButton = document.querySelector('.close-burger-button');

 

closeBurgerButton.addEventListener('click', () => {
    burgerModal.style.display = 'none';
});

// Закрытие окна при клике вне его
window.addEventListener('click', (event) => {
    if (event.target === burgerModal) {
        burgerModal.style.display = 'none';
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

           // Функция обновления данных с текущей датой и временем
function updateContent() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('uk-UA');
    const formattedTime = now.toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const newContent = `На обліку • Документ оновлено о ${formattedTime} | ${formattedDate}`;

    // Обновляем все элементы с классом item и item-full
    const itemsToUpdate = document.querySelectorAll('.item p, .item-full p');

    itemsToUpdate.forEach((paragraph, index) => {
        paragraph.textContent = newContent;

        // Присваиваем уникальный ID
        if (paragraph.closest('.item-full')) {
            paragraph.id = `item-full-${index + 1}`;
        } else {
            paragraph.id = `item-${index + 1}`;
        }
    });
}

// Запуск обновления при загрузке страницы
document.addEventListener('DOMContentLoaded', updateContent);

// Обработчик для обновления вручную
document.getElementById('update-doc').addEventListener('click', (event) => {
    event.preventDefault(); // Предотвращаем переход по ссылке
    updateContent(); // Обновляем данные вручную при клике
});


