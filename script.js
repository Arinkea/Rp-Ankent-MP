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
