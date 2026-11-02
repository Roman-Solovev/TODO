const form = document.getElementById("todoForm");
const input = document.getElementById("todo");
const searchInput = document.getElementById("search")
const taskList = document.querySelector(".taskList");
const counting = document.querySelector(".counting");
const deleteAll = document.querySelector(".deleteAll")

let tasks = loadTask();
let query = "";

function loadTask () {
    try {
        const itemStock = localStorage.getItem("todo:tasks");
        const pars = itemStock ? JSON.parse(itemStock) : [];
        return pars
    } catch {
        return []
    }
};

function saveTasks (tasks) {
    localStorage.setItem("todo:tasks", JSON.stringify(tasks))
};


function addTask (title) {
    tasks.push({id: Date.now(), title, done: false});
    saveTasks(tasks);
    render()
};


function render () {
    const visibleTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(query)
    )
    taskList.innerHTML = "";

    visibleTasks.forEach((task) => {
        const item = document.createElement("div");
        item.className = "task";
        item.dataset.id = task.id;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = task.id;
        checkbox.checked = task.done
        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.textContent = task.title;
        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "delete";
        delBtn.textContent = "\u00D7"
        item.append(checkbox, label, delBtn)
        taskList.append(item)
    })
    
    counting.textContent = `Total task: ${tasks.length}`
};

taskList.addEventListener("change", (event) => {
    const checkbox = event.target;
    const id = Number(checkbox.id);
    const task = tasks.find(e => e.id === id);
    if (!task) return;

    task.done = checkbox.checked;
    saveTasks(tasks);
});

taskList.addEventListener("click", (event) => {
    const btn = event.target.closest(".delete");
    if (!btn) return;

    const id = Number(btn.closest(".task").dataset.id) 
    tasks = tasks.filter(e => e.id !== id);
    
    saveTasks(tasks)
    render()
});

deleteAll.addEventListener("click", () => {
    if (!confirm("Delete all tasks?")) return;
    tasks = [];
    saveTasks(tasks);
    render();
});

searchInput.addEventListener("input", () => {
    query = searchInput.value.trim().toLowerCase();
    console.log(query)
    render()
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = input.value.trim()
    if (!title) return;
    
    addTask(title);

    input.value = "";

});

render();