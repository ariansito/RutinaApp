// App State
let currentTab = "work";
let tasks = JSON.parse(localStorage.getItem("rutinaApp_tasks")) || [];
let events = JSON.parse(localStorage.getItem("rutinaApp_events")) || [];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    console.log("App initialized");
    initializeApp();
    setupEventListeners();
    renderTasks();
    updateEmptyState();
    updateDateTime();
    renderCalendar();
    renderTodayEvents();
    renderUpcomingEvents();
    
    // Update time every second
    setInterval(updateDateTime, 1000);
});

function initializeApp() {
    console.log("Initializing app...");
    // Set current time as default
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    
    const workStartDate = document.getElementById("workStartDate");
    if (workStartDate) {
        workStartDate.value = now.toISOString().split('T')[0];
    }
    
    const taskTimeEl = document.getElementById("taskTime");
    if (taskTimeEl) {
        taskTimeEl.value = timeString;
    }
}

function setupEventListeners() {
    console.log("Setting up event listeners...");
    
    // Modal controls
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskModal = document.getElementById("taskModal");
    const closeModal = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const taskForm = document.getElementById("taskForm");
    
    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", openModal);
    }
    if (closeModal) {
        closeModal.addEventListener("click", closeModalFunc);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener("click", closeModalFunc);
    }
    if (taskForm) {
        taskForm.addEventListener("submit", handleTaskSubmit);
    }
    
    // Close modal when clicking outside
    if (taskModal) {
        taskModal.addEventListener("click", (e) => {
            if (e.target === taskModal) {
                closeModalFunc();
            }
        });
    }
    
    // Tab switching
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });

    // Calendar navigation
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener("click", () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener("click", () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }

    // Event modal controls
    const addWorkScheduleBtn = document.getElementById("addWorkScheduleBtn");
    const addWeeklyMeetingBtn = document.getElementById("addWeeklyMeetingBtn");
    
    if (addWorkScheduleBtn) {
        addWorkScheduleBtn.addEventListener("click", openWorkScheduleModal);
    }
    if (addWeeklyMeetingBtn) {
        addWeeklyMeetingBtn.addEventListener("click", openWeeklyMeetingModal);
    }
    
    // Close buttons for event modals
    const closeWorkScheduleModal = document.getElementById("closeWorkScheduleModal");
    const closeWeeklyMeetingModal = document.getElementById("closeWeeklyMeetingModal");
    const cancelWorkSchedule = document.getElementById("cancelWorkSchedule");
    const cancelWeeklyMeeting = document.getElementById("cancelWeeklyMeeting");
    
    if (closeWorkScheduleModal) {
        closeWorkScheduleModal.addEventListener("click", () => closeWorkScheduleModalFunc());
    }
    if (closeWeeklyMeetingModal) {
        closeWeeklyMeetingModal.addEventListener("click", () => closeWeeklyMeetingModalFunc());
    }
    if (cancelWorkSchedule) {
        cancelWorkSchedule.addEventListener("click", () => closeWorkScheduleModalFunc());
    }
    if (cancelWeeklyMeeting) {
        cancelWeeklyMeeting.addEventListener("click", () => closeWeeklyMeetingModalFunc());
    }

    // Event form submissions
    const workScheduleForm = document.getElementById("workScheduleForm");
    const weeklyMeetingForm = document.getElementById("weeklyMeetingForm");
    
    if (workScheduleForm) {
        workScheduleForm.addEventListener("submit", handleWorkScheduleSubmit);
    }
    if (weeklyMeetingForm) {
        weeklyMeetingForm.addEventListener("submit", handleWeeklyMeetingSubmit);
    }

    // Close modals when clicking outside
    const workScheduleModal = document.getElementById("workScheduleModal");
    const weeklyMeetingModal = document.getElementById("weeklyMeetingModal");
    
    if (workScheduleModal) {
        workScheduleModal.addEventListener("click", (e) => {
            if (e.target === workScheduleModal) closeWorkScheduleModalFunc();
        });
    }
    if (weeklyMeetingModal) {
        weeklyMeetingModal.addEventListener("click", (e) => {
            if (e.target === weeklyMeetingModal) closeWeeklyMeetingModalFunc();
        });
    }
}

