// Get references to HTML elements
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedButton = document.getElementById('clear-completed-button');
const container = document.querySelector('.container');

let currentFilter = 'all';

// --- Event Listeners ---
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});
filterButtons.forEach(button => {
    button.addEventListener('click', () => setFilter(button.dataset.filter));
});
clearCompletedButton.addEventListener('click', clearCompletedTasks);
document.addEventListener('DOMContentLoaded', loadTasks);

// --- Core Logic ---

function loadTasks() {
    // Load tasks from Local Storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskData => createTaskElement(taskData.text, taskData.completed, taskData.id));
    applyFilter();
}

function saveTasks() {
    // Save current tasks to Local Storage
    const tasksToSave = [];
    taskList.querySelectorAll('li').forEach(listItem => {
        const isCompleted = listItem.classList.contains('completed');
        const taskText = listItem.querySelector('.task-text').textContent;
        
        tasksToSave.push({
            id: listItem.dataset.id,
            text: taskText,
            completed: isCompleted
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasksToSave));
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        // Visual feedback for empty input
        container.classList.add('shake');
        setTimeout(() => { container.classList.remove('shake'); }, 500);
        return;
    }

    const taskId = Date.now().toString();
    createTaskElement(taskText, false, taskId);
    taskInput.value = '';
    saveTasks();
    applyFilter();
}

function createTaskElement(text, completed, id) {
    const listItem = document.createElement('li');
    listItem.dataset.id = id;
    if (completed) {
        listItem.classList.add('completed');
    }

    // Task HTML structure with Checkbox, Task Text, and Action Buttons
    listItem.innerHTML = `
        <label class="task-content">
            <input type="checkbox" class="task-checkbox" ${completed ? 'checked' : ''}>
            <span class="task-text">${text}</span>
        </label>
        <div class="task-actions">
            <button class="action-btn edit-btn" title="Edit Task"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete-btn" title="Delete Task"><i class="fas fa-trash-alt"></i></button>
        </div>
    `;

    // Get element references for event listeners
    const checkbox = listItem.querySelector('.task-checkbox');
    const taskTextSpan = listItem.querySelector('.task-text');
    const editButton = listItem.querySelector('.edit-btn');
    const deleteButton = listItem.querySelector('.delete-btn');
    const taskContentLabel = listItem.querySelector('.task-content');

    // --- Checkbox Completion Toggle ---
    checkbox.addEventListener('change', function() {
        listItem.classList.toggle('completed', checkbox.checked);
        saveTasks();
        applyFilter();
    });

    // --- Edit Task Functionality ---
    editButton.addEventListener('click', function(event) {
        event.stopPropagation();
        
        // Function to restore the task text and exit edit mode
        const exitEditMode = (inputField) => {
            taskTextSpan.textContent = inputField.value.trim();
            listItem.classList.remove('editing');
            
            // Rebuild the label content: Checkbox + Task Text
            taskContentLabel.textContent = '';
            taskContentLabel.appendChild(checkbox);
            taskContentLabel.appendChild(taskTextSpan);
            
            saveTasks();
        };

        if (listItem.classList.contains('editing')) {
            // Already editing: save on button click
            exitEditMode(listItem.querySelector('input[type="text"]'));
        } else {
            // Not editing: enter edit mode
            listItem.classList.add('editing');
            const currentText = taskTextSpan.textContent;
            
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = currentText;
            inputField.maxLength = 100;
            
            // Temporarily replace label content with input field
            taskContentLabel.textContent = '';
            taskContentLabel.appendChild(inputField);
            
            inputField.focus();

            // Bind events to exit edit mode
            inputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') exitEditMode(inputField); });
            inputField.addEventListener('blur', () => exitEditMode(inputField));
        }
    });

    // --- Delete Task ---
    deleteButton.addEventListener('click', function(event) {
        event.stopPropagation();
        taskList.removeChild(listItem);
        saveTasks();
    });

    taskList.appendChild(listItem);
}

// --- Filter Functions ---
function setFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.filter === filter) {
            button.classList.add('active');
        }
    });
    applyFilter();
}

function applyFilter() {
    taskList.querySelectorAll('li').forEach(listItem => {
        const isCompleted = listItem.classList.contains('completed');
        switch (currentFilter) {
            case 'all':
                listItem.style.display = 'flex';
                break;
            case 'pending':
                listItem.style.display = isCompleted ? 'none' : 'flex';
                break;
            case 'completed':
                listItem.style.display = isCompleted ? 'flex' : 'none';
                break;
        }
    });
}

function clearCompletedTasks() {
    const completedTasks = taskList.querySelectorAll('li.completed');
    
    if (completedTasks.length === 0) {
        alert("No completed tasks to clear!");
        return;
    }
    
    if (confirm("Are you sure you want to clear all completed tasks?")) {
        completedTasks.forEach(task => task.remove());
        saveTasks();
        applyFilter();
    }
}