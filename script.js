let tasks = [
    // --- To Do Column ---
    {
        id: 1,
        name: 'Api Integration',
        tag: 'backend',
        priority: 'high',
        status: 'toDo'
    },
    {
        id: 2,
        name: 'Design System',
        tag: 'ui/ux',
        priority: 'medium',
        status: 'toDo'
    },
    {
        id: 3,
        name: 'DB Schema',
        tag: 'database',
        priority: 'low',
        status: 'toDo'
    },

    // --- In Progress Column ---
    {
        id: 4,
        name: 'Kanban Layout',
        tag: 'frontend',
        priority: 'high',
        status: 'inProgress'
    },
    {
        id: 5,
        name: 'Auth Flow',
        tag: 'security',
        priority: 'medium',
        status: 'inProgress'
    },

    // --- Done Column ---
    {
        id: 6,
        name: 'Project Setup',
        tag: 'devops',
        priority: 'low',
        status: 'done'
    },
    {
        id: 7,
        name: 'Repo Structure',
        tag: 'git',
        priority: 'low',
        status: 'done'
    }
];

function buildTasks() {
    const toDoContainer = document.querySelector('.to-do .cards');
    const inProgressContainer = document.querySelector('.in-progress .cards');
    const doneContainer = document.querySelector('.done .cards');

    toDoContainer.innerHTML = '';
    inProgressContainer.innerHTML = '';
    doneContainer.innerHTML = '';

    tasks.forEach(task => {
        let arrowsHTML = '';
        if (task.status === 'toDo') {
            arrowsHTML = `<div class="right" data-id="${task.id}" data-target="inProgress">&rarr;</div>`;
        } else if (task.status === 'inProgress') {
            arrowsHTML = `
                <div class="left" data-id="${task.id}" data-target="toDo">&larr;</div>
                <div class="right" data-id="${task.id}" data-target="done">&rarr;</div>
            `;
        } else if (task.status === 'done') {
            arrowsHTML = `<div class="left" data-id="${task.id}" data-target="inProgress">&larr;</div>`;
        }

       
        const cardHTML = `
            <div class="card ${task.priority}" data-id="${task.id}" draggable="true">
                <h3>${task.name}</h3>
                <div class="inside">
                    <p class="tag">${task.tag}</p>
                    <div class="text">
                        <p class="priority-label">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</p>
                        <div class="arrow">
                            ${arrowsHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (task.status === 'toDo') {
            toDoContainer.innerHTML += cardHTML;
        } else if (task.status === 'inProgress') {
            inProgressContainer.innerHTML += cardHTML;
        } else if (task.status === 'done') {
            doneContainer.innerHTML += cardHTML;
        }
    });

    updateTaskCounts();
    addDragAndDropEvents(); 
}

function updateTaskCounts() {
    document.querySelector('.to-do .head .number').textContent = tasks.filter(t => t.status === 'toDo').length;
    document.querySelector('.in-progress .head .number').textContent = tasks.filter(t => t.status === 'inProgress').length;
    document.querySelector('.done .head .number').textContent = tasks.filter(t => t.status === 'done').length;
}

// left and right button activation
document.querySelector('.boxs').addEventListener('click', function (e) {
    const targetBtn = e.target.closest('.left, .right');
    if (!targetBtn) return;

    const taskId = Number(targetBtn.dataset.id);
    const newStatus = targetBtn.dataset.target;

    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = newStatus;
        buildTasks();
    }
});

// drag and drop activation
let draggedTaskId = null;

function addDragAndDropEvents() {
    const cards = document.querySelectorAll('.card');
    const columns = [
        { element: document.querySelector('.to-do'), status: 'toDo' },
        { element: document.querySelector('.in-progress'), status: 'inProgress' },
        { element: document.querySelector('.done'), status: 'done' }
    ];

   
    cards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
            draggedTaskId = Number(card.dataset.id);
            card.classList.add('is-dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('is-dragging');
            draggedTaskId = null;
        });
    });

   
    columns.forEach(col => {
        col.element.addEventListener('dragover', (e) => {
            e.preventDefault(); 
            e.dataTransfer.dropEffect = 'move';
            col.element.classList.add('drag-over');
        });

        col.element.addEventListener('dragleave', () => {
            col.element.classList.remove('drag-over');
        });

        col.element.addEventListener('drop', (e) => {
            e.preventDefault();
            col.element.classList.remove('drag-over');

            if (draggedTaskId) {
                const task = tasks.find(t => t.id === draggedTaskId);
                if (task && task.status !== col.status) {
                    task.status = col.status;
                    buildTasks();
                }
            }
        });
    });
}


buildTasks();

//add new task when click on Add Task button
const modal = document.getElementById('taskModal');
const addTaskBtn = document.querySelector('.title a');
const cancelBtn = document.getElementById('cancelBtn');
const taskForm = document.getElementById('taskForm');


addTaskBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('active');
});


cancelBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    taskForm.reset();
});


modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        taskForm.reset();
    }
});


taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('taskName').value.trim();
    const tag = document.getElementById('taskTag').value.trim();
    const priority = document.getElementById('taskPriority').value;

    if (!name || !tag) return;

   
    const newTask = {
        id: Date.now(),
        name: name,
        tag: tag,
        priority: priority,
        status: 'toDo' 
    };

    tasks.push(newTask); 
    buildTasks();       

    modal.classList.remove('active');
    taskForm.reset();
});