// Date and Time Functions
function updateDateTime() {
    const currentDateEl = document.getElementById("currentDate");
    const currentTimeEl = document.getElementById("currentTime");
    
    if (!currentDateEl || !currentTimeEl) {
        console.log("Date/time elements not found");
        return;
    }
    
    const now = new Date();
    
    // Update date
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };
    currentDateEl.textContent = now.toLocaleDateString('es-ES', dateOptions);
    
    // Update time
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    currentTimeEl.textContent = now.toLocaleTimeString('es-ES', timeOptions);
}

// Modal Functions
function openModal() {
    const taskModal = document.getElementById("taskModal");
    if (taskModal) {
        taskModal.classList.add("active");
        document.body.style.overflow = "hidden";
        const taskTitle = document.getElementById("taskTitle");
        if (taskTitle) taskTitle.focus();
    }
}

function closeModalFunc() {
    const taskModal = document.getElementById("taskModal");
    const taskForm = document.getElementById("taskForm");
    const recurringOptions = document.getElementById("recurringOptions");
    
    if (taskModal) {
        taskModal.classList.remove("active");
        document.body.style.overflow = "auto";
        if (taskForm) taskForm.reset();
        if (recurringOptions) recurringOptions.style.display = "none";
        initializeApp();
    }
}

function openWorkScheduleModal() {
    const workScheduleModal = document.getElementById("workScheduleModal");
    if (workScheduleModal) {
        workScheduleModal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeWorkScheduleModalFunc() {
    const workScheduleModal = document.getElementById("workScheduleModal");
    const workScheduleForm = document.getElementById("workScheduleForm");
    if (workScheduleModal) {
        workScheduleModal.classList.remove("active");
        document.body.style.overflow = "auto";
        // Reset the form to prevent duplicates
        if (workScheduleForm) {
            workScheduleForm.reset();
        }
    }
}

function openWeeklyMeetingModal() {
    const weeklyMeetingModal = document.getElementById("weeklyMeetingModal");
    if (weeklyMeetingModal) {
        weeklyMeetingModal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeWeeklyMeetingModalFunc() {
    const weeklyMeetingModal = document.getElementById("weeklyMeetingModal");
    const weeklyMeetingForm = document.getElementById("weeklyMeetingForm");
    if (weeklyMeetingModal) {
        weeklyMeetingModal.classList.remove("active");
        document.body.style.overflow = "auto";
        // Reset the form to prevent duplicates
        if (weeklyMeetingForm) {
            weeklyMeetingForm.reset();
        }
    }
}

// Tab Functions
function switchTab(tabName) {
    console.log("Switching to tab:", tabName);
    currentTab = tabName;
    
    // Update tab buttons
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === tabName);
    });
    
    // Update tab content
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach(content => {
        content.classList.toggle("active", content.id === `${tabName}-content`);
    });
    
    if (tabName === "calendar") {
        renderCalendar();
        renderTodayEvents();
        renderUpcomingEvents();
    }
    
    renderTasks();
    updateEmptyState();
}

// Task Functions
function handleTaskSubmit(e) {
    e.preventDefault();
    
    const taskTitle = document.getElementById("taskTitle");
    const taskCategory = document.getElementById("taskCategory");
    const taskTime = document.getElementById("taskTime");
    const taskPriority = document.getElementById("taskPriority");
    const taskRecurring = document.getElementById("taskRecurring");
    
    if (!taskTitle || !taskCategory || !taskTime || !taskPriority) return;
    
    const task = {
        id: Date.now().toString(),
        title: taskTitle.value,
        category: taskCategory.value,
        time: taskTime.value,
        priority: taskPriority.value,
        completed: false,
        createdAt: new Date().toISOString(),
        recurring: taskRecurring.value === "yes"
    };
    
    // Add recurring days if it's a recurring task
    if (task.recurring) {
        const checkboxes = document.querySelectorAll('#recurringOptions input[type="checkbox"]:checked');
        if (checkboxes.length === 0) {
            showNotification("Selecciona al menos un día de la semana para tareas recurrentes", "warning");
            return;
        }
        task.recurringDays = Array.from(checkboxes).map(cb => parseInt(cb.value));
    }
    
    addTask(task);
    closeModalFunc();
}

function addTask(task) {
    tasks.push(task);
    saveTasks();
    renderTasks();
    updateEmptyState();
    
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

// Event Functions
function handleWorkScheduleSubmit(e) {
    e.preventDefault();
    
    const startTime = document.getElementById("workStartTime");
    const startDate = document.getElementById("workStartDate");
    const description = document.getElementById("workDescription");
    
    if (!startTime || !startDate || !description) return;
    
    createWorkSchedule(new Date(startDate.value), startTime.value, description.value);
    closeWorkScheduleModalFunc();
}

function handleWeeklyMeetingSubmit(e) {
    e.preventDefault();
    
    const meetingTime = document.getElementById("meetingTime");
    const description = document.getElementById("meetingDescription");
    const checkboxes = document.querySelectorAll('#weeklyMeetingModal input[type="checkbox"]:checked');
    
    if (!meetingTime || !description) return;
    
    const selectedDays = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    if (selectedDays.length === 0) {
        showNotification("Selecciona al menos un día de la semana", "warning");
        return;
    }
    
    createWeeklyMeetings(selectedDays, meetingTime.value, description.value);
    closeWeeklyMeetingModalFunc();
}

function createWorkSchedule(startDate, time, description) {
    // Remove any existing work schedule to prevent duplicates
    events = events.filter(event => event.type !== "work_schedule");
    
    const event = {
        id: Date.now().toString(),
        title: description,
        type: "work_schedule",
        time: time,
        startDate: startDate.toISOString(),
        pattern: "6x4", // 6 days on, 4 days off
        recurring: true,
        createdAt: new Date().toISOString()
    };
    
    events.push(event);
    saveEvents();
    renderTodayEvents();
    renderUpcomingEvents();
    renderCalendar();
    
    showNotification("Horario de trabajo 6x4 configurado", "success");
}

function createWeeklyMeetings(days, time, description) {
    // Remove any existing weekly meetings to prevent duplicates
    events = events.filter(event => event.type !== "weekly_meeting");
    
    days.forEach(dayOfWeek => {
        const event = {
            id: Date.now().toString() + dayOfWeek,
            title: description,
            type: "weekly_meeting",
            time: time,
            dayOfWeek: dayOfWeek, // 0=Sunday, 1=Monday, etc.
            recurring: true,
            createdAt: new Date().toISOString()
        };
        
        events.push(event);
    });
    
    saveEvents();
    renderTodayEvents();
    renderUpcomingEvents();
    renderCalendar();
    
    showNotification("Reuniones semanales configuradas", "success");
}

function getEventsForDate(date) {
    const dayOfWeek = date.getDay();
    
    const dayEvents = [];
    
    // Get recurring events (ONLY work_schedule and weekly_meeting)
    events.forEach(event => {
        if (event.type === "weekly_meeting") {
            if (event.dayOfWeek === dayOfWeek) {
                dayEvents.push(event);
            }
        } else if (event.type === "work_schedule") {
            // Only add work schedule if we have a valid start date
            if (event.startDate) {
                if (isWorkDay(date, new Date(event.startDate))) {
                    dayEvents.push(event);
                }
            }
        }
    });
    
    // Get recurring tasks (these will NOT have colors in calendar)
    tasks.forEach(task => {
        if (task.recurring && task.recurringDays && task.recurringDays.includes(dayOfWeek)) {
            dayEvents.push({
                id: task.id,
                title: task.title,
                type: "recurring_task",
                time: task.time,
                category: task.category,
                priority: task.priority,
                recurring: true,
                dayOfWeek: dayOfWeek
            });
        }
    });
    
    return dayEvents;
}

function isWorkDay(date, startDate) {
    // Ensure we have a valid start date
    if (!startDate || isNaN(startDate.getTime())) {
        return false;
    }
    
    const daysDiff = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
    
    // If the date is before the start date, it's not a work day
    if (daysDiff < 0) {
        return false;
    }
    
    // Calculate the position in the 10-day cycle (6 work + 4 rest)
    const cycle = daysDiff % 10;
    
    // First 6 days (0-5) are work days, next 4 days (6-9) are rest days
    const isWork = cycle < 6;
    
    console.log(`Date: ${date.toDateString()}, Start: ${startDate.toDateString()}, DaysDiff: ${daysDiff}, Cycle: ${cycle}, IsWork: ${isWork}`);
    
    return isWork;
}

// Calendar Functions
function renderCalendar() {
    const calendarGridEl = document.getElementById("calendarGrid");
    const currentMonthEl = document.getElementById("currentMonth");
    
    if (!calendarGridEl || !currentMonthEl) {
        console.log("Calendar elements not found");
        return;
    }
    
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    
    currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    calendarGridEl.innerHTML = "";
    
    // Add day headers
    const dayHeaders = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement("div");
        dayHeader.className = "calendar-header-day";
        dayHeader.textContent = day;
        calendarGridEl.appendChild(dayHeader);
    });
    
    // Add calendar days
    for (let i = 0; i < 42; i++) { // 6 weeks
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement("div");
        dayElement.className = "calendar-day";
        dayElement.textContent = date.getDate();
        dayElement.dataset.date = date.toISOString().split('T')[0];
        
        if (date.getMonth() !== currentMonth) {
            dayElement.classList.add("other-month");
        }
        
        if (date.toDateString() === new Date().toDateString()) {
            dayElement.classList.add("today");
        }
        
        const dayEvents = getEventsForDate(date);
        if (dayEvents.length > 0) {
            dayElement.classList.add("has-event");
            
            // Check if this day has work schedule (6x4 pattern) - ONLY this should be green
            const hasWorkSchedule = dayEvents.some(event => event.type === "work_schedule");
            const hasWeeklyMeeting = dayEvents.some(event => event.type === "weekly_meeting");
            
            // Debug: Log events for this day
            if (dayEvents.length > 0) {
                console.log(`Date: ${date.toDateString()}, Events:`, dayEvents.map(e => ({type: e.type, title: e.title})));
            }
            
            // ONLY add work-schedule class for actual 6x4 work schedule (not recurring tasks)
            if (hasWorkSchedule) {
                // Double-check that this is actually a work day according to the 6x4 pattern
                const workScheduleEvent = dayEvents.find(e => e.type === "work_schedule");
                if (workScheduleEvent && workScheduleEvent.startDate) {
                    const startDate = new Date(workScheduleEvent.startDate);
                    if (isWorkDay(date, startDate)) {
                        dayElement.classList.add("work-schedule");
                        console.log(`Adding work-schedule class to ${date.toDateString()}`);
                    } else {
                        console.log(`NOT adding work-schedule class to ${date.toDateString()} - not a work day`);
                    }
                }
            } else if (hasWeeklyMeeting) {
                // ONLY add weekly-meeting class for actual weekly meetings (not recurring tasks)
                dayElement.classList.add("weekly-meeting");
                console.log(`Adding weekly-meeting class to ${date.toDateString()}`);
            }
            // NOTE: Recurring tasks (recurring_task) will have "has-event" class but NO color class
        }
        
        // Add click event to show day events
        dayElement.addEventListener("click", () => {
            selectCalendarDay(date, dayElement);
        });
        
        calendarGridEl.appendChild(dayElement);
    }
}

