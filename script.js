let tasks = [];

function loadTasks() {
    let saved = localStorage.getItem('planner_tasks');
    if (saved) {
        tasks = JSON.parse(saved);
    } else {
        tasks = [];
        for (let i = 0; i < 24; i++) {
            let hour = i.toString().padStart(2, '0') + ':00';
            tasks.push({
                id: i,
                time: hour,
                text: '',
                done: false
            });
        }
    }
    renderTasks();
}

function renderTasks() {
    let container = document.getElementById('tasksList');
    if (!container) return;
    container.innerHTML = '';
    
    for (let i = 0; i < tasks.length; i++) {
        let t = tasks[i];
        let row = document.createElement('div');
        row.className = 'schedule-row';
        
        let timeDiv = document.createElement('div');
        timeDiv.textContent = t.time;
        
        let inputDiv = document.createElement('div');
        let input = document.createElement('input');
        input.type = 'text';
        input.value = t.text;
        input.placeholder = 'Напишите задачу...';
        input.setAttribute('data-id', t.id);
        input.className = 'task-input';
        input.oninput = function() {
            let id = parseInt(this.getAttribute('data-id'));
            for (let j = 0; j < tasks.length; j++) {
                if (tasks[j].id === id) {
                    tasks[j].text = this.value;
                    saveTasks();
                    updateStats();
                    break;
                }
            }
        };
        inputDiv.appendChild(input);
        
        let checkDiv = document.createElement('div');
        checkDiv.className = 'task-check';
        let chbox = document.createElement('input');
        chbox.type = 'checkbox';
        chbox.checked = t.done;
        chbox.setAttribute('data-id', t.id);
        chbox.onchange = function() {
            let id = parseInt(this.getAttribute('data-id'));
            for (let j = 0; j < tasks.length; j++) {
                if (tasks[j].id === id) {
                    tasks[j].done = this.checked;
                    saveTasks();
                    updateStats();
                    break;
                }
            }
        };
        checkDiv.appendChild(chbox);
        
        row.appendChild(timeDiv);
        row.appendChild(inputDiv);
        row.appendChild(checkDiv);
        container.appendChild(row);
    }
    updateStats();
}

function updateStats() {
    let total = 0;
    let done = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].text !== '' && tasks[i].text !== null && tasks[i].text.trim() !== '') {
            total++;
        }
        if (tasks[i].done === true) {
            done++;
        }
    }
    let totalSpan = document.getElementById('totalTasks');
    let doneSpan = document.getElementById('doneTasks');
    if (totalSpan) totalSpan.innerText = total;
    if (doneSpan) doneSpan.innerText = done;
}

function saveTasks() {
    localStorage.setItem('planner_tasks', JSON.stringify(tasks));
}

function clearDoneTasks() {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].done === true) {
            tasks[i].text = '';
            tasks[i].done = false;
        }
    }
    renderTasks();
}

function resetAllTasks() {
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].text = '';
        tasks[i].done = false;
    }
    renderTasks();
}

let galleryItems = [
    { id: 1, title: 'Утро', category: 'morning', likes: 0, img: 'images/утро.jpg' },
    { id: 2, title: 'Дела', category: 'work', likes: 0, img: 'images/дела.jpg' },
    { id: 3, title: 'Работа', category: 'work', likes: 0, img: 'images/работа.jpg' },
    { id: 4, title: 'Отдых', category: 'evening', likes: 0, img: 'images/отдых.jpg' },
    { id: 5, title: 'Конец рабочего дня', category: 'evening', likes: 0, img: 'images/конец рабочего дня.jpg' },
    { id: 6, title: 'Сон', category: 'evening', likes: 0, img: 'images/сон.jpg' }
];

let currentFilter = 'all';

function loadGalleryLikes() {
    let saved = localStorage.getItem('gallery_likes');
    if (saved) {
        let likesObj = JSON.parse(saved);
        for (let i = 0; i < galleryItems.length; i++) {
            if (likesObj[galleryItems[i].id]) {
                galleryItems[i].likes = likesObj[galleryItems[i].id];
            }
        }
    }
    renderGallery();
}

