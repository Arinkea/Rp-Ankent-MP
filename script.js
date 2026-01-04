document.addEventListener('DOMContentLoaded', function() {
    // Элементы формы
    const characterName = document.getElementById('characterName');
    const characterAge = document.getElementById('characterAge');
    const characterWorld = document.getElementById('characterWorld');
    const characterRace = document.getElementById('characterRace');
    const characterAppearance = document.getElementById('characterAppearance');
    const characterPersonality = document.getElementById('characterPersonality');
    const characterHistory = document.getElementById('characterHistory');
    const characterAbilities = document.getElementById('characterAbilities');
    const characterImage = document.getElementById('characterImage');
    
    // Кнопки
    const previewBtn = document.getElementById('previewBtn');
    const saveBtn = document.getElementById('saveBtn');
    const resetBtn = document.getElementById('resetBtn');
    const exportBtn = document.getElementById('exportBtn');
    const shareBtn = document.getElementById('shareBtn');
    const printBtn = document.getElementById('printBtn');
    
    // Контейнеры
    const previewContainer = document.getElementById('preview');
    const savedListContainer = document.getElementById('savedList');
    
    // Загружаем сохраненные анкеты из localStorage
    let savedAnkets = JSON.parse(localStorage.getItem('rpAnkets')) || [];
    
    // Отображаем сохраненные анкеты
    function displaySavedAnkets() {
        savedListContainer.innerHTML = '';
        
        if (savedAnkets.length === 0) {
            savedListContainer.innerHTML = '<p class="no-saved">Сохраненных анкет пока нет</p>';
            return;
        }
        
        // Показываем последние 5 сохраненных анкет
        const recentAnkets = savedAnkets.slice(-5).reverse();
        
        recentAnkets.forEach((anket, index) => {
            const anketElement = document.createElement('div');
            anketElement.className = 'saved-item';
            anketElement.innerHTML = `
                <h4>${anket.name || 'Безымянный персонаж'}</h4>
                <p>${anket.race || 'Раса не указана'} | ${anket.world || 'Вселенная не указана'}</p>
                <p><small>Создано: ${new Date(anket.timestamp).toLocaleDateString()}</small></p>
            `;
            
            anketElement.addEventListener('click', () => {
                loadAnketToForm(anket);
            });
            
            savedListContainer.appendChild(anketElement);
        });
    }
    
    // Загружаем анкету в форму для редактирования
    function loadAnketToForm(anket) {
        characterName.value = anket.name || '';
        characterAge.value = anket.age || '';
        characterWorld.value = anket.world || '';
        characterRace.value = anket.race || '';
        characterAppearance.value = anket.appearance || '';
        characterPersonality.value = anket.personality || '';
        characterHistory.value = anket.history || '';
        characterAbilities.value = anket.abilities || '';
        characterImage.value = anket.image || '';
        
        // Обновляем предпросмотр
        updatePreview();
    }
    
    // Обновляем предпросмотр анкеты
    function updatePreview() {
        const name = characterName.value || 'Не указано';
        const age = characterAge.value || 'Не указан';
        const world = getWorldName(characterWorld.value) || 'Не указана';
        const race = characterRace.value || 'Не указана';
        const appearance = characterAppearance.value || 'Не указана';
        const personality = characterPersonality.value || 'Не указан';
        const history = characterHistory.value || 'Не указана';
        const abilities = characterAbilities.value || 'Не указаны';
        const imageUrl = characterImage.value || '';
        
        const worldDisplayNames = {
            'fantasy': 'Фэнтези',
            'scifi': 'Научная фантастика',
            'postapoc': 'Постапокалипсис',
            'modern': 'Современность',
            'cyberpunk': 'Киберпанк',
            'other': 'Другая вселенная'
        };
        
        const worldName = worldDisplayNames[characterWorld.value] || world;
        
        previewContainer.innerHTML = `
            <div class="anket-display">
                <div class="anket-header">
                    <h2 class="anket-title">${name}</h2>
                    <p class="anket-subtitle">${race} | ${worldName} | Возраст: ${age}</p>
                </div>
                
                ${imageUrl ? `
                <div class="anket-image">
                    <img src="${imageUrl}" alt="${name}" onerror="this.src='https://via.placeholder.com/250x350/1a1a2e/7986cb?text=Изображение+не+загружено'">
                </div>
                ` : ''}
                
                <div class="anket-details">
                    <div class="detail-section">
                        <h3><i class="fas fa-eye"></i> Внешность</h3>
                        <p>${appearance}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-brain"></i> Характер</h3>
                        <p>${personality}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-scroll"></i> История</h3>
                        <p>${history}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-fire"></i> Способности</h3>
                        <p>${abilities}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Получаем название вселенной
    function getWorldName(worldKey) {
        const worlds = {
            'fantasy': 'Фэнтези',
            'scifi': 'Научная фантастика',
            'postapoc': 'Постапокалипсис',
            'modern': 'Современность',
            'cyberpunk': 'Киберпанк',
            'other': 'Другая вселенная'
        };
        
        return worlds[worldKey] || worldKey;
    }
    
    // Сохраняем анкету
    function saveAnket() {
        if (!characterName.value.trim()) {
            alert('Пожалуйста, введите имя персонажа');
            characterName.focus();
            return;
        }
        
        const anket = {
            id: Date.now(),
            name: characterName.value,
            age: characterAge.value,
            world: characterWorld.value,
            race: characterRace.value,
            appearance: characterAppearance.value,
            personality: characterPersonality.value,
            history: characterHistory.value,
            abilities: characterAbilities.value,
            image: characterImage.value,
            timestamp: new Date().toISOString()
        };
        
        savedAnkets.push(anket);
        localStorage.setItem('rpAnkets', JSON.stringify(savedAnkets));
        
        displaySavedAnkets();
        
        alert(`Анкета "${characterName.value}" успешно сохранена!`);
    }
    
    // Сбрасываем форму
    function resetForm() {
        if (confirm('Вы уверены, что хотите очистить все поля?')) {
            characterName.value = '';
            characterAge.value = '';
            characterWorld.value = '';
            characterRace.value = '';
            characterAppearance.value = '';
            characterPersonality.value = '';
            characterHistory.value = '';
            characterAbilities.value = '';
            characterImage.value = '';
            
            previewContainer.innerHTML = `
                <div class="preview-placeholder">
                    <i class="fas fa-user-circle"></i>
                    <p>Здесь будет отображаться ваша анкета</p>
                </div>
            `;
        }
    }
    
    // Экспортируем анкету как изображение
    function exportAsImage() {
        const anketElement = previewContainer.querySelector('.anket-display');
        
        if (!anketElement) {
            alert('Сначала создайте анкету и нажмите "Предпросмотр"');
            return;
        }
        
        html2canvas(anketElement).then(canvas => {
            const link = document.createElement('a');
            link.download = `rp_anket_${characterName.value || 'персонаж'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }
    
    // Поделиться сайтом
    function shareSite() {
        if (navigator.share) {
            navigator.share({
                title: 'RP Quest - Создание анкет для ролевых игр',
                text: 'Создавайте профессиональные анкеты для персонажей ролевых игр!',
                url: window.location.href
            });
        } else {
            // Копируем ссылку в буфер обмена
            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Ссылка скопирована в буфер обмена! Поделитесь ей с друзьями.'));
        }
    }
    
    // Назначаем обработчики событий
    previewBtn.addEventListener('click', updatePreview);
    saveBtn.addEventListener('click', saveAnket);
    resetBtn.addEventListener('click', resetForm);
    exportBtn.addEventListener('click', exportAsImage);
    shareBtn.addEventListener('click', shareSite);
    printBtn.addEventListener('click', () => window.print());
    
    // Загружаем сохраненные анкеты при загрузке страницы
    displaySavedAnkets();
    
    // Обновляем предпросмотр при изменении полей
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            // Авто-предпросмотр с задержкой (чтобы не нагружать при каждом нажатии клавиши)
            clearTimeout(window.previewTimeout);
            window.previewTimeout = setTimeout(updatePreview, 500);
        });
    });
    
    // Инициализация предпросмотра с примером
    setTimeout(() => {
        if (savedAnkets.length === 0) {
            // Заполняем форму примером для демонстрации
            characterName.value = 'Элриан Вестфолл';
            characterAge.value = '27';
            characterWorld.value = 'fantasy';
            characterRace.value = 'Полуэльф';
            characterAppearance.value = 'Высокий, стройный мужчина с серебристыми волосами до плеч и ярко-зелеными глазами. На левой щеке шрам от когтей дракона. Носит практичную кожаную броню и темно-зеленый плащ.';
            characterPersonality.value = 'Сдержанный, наблюдательный, обладает острым чувством справедливости. Не доверяет незнакомцам, но верен друзьям. Имеет саркастичное чувство юмора.';
            characterHistory.value = 'Родился в смешанном браке эльфа и человека. В юности обучался магии у эльфийских мастеров, но покинул родные края после нападения дракона на свою деревню. С тех пор странствует в поисках способа отомстить за гибель семьи.';
            characterAbilities.value = 'Базовое владение магией стихий, особенно воздуха и земли. Искусный фехтовальщик. Умеет читать следы и выживать в дикой природе. Знает древние языки.';
            characterImage.value = 'https://i.pinimg.com/736x/3c/3a/6f/3c3a6f2c4e5c8b5c5c5c5c5c5c5c5c5c.jpg';
            
            updatePreview();
        }
    }, 1000);
});