function selectCalendarDay(date, dayElement) {
    // Remove previous selection
    const previousSelected = document.querySelector(".calendar-day.selected");
    if (previousSelected) {
        previousSelected.classList.remove("selected");
    }
    
    // Add selection to current day
    dayElement.classList.add("selected");
    
    // Show events for selected day
    showSelectedDayEvents(date);
}

function showSelectedDayEvents(date) {
    const selectedDayEventsEl = document.getElementById("selectedDayEvents");
    const selectedDayEventsListEl = document.getElementById("selectedDayEventsList");
    
    if (!selectedDayEventsEl || !selectedDayEventsListEl) return;
    
    const dayEvents = getEventsForDate(date);
    
    // Format date for display
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };
    const formattedDate = date.toLocaleDateString('es-ES', dateOptions);
    
    // Update section title
    const titleEl = selectedDayEventsEl.querySelector("h3");
    if (titleEl) {
        titleEl.innerHTML = `<i class="fas fa-calendar-day"></i> Eventos del ${formattedDate}`;
    }
    
    // Clear and populate events list
    selectedDayEventsListEl.innerHTML = "";
    
    if (dayEvents.length === 0) {
        selectedDayEventsListEl.innerHTML = `
            <div style="text-align: center; color: #6c757d; padding: 2rem;">
                <i class="fas fa-calendar-times" style="font-size: 2rem; margin-bottom: 1rem; display: block; color: #a0aec0;"></i>
                <p>No hay eventos programados para este día</p>
            </div>
        `;
    } else {
        dayEvents.forEach(event => {
            const eventElement = document.createElement("div");
            eventElement.className = "event-item";
            
            eventElement.innerHTML = `
                <div class="event-info">
                    <div class="event-time">${formatTime(event.time)}</div>
                    <div>
                        <div class="event-title">${escapeHtml(event.title)}</div>
                        <div class="event-type">${getEventTypeLabel(event.type)}</div>
                    </div>
                </div>
            `;
            
            selectedDayEventsListEl.appendChild(eventElement);
        });
    }
    
    // Show the events section
    selectedDayEventsEl.style.display = "block";
    
    // Scroll to events section smoothly
    selectedDayEventsEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderTodayEvents() {
    const todayEventsEl = document.getElementById("todayEvents");
    
    if (!todayEventsEl) {
        console.log("Today events element not found");
        return;
    }
    
    const today = new Date();
    const todayEvents = getEventsForDate(today);
    
    todayEventsEl.innerHTML = "";
    
    if (todayEvents.length === 0) {
        todayEventsEl.innerHTML = '<p style="color: #6c757d; text-align: center;">No hay eventos programados para hoy</p>';
        return;
    }
    
    todayEvents.forEach(event => {
        const eventElement = document.createElement("div");
        eventElement.className = "event-item";
        
        eventElement.innerHTML = `
            <div class="event-info">
                <div class="event-time">${formatTime(event.time)}</div>
                <div>
                    <div class="event-title">${escapeHtml(event.title)}</div>
                    <div class="event-type">${getEventTypeLabel(event.type)}</div>
                </div>
            </div>
        `;
        
        todayEventsEl.appendChild(eventElement);
    });
}

