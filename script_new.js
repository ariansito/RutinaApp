// App State
let currentTab = "work";
let tasks = JSON.parse(localStorage.getItem("rutinaApp_tasks")) || [];

// DOM Elements
const addTaskBtn = document.getElementById("addTaskBtn");
const taskModal = document.getElementById("taskModal");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const taskForm = document.getElementById("taskForm");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const emptyState = document.getElementById("emptyState");

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
    setupEventListeners();
    renderTasks();
    updateEmptyState();
});

function initializeApp() {
    // Set current time as default
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    document.getElementById("taskTime").value = timeString;
}

function setupEventListeners() {
    // Modal controls
    addTaskBtn.addEventListener("click", openModal);
    closeModal.addEventListener("click", closeModalFunc);
    cancelBtn.addEventListener("click", closeModalFunc);
    
    // Close modal when clicking outside
    taskModal.addEventListener("click", (e) => {
        if (e.target === taskModal) {
            closeModalFunc();
        }
    });
    
    // Form submission
    taskForm.addEventListener("submit", handleTaskSubmit);
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });
}

// Modal Functions
function openModal() {
    taskModal.classList.add("active");
    document.body.style.overflow = "hidden";
    document.getElementById("taskTitle").focus();
}

function closeModalFunc() {
    taskModal.classList.remove("active");
    document.body.style.overflow = "auto";
    taskForm.reset();
    initializeApp(); // Reset time to current time
}

// Tab Functions
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    tabBtns.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === tabName);
    });
    
    // Update tab content
    tabContents.forEach(content => {
        content.classList.toggle("active", content.id === `${tabName}-content`);
    });
    
    renderTasks();
    updateEmptyState();
}

// Task Functions
function handleTaskSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(taskForm);
    const task = {
        id: Date.now().toString(),
        title: formData.get("taskTitle") || document.getElementById("taskTitle").value,
        category: formData.get("taskCategory") || document.getElementById("taskCategory").value,
        time: formData.get("taskTime") || document.getElementById("taskTime").value,
        priority: formData.get("taskPriority") || document.getElementById("taskPriority").value,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    addTask(task);
    closeModalFunc();
}

function addTask(task) {
    tasks.push(task);
    saveTasks();
    renderTasks();
    updateEmptyState();
    
    // Show success notification
    showNotification("Tarea creada exitosamente", "success");
}

function toggleTaskComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        
        const message = task.completed ? "Tarea completada" : "Tarea marcada como pendiente";
        showNotification(message, "info");
    }
}

function deleteTask(taskId) {
    if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
        updateEmptyState();
        showNotification("Tarea eliminada", "warning");
    }
}

function renderTasks() {
    const workTasksContainer = document.getElementById("work-tasks");
    const lifeTasksContainer = document.getElementById("life-tasks");
    
    // Clear containers
    workTasksContainer.innerHTML = "";
    lifeTasksContainer.innerHTML = "";
    
    // Filter tasks by category
    const workTasks = tasks.filter(t => t.category === "work");
    const lifeTasks = tasks.filter(t => t.category === "life");
    
    // Sort tasks by time
    const sortTasks = (taskList) => {
        return taskList.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            return a.time.localeCompare(b.time);
        });
    };
    
    // Render work tasks
    sortTasks(workTasks).forEach(task => {
        workTasksContainer.appendChild(createTaskElement(task));
    });
    
    // Render life tasks
    sortTasks(lifeTasks).forEach(task => {
        lifeTasksContainer.appendChild(createTaskElement(task));
    });
}

function createTaskElement(task) {
    const taskElement = document.createElement("div");
    taskElement.className = `task-item ${task.completed ? "completed" : ""}`;
    taskElement.dataset.taskId = task.id;
    
    const priorityClass = `priority-${task.priority}`;
    
    taskElement.innerHTML = `
        <div class="task-priority ${priorityClass}"></div>
        <div class="task-header">
            <div class="task-title">${escapeHtml(task.title)}</div>
            <div class="task-time">${formatTime(task.time)}</div>
        </div>
        <div class="task-actions">
            <button class="action-btn complete" onclick="toggleTaskComplete('${task.id}')" title="${task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}">
                <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
            </button>
            <button class="action-btn delete" onclick="deleteTask('${task.id}')" title="Eliminar tarea">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return taskElement;
}

// Utility Functions
function saveTasks() {
    localStorage.setItem("rutinaApp_tasks", JSON.stringify(tasks));
}

function updateEmptyState() {
    const currentTasks = tasks.filter(t => t.category === currentTab);
    const isEmpty = currentTasks.length === 0;
    
    if (isEmpty) {
        emptyState.style.display = "block";
        emptyState.innerHTML = `
            <div class="empty-icon">
                <i class="fas fa-${currentTab === 'work' ? 'briefcase' : 'heart'}"></i>
            </div>
            <h3>No hay tareas de ${currentTab === 'work' ? 'trabajo' : 'vida personal'}</h3>
            <p>Comienza creando tu primera tarea para organizar tu día</p>
        `;
    } else {
        emptyState.style.display = "none";
    }
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = "translateX(0)";
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + N to add new task
    if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        openModal();
    }
    
    // Escape to close modal
    if (e.key === "Escape" && taskModal.classList.contains("active")) {
        closeModalFunc();
    }
});

// Add some sample tasks on first load
if (tasks.length === 0) {
    const sampleTasks = [
        {
            id: "1",
            title: "Revisar emails del día",
            category: "work",
            time: "09:00",
            priority: "high",
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: "2",
            title: "Ejercicio matutino",
            category: "life",
            time: "07:00",
            priority: "medium",
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: "3",
            title: "Planificar reunión de equipo",
            category: "work",
            time: "14:00",
            priority: "high",
            completed: false,
            createdAt: new Date().toISOString()
        }
    ];
    
    tasks = sampleTasks;
    saveTasks();
    renderTasks();
    updateEmptyState();
}
