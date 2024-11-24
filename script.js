document.getElementById("addTaskBtn").addEventListener("click", addTask);

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskDescription = taskInput.value.trim();

    if (taskDescription) {
        const taskId = generateTaskId();
        const taskData = {
            id: taskId,
            description: taskDescription,
            column: "open"
        };

      
        saveTask(taskData);

     
        createTaskCard(taskData);

      
        taskInput.value = '';
    }
}

function generateTaskId() {
    return 'task_' + new Date().getTime();
}

function createTaskCard(taskData) {
    const column = document.getElementById(`tasks-${taskData.column}`);
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");
    taskCard.setAttribute("draggable", "true");
    taskCard.setAttribute("ondragstart", `drag(event)`);
    taskCard.setAttribute("id", taskData.id);

    taskCard.innerHTML = `
        <p>${taskData.description}</p>
        <button onclick="removeTask('${taskData.id}')">Remover</button>
    `;

    applyColumnColor(taskCard, taskData.column);

    column.appendChild(taskCard);
}

function removeTask(taskId) {
    const taskCard = document.getElementById(taskId);
    taskCard.remove();

    removeTaskFromStorage(taskId);
}

function removeTaskFromStorage(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
}

function saveTask(taskData) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(taskData);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function allowDrop(event) {
    event.preventDefault();  
    event.stopPropagation();
}

function drag(event) {
    event.dataTransfer.setData("taskId", event.target.id); 
}

function drop(event) {
    event.preventDefault(); 

    const taskId = event.dataTransfer.getData("taskId"); 
    const taskCard = document.getElementById(taskId);

    const newColumn = event.target.closest(".task-list");
    const newColumnId = newColumn.id;

    
    const columnMap = {
        "tasks-open": "open",
        "tasks-bid": "bid",
        "tasks-in-progress": "in-progress",
        "tasks-completed": "completed"
    };

    const newColumnName = columnMap[newColumnId];
    updateTaskColumn(taskId, newColumnName);

    newColumn.appendChild(taskCard);

    applyColumnColor(taskCard, newColumnName);
}

function updateTaskColumn(taskId, newColumnName) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.column = newColumnName;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function applyColumnColor(taskCard, column) {
    switch (column) {
        case "open":
            taskCard.style.backgroundColor = "#efff62"; 
            break;
        case "bid":
            taskCard.style.backgroundColor = "#e99b34"; 
            break;
        case "in-progress":
            taskCard.style.backgroundColor = "#5387e9"; 
            break;
        case "completed":
            taskCard.style.backgroundColor = "#7efa4d"; 
            break;
        default:
            taskCard.style.backgroundColor = "#ffffff"; 
            break;
    }
}

window.onload = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => createTaskCard(task));
};