function renderGallery() {
    let container = document.getElementById('galleryGrid');
    if (!container) return;
    
    let filtered = [];
    for (let i = 0; i < galleryItems.length; i++) {
        if (currentFilter === 'all' || galleryItems[i].category === currentFilter) {
            filtered.push(galleryItems[i]);
        }
    }
    
    let photoCountSpan = document.getElementById('photoCount');
    if (photoCountSpan) photoCountSpan.innerText = filtered.length;
    
    let totalLikes = 0;
    for (let i = 0; i < galleryItems.length; i++) {
        totalLikes += galleryItems[i].likes;
    }
    let totalLikesSpan = document.getElementById('totalLikes');
    if (totalLikesSpan) totalLikesSpan.innerText = totalLikes;
    
    container.innerHTML = '';
    for (let i = 0; i < filtered.length; i++) {
        let item = filtered[i];
        let card = document.createElement('div');
        card.className = 'gallery-card';
        card.innerHTML = `
            <div class="card-img">
                <img src="${item.img}" alt="${item.title}">
            </div>
            <div class="card-content">
                <div class="card-info">
                    <span class="card-title">${item.title}</span>
                    <button class="like-btn" data-id="${item.id}">❤️ ${item.likes}</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    }
    
    let btns = document.querySelectorAll('.like-btn');
    for (let i = 0; i < btns.length; i++) {
        btns[i].onclick = function() {
            let id = parseInt(this.getAttribute('data-id'));
            for (let j = 0; j < galleryItems.length; j++) {
                if (galleryItems[j].id === id) {
                    galleryItems[j].likes++;
                    this.innerHTML = '❤️ ' + galleryItems[j].likes;
                    let store = {};
                    for (let k = 0; k < galleryItems.length; k++) {
                        store[galleryItems[k].id] = galleryItems[k].likes;
                    }
                    localStorage.setItem('gallery_likes', JSON.stringify(store));
                    let newTotal = 0;
                    for (let k = 0; k < galleryItems.length; k++) {
                        newTotal += galleryItems[k].likes;
                    }
                    let totalSpan = document.getElementById('totalLikes');
                    if (totalSpan) totalSpan.innerText = newTotal;
                    break;
                }
            }
        };
    }
}

function setupFilters() {
    let btns = document.querySelectorAll('.filter-btn');
    for (let i = 0; i < btns.length; i++) {
        btns[i].onclick = function() {
            for (let j = 0; j < btns.length; j++) {
                btns[j].classList.remove('active');
            }
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            renderGallery();
        };
    }
}

function resetAllLikes() {
    for (let i = 0; i < galleryItems.length; i++) {
        galleryItems[i].likes = 0;
    }
    localStorage.setItem('gallery_likes', JSON.stringify({}));
    renderGallery();
}

function setupContactForm() {
    let form = document.getElementById('feedbackForm');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            let name = document.getElementById('name').value.trim();
            let email = document.getElementById('email').value.trim();
            let msg = document.getElementById('message').value.trim();
            let consent = document.getElementById('consent').checked;
            if (name && email && msg && consent) {
                alert('Спасибо, ' + name + '! Ваше сообщение отправлено.');
                form.reset();
            } else {
                alert('Заполните все поля и поставьте галочку.');
            }
        };
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('tasksList')) {
        loadTasks();
        let clearBtn = document.getElementById('clearDoneBtn');
        let resetBtn = document.getElementById('resetAllBtn');
        if (clearBtn) clearBtn.onclick = clearDoneTasks;
        if (resetBtn) resetBtn.onclick = resetAllTasks;
    }
    if (document.getElementById('galleryGrid')) {
        loadGalleryLikes();
        setupFilters();
        let resetLikesBtn = document.getElementById('resetLikesBtn');
        if (resetLikesBtn) {
            resetLikesBtn.onclick = resetAllLikes;
        }
    }
    setupContactForm();
});