function renderUpcomingEvents() {
    const upcomingEventsEl = document.getElementById("upcomingEvents");
    
    if (!upcomingEventsEl) {
        console.log("Upcoming events element not found");
        return;
    }
    
    const upcoming = [];
    const today = new Date();
    
    // Get next 7 days of events
    for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayEvents = getEventsForDate(date);
        
        dayEvents.forEach(event => {
            upcoming.push({
                ...event,
                date: date
            });
        });
    }
    
    upcomingEventsEl.innerHTML = "";
    
    if (upcoming.length === 0) {
        upcomingEventsEl.innerHTML = '<p style="color: #6c757d; text-align: center;">No hay eventos próximos</p>';
        return;
    }
    
    upcoming.slice(0, 5).forEach(event => {
        const eventElement = document.createElement("div");
        eventElement.className = "event-item";
        
        const dateStr = event.date.toLocaleDateString('es-ES', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        eventElement.innerHTML = `
            <div class="event-info">
                <div class="event-time">${dateStr}</div>
                <div>
                    <div class="event-title">${escapeHtml(event.title)}</div>
                    <div class="event-type">${formatTime(event.time)} - ${getEventTypeLabel(event.type)}</div>
                </div>
            </div>
        `;
        
        upcomingEventsEl.appendChild(eventElement);
    });
}

