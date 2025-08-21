document.addEventListener('DOMContentLoaded', () => {

    // --- Panel de Control Deslizante ---
    const panelToggleBtn = document.getElementById('panel-toggle-btn');
    const cosmicPanel = document.querySelector('.cosmic-panel');

    panelToggleBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        cosmicPanel.classList.toggle('open');
        panelToggleBtn.classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
        if (!cosmicPanel.contains(event.target) && !panelToggleBtn.contains(event.target)) {
            cosmicPanel.classList.remove('open');
            panelToggleBtn.classList.remove('open');
        }
    });

    // --- Cambiar Estilos de Constelaciones ---
    const themeButtons = document.querySelectorAll('.theme-btn');
    const body = document.body;

    const setTheme = (theme) => {
        body.className = theme;
        localStorage.setItem('theme', theme);
    };

    const savedTheme = localStorage.getItem('theme') || 'orion-theme';
    setTheme(savedTheme);

    themeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const selectedTheme = button.dataset.theme;
            setTheme(selectedTheme);
        });
    });

    // --- Validar Formulario (Terminal de Comunicaciones) ---
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('terrestrial-name');
        const emailInput = document.getElementById('com-frequency');
        const messageInput = document.getElementById('cosmic-message');

        let allValid = true;

        if (!nameInput.value.trim()) {
            nameInput.classList.add('is-invalid');
            allValid = false;
        } else {
            nameInput.classList.remove('is-invalid');
        }

        if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
            emailInput.classList.add('is-invalid');
            allValid = false;
        } else {
            emailInput.classList.remove('is-invalid');
        }

        if (!messageInput.value.trim()) {
            messageInput.classList.add('is-invalid');
            allValid = false;
        } else {
            messageInput.classList.remove('is-invalid');
        }

        if (allValid) {
            alert('¡Señal cósmica enviada con éxito!');
            contactForm.reset();
            contactForm.classList.remove('was-validated');
        }
    });

    // --- Bitácora Estelar ---
    const logEntryForm = document.getElementById('log-entry-form');
    const logEntriesContainer = document.getElementById('log-entries-container');

    const loadLogEntries = () => {
        const entries = JSON.parse(localStorage.getItem('logEntries')) || [];
        entries.forEach(entry => createLogEntry(entry.title, entry.content));
    };

    const createLogEntry = (title, content) => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('col-12', 'col-md-6');
        entryDiv.innerHTML = `
            <div class="log-entry">
                <button class="btn btn-danger btn-sm float-end delete-log-btn" data-title="${title}" data-content="${content}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
                <h5 class="log-entry-title">${title}</h5>
                <p class="log-entry-content">${content}</p>
            </div>
        `;
        logEntriesContainer.prepend(entryDiv);

        const deleteButton = entryDiv.querySelector('.delete-log-btn');
        deleteButton.addEventListener('click', () => {
            entryDiv.remove();
            let entries = JSON.parse(localStorage.getItem('logEntries')) || [];
            entries = entries.filter(entry => !(entry.title === title && entry.content === content));
            localStorage.setItem('logEntries', JSON.stringify(entries));
        });
    };

    logEntryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('log-title').value;
        const content = document.getElementById('log-content').value;

        if (title && content) {
            const entries = JSON.parse(localStorage.getItem('logEntries')) || [];
            entries.unshift({
                title,
                content
            });
            localStorage.setItem('logEntries', JSON.stringify(entries));
            createLogEntry(title, content);
            logEntryForm.reset();
        } else {
            alert('¡No puedes dejar campos vacíos en tu bitácora!');
        }
    });

    // --- MiniPaint (Lienzo Cósmico) ---
    const canvas = document.getElementById('cosmic-canvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('star-color');
    const sizeSlider = document.getElementById('star-size');
    const starBrushBtn = document.getElementById('star-brush-btn');
    const cometBrushBtn = document.getElementById('comet-brush-btn');
    const blackHoleBtn = document.getElementById('black-hole-btn');
    const clearBtn = document.getElementById('clear-btn');
    const saveBtn = document.getElementById('save-constellation-btn');
    const galleryContainer = document.getElementById('gallery-container');

    let currentTool = 'star-brush';
    let isDrawing = false;
    let particleTimeout = null;

    const setCanvasSize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = 400;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const drawStar = (x, y) => {
        const size = sizeSlider.value;
        const color = colorPicker.value;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
    };

    const drawComet = (x, y) => {
        const size = sizeSlider.value;
        const color = colorPicker.value;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
    };

    const blackHoleErase = (x, y) => {
        const size = sizeSlider.value * 2;
        ctx.clearRect(x - size, y - size, size * 2, size * 2);
    };

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        if (currentTool === 'star-brush') drawStar(e.offsetX, e.offsetY);
        if (currentTool === 'comet-brush') drawComet(e.offsetX, e.offsetY);
        if (currentTool === 'black-hole') blackHoleErase(e.offsetX, e.offsetY);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        if (currentTool === 'star-brush') {
            if (particleTimeout) clearTimeout(particleTimeout);
            particleTimeout = setTimeout(() => {
                drawStar(e.offsetX, e.offsetY);
            }, 10);
        }
        if (currentTool === 'comet-brush') drawComet(e.offsetX, e.offsetY);
        if (currentTool === 'black-hole') blackHoleErase(e.offsetX, e.offsetY);
    });

    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    starBrushBtn.addEventListener('click', () => {
        currentTool = 'star-brush';
    });
    cometBrushBtn.addEventListener('click', () => {
        currentTool = 'comet-brush';
    });
    blackHoleBtn.addEventListener('click', () => {
        currentTool = 'black-hole';
    });

    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    saveBtn.addEventListener('click', () => {
        const name = prompt('Dale un nombre a tu constelación:');
        if (name) {
            const imageData = canvas.toDataURL('image/png');
            const gallery = JSON.parse(localStorage.getItem('gallery')) || [];
            gallery.unshift({
                name,
                imageData
            });
            localStorage.setItem('gallery', JSON.stringify(gallery));
            renderGallery();
            alert('¡Constelación guardada!');
        }
    });

    // --- Renderizado del Carrusel ---
    const renderGallery = () => {
        galleryContainer.innerHTML = '';
        const gallery = JSON.parse(localStorage.getItem('gallery')) || [];

        if (gallery.length === 0) {
            galleryContainer.innerHTML = '<p class="text-center p-4 text-muted">No hay constelaciones guardadas aún. ¡Crea la tuya!</p>';
            return;
        }

        gallery.forEach((item, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');
            if (index === 0) {
                carouselItem.classList.add('active');
            }

            carouselItem.innerHTML = `
                <div class="constellation-thumbnail">
                    <button class="btn btn-danger btn-sm delete-gallery-btn" data-name="${item.name}" data-imageData="${item.imageData}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                    <img src="${item.imageData}" alt="${item.name}" class="d-block w-100 h-100" style="object-fit: contain;">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${item.name}</h5>
                    </div>
                </div>
            `;
            galleryContainer.appendChild(carouselItem);

            const deleteButton = carouselItem.querySelector('.delete-gallery-btn');
            deleteButton.addEventListener('click', () => {
                let currentGallery = JSON.parse(localStorage.getItem('gallery')) || [];
                // Filtramos la galería para excluir el elemento que coincide con el nombre y la imagen
                currentGallery = currentGallery.filter(galleryItem => {
                    return galleryItem.name !== item.name || galleryItem.imageData !== item.imageData;
                });
                localStorage.setItem('gallery', JSON.stringify(currentGallery));
                renderGallery(); // Vuelve a renderizar la galería para mostrar el cambio
            });
        });
    };

    // --- Llamada a las funciones al cargar la página ---
    loadLogEntries();
    renderGallery();
});