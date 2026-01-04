// Система досье для ARMA 3 RP
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация системы
    console.log('[SYSTEM] Инициализация системы досье ARMA 3 RP');
    
    // Элементы интерфейса
    const currentTime = document.getElementById('currentTime');
    const dossierCount = document.getElementById('dossierCount');
    const dossierList = document.getElementById('dossierList');
    const searchInput = document.getElementById('searchInput');
    const viewerPanel = document.getElementById('viewerPanel');
    const dossierDisplay = document.getElementById('dossierDisplay');
    const dossierEditor = document.getElementById('dossierEditor');
    const viewMode = document.getElementById('viewMode');
    const dossierForm = document.getElementById('dossierForm');
    const newDossierBtn = document.getElementById('newDossierBtn');
    const cancelEditBtn = document.getElementById('cancelEdit');
    const saveDossierBtn = document.getElementById('saveDossier');
    const exportBtn = document.getElementById('exportBtn');
    const confirmModal = document.getElementById('confirmModal');
    const modalCancel = document.getElementById('modalCancel');
    const modalConfirm = document.getElementById('modalConfirm');
    const confirmMessage = document.getElementById('confirmMessage');
    const statusMessage = document.getElementById('statusMessage');
    const systemLog = document.getElementById('systemLog');
    const memoryUsage = document.getElementById('memoryUsage');
    const activeAgents = document.getElementById('activeAgents');
    const factionStats = document.getElementById('factionStats');
    const avgSkill = document.getElementById('avgSkill');
    
    // Элементы формы
    const callSign = document.getElementById('callSign');
    const fullName = document.getElementById('fullName');
    const age = document.getElementById('age');
    const faction = document.getElementById('faction');
    const role = document.getElementById('role');
    const specialization = document.getElementById('specialization');
    const skillLevel = document.getElementById('skillLevel');
    const equipment = document.getElementById('equipment');
    const background = document.getElementById('background');
    const serviceRecord = document.getElementById('serviceRecord');
    const personality = document.getElementById('personality');
    const height = document.getElementById('height');
    const weight = document.getElementById('weight');
    const appearance = document.getElementById('appearance');
    const uniform = document.getElementById('uniform');
    const steamId = document.getElementById('steamId');
    const imageUpload = document.getElementById('imageUpload');
    const uploadArea = document.getElementById('uploadArea');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const removeImage = document.getElementById('removeImage');
    
    // Быстрые действия
    const quickViewBtn = document.getElementById('quickView');
    const printDossierBtn = document.getElementById('printDossier');
    const shareDossierBtn = document.getElementById('shareDossier');
    const clearAllBtn = document.getElementById('clearAll');
    const importBtn = document.getElementById('importBtn');
    
    // Данные системы
    let dossiers = JSON.parse(localStorage.getItem('arma3_dossiers')) || [];
    let currentDossierId = null;
    let currentImageData = null;
    let pendingAction = null;
    
    // Инициализация
    initSystem();
    
    // Функции системы
    function initSystem() {
        updateTime();
        setInterval(updateTime, 1000);
        
        updateMemoryUsage();
        setInterval(updateMemoryUsage, 5000);
        
        loadDossiers();
        updateStats();
        
        // Загрузка примера досье если нет данных
        if (dossiers.length === 0) {
            loadExampleDossiers();
        }
        
        // Логирование
        addLog('Система инициализирована');
        addLog(`Загружено досье: ${dossiers.length}`);
    }
    
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        currentTime.textContent = timeString;
    }
    
    function updateMemoryUsage() {
        // Симуляция использования памяти
        const usage = Math.floor(Math.random() * 30) + 10;
        memoryUsage.textContent = `${usage}%`;
    }
    
    function addLog(message) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', { hour12: false });
        
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `
            <span class="log-time">[${timeString}]</span>
            <span class="log-text">${message}</span>
        `;
        
        systemLog.prepend(logEntry);
        
        // Ограничиваем количество записей
        while (systemLog.children.length > 10) {
            systemLog.removeChild(systemLog.lastChild);
        }
    }
    
    function setStatusMessage(message, type = 'info') {
        statusMessage.textContent = message;
        statusMessage.className = 'status-message';
        
        switch(type) {
            case 'success':
                statusMessage.style.color = 'var(--primary-color)';
                break;
            case 'warning':
                statusMessage.style.color = 'var(--warning-color)';
                break;
            case 'error':
                statusMessage.style.color = 'var(--danger-color)';
                break;
            default:
                statusMessage.style.color = 'var(--text-color)';
        }
    }
    
    // Работа с досье
    function loadDossiers() {
        dossierList.innerHTML = '';
        
        if (dossiers.length === 0) {
            dossierList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <p>Досье не найдены</p>
                </div>
            `;
            dossierCount.textContent = '0';
            return;
        }
        
        dossierCount.textContent = dossiers.length;
        
        dossiers.forEach(dossier => {
            const dossierElement = document.createElement('div');
            dossierElement.className = 'dossier-item';
            if (dossier.id === currentDossierId) {
                dossierElement.classList.add('active');
            }
            
            dossierElement.innerHTML = `
                <div class="dossier-callsign">${dossier.callSign || 'НЕТ ПРОЗВИЩА'}</div>
                <div class="dossier-info">
                    <span>${dossier.fullName || 'Неизвестно'}</span>
                    <span class="dossier-faction faction-${dossier.faction ? dossier.faction.toLowerCase() : 'unknown'}">
                        ${getFactionName(dossier.faction)}
                    </span>
                </div>
            `;
            
            dossierElement.addEventListener('click', () => {
                viewDossier(dossier.id);
            });
            
            dossierList.appendChild(dossierElement);
        });
    }
    
    function viewDossier(id) {
        const dossier = dossiers.find(d => d.id === id);
        if (!dossier) return;
        
        currentDossierId = id;
        loadDossiers(); // Обновляем выделение в списке
        
        // Переключаемся в режим просмотра
        dossierEditor.style.display = 'none';
        dossierDisplay.style.display = 'block';
        viewMode.textContent = 'ПРОСМОТР';
        
        // Отображаем досье
        dossierDisplay.innerHTML = createDossierView(dossier);
        
        setStatusMessage(`Досье "${dossier.callSign}" загружено`);
        addLog(`Просмотр досье: ${dossier.callSign}`);
    }
    
    function createDossierView(dossier) {
        const factionName = getFactionName(dossier.faction);
        const roleName = getRoleName(dossier.role);
        const skillName = getSkillName(dossier.skillLevel);
        
        return `
            <div class="dossier-view">
                <div class="dossier-header">
                    <div>
                        <div class="dossier-title">${dossier.callSign}</div>
                        <div class="dossier-meta">${factionName} | ${roleName} | Уровень: ${skillName}</div>
                    </div>
                    <div class="dossier-actions">
                        <button class="btn btn-secondary" onclick="editDossier('${dossier.id}')">
                            <i class="fas fa-edit"></i> РЕДАКТИРОВАТЬ
                        </button>
                    </div>
                </div>
                
                <div class="dossier-content">
                    <div class="dossier-photo">
                        ${dossier.imageData ? 
                            `<img src="${dossier.imageData}" alt="${dossier.callSign}">` :
                            `<div class="empty-photo">
                                <i class="fas fa-user-secret"></i>
                                <p>ФОТО ОТСУТСТВУЕТ</p>
                            </div>`
                        }
                        <div class="photo-info">
                            <div class="detail-item">
                                <div class="detail-label">Позывной</div>
                                <div class="detail-value">${dossier.callSign}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Полное имя</div>
                                <div class="detail-value">${dossier.fullName || 'НЕ УКАЗАНО'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Возраст</div>
                                <div class="detail-value">${dossier.age || 'НЕ УКАЗАН'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">ID</div>
                                <div class="detail-value">${dossier.steamId || 'НЕ УКАЗАН'}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dossier-details">
                        <div class="detail-category">
                            <h3><i class="fas fa-crosshairs"></i> ТАКТИЧЕСКИЕ ДАННЫЕ</h3>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <div class="detail-label">Фракция</div>
                                    <div class="detail-value">${factionName}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Роль</div>
                                    <div class="detail-value">${roleName}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Специализация</div>
                                    <div class="detail-value">${dossier.specialization || 'НЕ УКАЗАНА'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Уровень подготовки</div>
                                    <div class="detail-value">${skillName}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-category">
                            <h3><i class="fas fa-shield-alt"></i> СНАРЯЖЕНИЕ</h3>
                            <p>${dossier.equipment || 'Стандартное снаряжение'}</p>
                            <div class="detail-item">
                                <div class="detail-label">Форма</div>
                                <div class="detail-value">${dossier.uniform || 'Стандартная'}</div>
                            </div>
                        </div>
                        
                        <div class="detail-category">
                            <h3><i class="fas fa-scroll"></i> БИОГРАФИЯ</h3>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <div class="detail-label">Прошлое</div>
                                    <div class="detail-value">${dossier.background || 'НЕ УКАЗАНО'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Боевой опыт</div>
                                    <div class="detail-value">${dossier.serviceRecord || 'НЕ УКАЗАН'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Психологический профиль</div>
                                    <div class="detail-value">${dossier.personality || 'НЕ УКАЗАН'}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-category">
                            <h3><i class="fas fa-user"></i> ФИЗИЧЕСКИЕ ДАННЫЕ</h3>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <div class="detail-label">Рост/Вес</div>
                                    <div class="detail-value">${dossier.height || '??'} см / ${dossier.weight || '??'} кг</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Внешность</div>
                                    <div class="detail-value">${dossier.appearance || 'НЕ ОПИСАНА'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="dossier-footer">
                    <div class="footer-info">
                        Досье создано: ${new Date(dossier.createdAt).toLocaleDateString('ru-RU')} |
                        Последнее обновление: ${new Date(dossier.updatedAt).toLocaleDateString('ru-RU')}
                    </div>
                    <div class="footer-actions">
                        <button class="btn btn-secondary" onclick="exportDossier('${dossier.id}')">
                            <i class="fas fa-file-export"></i> ЭКСПОРТ
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    function newDossier() {
        currentDossierId = null;
        currentImageData = null;
        
        // Очищаем форму
        dossierForm.reset();
        imagePreview.style.display = 'none';
        uploadArea.style.display = 'block';
        
        // Переключаемся в режим редактирования
        dossierDisplay.style.display = 'none';
        dossierEditor.style.display = 'block';
        viewMode.textContent = 'СОЗДАНИЕ ДОСЬЕ';
        
        setStatusMessage('Создание нового досье');
        addLog('Начато создание нового досье');
    }
    
    function editDossier(id) {
        const dossier = dossiers.find(d => d.id === id);
        if (!dossier) return;
        
        currentDossierId = id;
        currentImageData = dossier.imageData || null;
        
        // Заполняем форму
        callSign.value = dossier.callSign || '';
        fullName.value = dossier.fullName || '';
        age.value = dossier.age || '';
        faction.value = dossier.faction || '';
        role.value = dossier.role || '';
        specialization.value = dossier.specialization || '';
        skillLevel.value = dossier.skillLevel || 'VETERAN';
        equipment.value = dossier.equipment || '';
        background.value = dossier.background || '';
        serviceRecord.value = dossier.serviceRecord || '';
        personality.value = dossier.personality || '';
        height.value = dossier.height || '';
        weight.value = dossier.weight || '';
        appearance.value = dossier.appearance || '';
        uniform.value = dossier.uniform || '';
        steamId.value = dossier.steamId || '';
        
        // Загружаем изображение
        if (dossier.imageData) {
            previewImage.src = dossier.imageData;
            imagePreview.style.display = 'block';
            uploadArea.style.display = 'none';
        } else {
            imagePreview.style.display = 'none';
            uploadArea.style.display = 'block';
        }
        
        // Переключаемся в режим редактирования
        dossierDisplay.style.display = 'none';
        dossierEditor.style.display = 'block';
        viewMode.textContent = 'РЕДАКТИРОВАНИЕ ДОСЬЕ';
        
        setStatusMessage(`Редактирование досье "${dossier.callSign}"`);
        addLog(`Редактирование досье: ${dossier.callSign}`);
    }
    
    function saveDossier() {
        if (!callSign.value.trim()) {
            setStatusMessage('ОШИБКА: Укажите позывной', 'error');
            callSign.focus();
            return;
        }
        
        const dossierData = {
            id: currentDossierId || Date.now().toString(),
            callSign: callSign.value.trim(),
            fullName: fullName.value.trim(),
            age: age.value,
            faction: faction.value,
            role: role.value,
            specialization: specialization.value.trim(),
            skillLevel: skillLevel.value,
            equipment: equipment.value.trim(),
            background: background.value.trim(),
            serviceRecord: serviceRecord.value.trim(),
            personality: personality.value.trim(),
            height: height.value,
            weight: weight.value,
            appearance: appearance.value.trim(),
            uniform: uniform.value.trim(),
            steamId: steamId.value.trim(),
            imageData: currentImageData,
            createdAt: currentDossierId ? dossiers.find(d => d.id === currentDossierId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (currentDossierId) {
            // Обновляем существующее досье
            const index = dossiers.findIndex(d => d.id === currentDossierId);
            if (index !== -1) {
                dossiers[index] = dossierData;
            }
        } else {
            // Добавляем новое досье
            dossiers.push(dossierData);
        }
        
        // Сохраняем в localStorage
        localStorage.setItem('arma3_dossiers', JSON.stringify(dossiers));
        
        // Обновляем интерфейс
        loadDossiers();
        updateStats();
        
        // Переключаемся в режим просмотра
        viewDossier(dossierData.id);
        
        setStatusMessage(`Досье "${dossierData.callSign}" сохранено`, 'success');
        addLog(`Сохранено досье: ${dossierData.callSign}`);
    }
    
    function deleteDossier(id) {
        dossiers = dossiers.filter(d => d.id !== id);
        localStorage.setItem('arma3_dossiers', JSON.stringify(dossiers));
        
        loadDossiers();
        updateStats();
        
        dossierEditor.style.display = 'none';
        dossierDisplay.style.display = 'block';
        dossierDisplay.innerHTML = `
            <div class="empty-view">
                <div class="terminal-icon">
                    <i class="fas fa-user-secret"></i>
                </div>
                <h3>ДОСЬЕ УДАЛЕНО</h3>
                <p>Выберите другое досье из списка или создайте новое</p>
            </div>
        `;
        
        setStatusMessage('Досье удалено', 'warning');
        addLog('Досье удалено из системы');
    }
    
    function exportDossier(id) {
        const dossier = dossiers.find(d => d.id === id);
        if (!dossier) return;
        
        const element = document.createElement('div');
        element.innerHTML = createDossierView(dossier);
        element.className = 'export-container';
        element.style.backgroundColor = '#0a0a0a';
        element.style.color = '#00ff41';
        element.style.padding = '20px';
        element.style.fontFamily = "'Roboto Mono', monospace";
        
        document.body.appendChild(element);
        
        html2canvas(element).then(canvas => {
            const link = document.createElement('a');
            link.download = `arma3_dossier_${dossier.callSign.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            document.body.removeChild(element);
        });
        
        setStatusMessage(`Экспорт досье "${dossier.callSign}"`, 'success');
        addLog(`Экспортировано досье: ${dossier.callSign}`);
    }
    
    function updateStats() {
        activeAgents.textContent = dossiers.length;
        
        // Статистика фракций
        const factionCounts = {};
        dossiers.forEach(dossier => {
            if (dossier.faction) {
                factionCounts[dossier.faction] = (factionCounts[dossier.faction] || 0) + 1;
            }
        });
        
        let factionHTML = '';
        for (const [factionKey, count] of Object.entries(factionCounts)) {
            const factionName = getFactionName(factionKey);
            factionHTML += `
                <div class="faction-stat">
                    <span>${factionName}:</span>
                    <span>${count}</span>
                </div>
            `;
        }
        
        factionStats.innerHTML = factionHTML || '<div class="no-data">Нет данных</div>';
        
        // Средний уровень навыков
        const skillValues = {
            'RECRUIT': 1,
            'REGULAR': 2,
            'VETERAN': 3,
            'ELITE': 4
        };
        
        const validDossiers = dossiers.filter(d => d.skillLevel && skillValues[d.skillLevel]);
        if (validDossiers.length > 0) {
            const avg = validDossiers.reduce((sum, d) => sum + skillValues[d.skillLevel], 0) / validDossiers.length;
            avgSkill.textContent = avg.toFixed(1);
        } else {
            avgSkill.textContent = 'N/A';
        }
    }
    
    function loadExampleDossiers() {
        const examples = [
            {
                id: 'example1',
                callSign: 'RAVEN',
                fullName: 'Майкл Тёрнер',
                age: 32,
                faction: 'NATO',
                role: 'SNIPER',
                specialization: 'Дальняя разведка, снайперская поддержка',
                skillLevel: 'ELITE',
                equipment: 'Mk-I EMR, LRPS 7.62 мм, ПНВ, БПЛА разведки',
                background: 'Бывший снайпер SAS, завербован в частную военную компанию после выхода в отставку',
                serviceRecord: '15 подтвержденных ликвидаций, операции в Афганистане и Сирии',
                personality: 'Холодный и расчетливый, предпочитает работать в одиночку',
                height: 185,
                weight: 82,
                appearance: 'Карие глаза, короткая стрижка, шрам над левой бровью',
                uniform: 'Multicam с гилли-костюмом',
                steamId: 'STEAM_0:1:12345678',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'example2',
                callSign: 'BEAR',
                fullName: 'Дмитрий Волков',
                age: 35,
                faction: 'CSAT',
                role: 'COMMANDER',
                specialization: 'Тактическое командование, штурмовые операции',
                skillLevel: 'VETERAN',
                equipment: 'AK-12, тактический планшет, средства связи',
                background: 'Офицер спецназа ГРУ, перешел на службу в КСАТ после увольнения',
                serviceRecord: 'Командовал спецподразделением в Сирии, опыт городских боев',
                personality: 'Агрессивный лидер, требовательный к подчиненным',
                height: 192,
                weight: 95,
                appearance: 'Широкие плечи, короткая стрижка, карие глаза',
                uniform: 'КСАТ камуфляж',
                steamId: 'STEAM_0:0:87654321',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        
        dossiers = [...examples, ...dossiers];
        localStorage.setItem('arma3_dossiers', JSON.stringify(dossiers));
        loadDossiers();
        updateStats();
        
        addLog('Загружены примеры досье');
    }
    
    // Вспомогательные функции
    function getFactionName(factionKey) {
        const factions = {
            'NATO': 'НАТО',
            'CSAT': 'КСАТ',
            'AAF': 'AAF',
            'CIV': 'ГРАЖДАНСКИЙ',
            'REBEL': 'ПОВСТАНЦЫ',
            'MERC': 'НАЕМНИКИ'
        };
        return factions[factionKey] || factionKey || 'НЕИЗВЕСТНО';
    }
    
    function getRoleName(roleKey) {
        const roles = {
            'COMMANDER': 'КОМАНДИР',
            'MEDIC': 'МЕДИК',
            'ENGINEER': 'ИНЖЕНЕР',
            'RIFLEMAN': 'СТРЕЛОК',
            'SNIPER': 'СНАЙПЕР',
            'PILOT': 'ПИЛОТ',
            'DRIVER': 'ВОДИТЕЛЬ'
        };
        return roles[roleKey] || roleKey || 'НЕИЗВЕСТНО';
    }
    
    function getSkillName(skillKey) {
        const skills = {
            'RECRUIT': 'НОВОБРАНЕЦ',
            'REGULAR': 'РЯДОВОЙ',
            'VETERAN': 'ВЕТЕРАН',
            'ELITE': 'ЭЛИТА'
        };
        return skills[skillKey] || skillKey || 'НЕИЗВЕСТНО';
    }
    
    // Обработчики событий
    newDossierBtn.addEventListener('click', newDossier);
    cancelEditBtn.addEventListener('click', () => {
        if (currentDossierId) {
            viewDossier(currentDossierId);
        } else {
            dossierEditor.style.display = 'none';
            dossierDisplay.style.display = 'block';
            viewMode.textContent = 'ПРОСМОТР';
            dossierDisplay.innerHTML = `
                <div class="empty-view">
                    <div class="terminal-icon">
                        <i class="fas fa-user-secret"></i>
                    </div>
                    <h3>ДОСЬЕ НЕ ВЫБРАНО</h3>
                    <p>Выберите досье из списка или создайте новое</p>
                </div>
            `;
        }
    });
    
    dossierForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveDossier();
    });
    
    exportBtn.addEventListener('click', function() {
        if (currentDossierId) {
            exportDossier(currentDossierId);
        } else {
            setStatusMessage('Сначала создайте или выберите досье', 'warning');
        }
    });
    
    // Загрузка изображения
    uploadArea.addEventListener('click', () => {
        imageUpload.click();
    });
    
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            setStatusMessage('Ошибка: выберите изображение', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            currentImageData = event.target.result;
            previewImage.src = currentImageData;
            imagePreview.style.display = 'block';
            uploadArea.style.display = 'none';
            setStatusMessage('Изображение загружено', 'success');
        };
        reader.readAsDataURL(file);
    });
    
    removeImage.addEventListener('click', function() {
        currentImageData = null;
        imagePreview.style.display = 'none';
        uploadArea.style.display = 'block';
        imageUpload.value = '';
    });
    
    // Поиск
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const items = dossierList.querySelectorAll('.dossier-item');
        
        items.forEach(item => {
            const callsign = item.querySelector('.dossier-callsign').textContent.toLowerCase();
            const name = item.querySelector('.dossier-info span:first-child').textContent.toLowerCase();
            
            if (callsign.includes(searchTerm) || name.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Быстрые действия
    quickViewBtn.addEventListener('click', function() {
        if (currentDossierId) {
            // Создаем быстрый просмотр
            const dossier = dossiers.find(d => d.id === currentDossierId);
            if (dossier) {
                const quickView = window.open('', '_blank');
                quickView.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${dossier.callSign} - ARMA 3 RP Dossier</title>
                        <style>
                            body { 
                                font-family: 'Courier New', monospace; 
                                background: #0a0a0a; 
                                color: #00ff41; 
                                padding: 20px;
                            }
                            .dossier { max-width: 800px; margin: 0 auto; }
                            .header { border-bottom: 2px solid #00ff41; padding-bottom: 10px; margin-bottom: 20px; }
                            .title { font-size: 24px; font-weight: bold; }
                            .meta { color: #008f11; margin-top: 5px; }
                            .section { margin-bottom: 20px; }
                            .label { color: #00ff41; font-weight: bold; margin-bottom: 5px; }
                            .value { margin-bottom: 10px; }
                        </style>
                    </head>
                    <body>
                        <div class="dossier">
                            <div class="header">
                                <div class="title">${dossier.callSign}</div>
                                <div class="meta">${getFactionName(dossier.faction)} | ${getRoleName(dossier.role)}</div>
                            </div>
                            <div class="section">
                                <div class="label">Полное имя:</div>
                                <div class="value">${dossier.fullName || 'НЕ УКАЗАНО'}</div>
                            </div>
                            <div class="section">
                                <div class="label">Специализация:</div>
                                <div class="value">${dossier.specialization || 'НЕ УКАЗАНА'}</div>
                            </div>
                            <div class="section">
                                <div class="label">Боевой опыт:</div>
                                <div class="value">${dossier.serviceRecord || 'НЕ УКАЗАН'}</div>
                            </div>
                        </div>
                    </body>
                    </html>
                `);
                quickView.document.close();
            }
        } else {
            setStatusMessage('Сначала выберите досье', 'warning');
        }
    });
    
    printDossierBtn.addEventListener('click', function() {
        if (currentDossierId) {
            window.print();
        } else {
            setStatusMessage('Сначала выберите досье', 'warning');
        }
    });
    
    shareDossierBtn.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: 'ARMA 3 RP Dossier',
                text: 'Просмотр досье персонажа ARMA 3 RP',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href)
                .then(() => setStatusMessage('Ссылка скопирована', 'success'));
        }
    });
    
    clearAllBtn.addEventListener('click', function() {
        showConfirmModal(
            'ВНИМАНИЕ: Все досье будут удалены без возможности восстановления. Продолжить?',
            () => {
                dossiers = [];
                localStorage.removeItem('arma3_dossiers');
                loadDossiers();
                updateStats();
                dossierDisplay.innerHTML = `
                    <div class="empty-view">
                        <div class="terminal-icon">
                            <i class="fas fa-user-secret"></i>
                        </div>
                        <h3>БАЗА ДАННЫХ ОЧИЩЕНА</h3>
                        <p>Создайте новое досье</p>
                    </div>
                `;
                setStatusMessage('Все досье удалены', 'warning');
                addLog('База данных очищена');
            }
        );
    });
    
    importBtn.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const imported = JSON.parse(event.target.result);
                    if (Array.isArray(imported)) {
                        dossiers = [...imported, ...dossiers];
                        localStorage.setItem('arma3_dossiers', JSON.stringify(dossiers));
                        loadDossiers();
                        updateStats();
                        setStatusMessage(`Импортировано ${imported.length} досье`, 'success');
                        addLog(`Импортировано ${imported.length} досье`);
                    }
                } catch (error) {
                    setStatusMessage('Ошибка импорта: неверный формат', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    });
    
    // Модальное окно подтверждения
    function showConfirmModal(message, onConfirm) {
        confirmMessage.textContent = message;
        pendingAction = onConfirm;
        confirmModal.classList.add('active');
    }
    
    modalCancel.addEventListener('click', function() {
        confirmModal.classList.remove('active');
        pendingAction = null;
    });
    
    modalConfirm.addEventListener('click', function() {
        confirmModal.classList.remove('active');
        if (pendingAction) {
            pendingAction();
            pendingAction = null;
        }
    });
    
    // Глобальные функции для использования в HTML
    window.editDossier = editDossier;
    window.exportDossier = exportDossier;
    
    // Завершение инициализации
    addLog('Система готова к работе');
    setStatusMessage('СИСТЕМА АКТИВНА', 'success');
});