function getEventTypeLabel(type) {
    switch (type) {
        case "work_schedule": return "Trabajo 6x4";
        case "weekly_meeting": return "Reunión";
        case "recurring_task": return "Tarea Recurrente";
        default: return "Evento";
    }
}

function renderTasks() {
    const workTasksContainer = document.getElementById("work-tasks");
    const lifeTasksContainer = document.getElementById("life-tasks");
    
    if (!workTasksContainer || !lifeTasksContainer) return;
    
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

function saveEvents() {
    localStorage.setItem("rutinaApp_events", JSON.stringify(events));
}

function updateEmptyState() {
    const emptyState = document.getElementById("emptyState");
    
    if (!emptyState) return;
    
    if (currentTab === "calendar") {
        emptyState.style.display = "none";
        return;
    }
    
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
    
    let bgColor = "#17a2b8";
    let icon = "info-circle";
    
    switch (type) {
        case "success":
            bgColor = "#28a745";
            icon = "check-circle";
            break;
        case "warning":
            bgColor = "#ffc107";
            icon = "exclamation-triangle";
            break;
        case "event":
            bgColor = "#667eea";
            icon = "bell";
            break;
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
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

// Add function to toggle recurring options
function toggleRecurringOptions() {
    const recurringSelect = document.getElementById("taskRecurring");
    const recurringOptions = document.getElementById("recurringOptions");
    
    if (recurringSelect && recurringOptions) {
        if (recurringSelect.value === "yes") {
            recurringOptions.style.display = "block";
        } else {
            recurringOptions.style.display = "none";
        }
    }
}

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
}
