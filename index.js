import Kanban from "./kanban.js";
import data from "./data.js";

const localData = JSON.parse(localStorage.getItem("data"));
if (localData === null) {
  localStorage.setItem("data", JSON.stringify(data));
}

const todo = document.querySelector(".cards.todo");
const pending = document.querySelector(".cards.pending");
const completed = document.querySelector(".cards.completed");

const taskbox = [todo, pending, completed];

function addTaskCard(task, index) {
  const element = document.createElement("form");
  element.className = "card";
  element.draggable = true;
  element.dataset.id = task.taskId;
  element.innerHTML = `<input type="text" name="task" autocomplete="off" disabled="disabled" value="${task.content}"/>
                        <div>
                            <span class="task-id">#${task.taskId}</span>
                            <span>
                            <button class="bi bi-pencil edit"></button>
                            <button class="bi bi-check-lg update hide update" data-id="${task.taskId}" data-columnId="${index}"></button>
                            <button class="bi bi-trash3 delete" data-id="${task.taskId}" data-columnId="${index}"></button>
                            </span>
                        </div>`;
  taskbox[index].appendChild(element);
}

Kanban.getAllTask().forEach((tasks, index) => {
  tasks.forEach((task) => {
    addTaskCard(task, index);
  });
});

const addFrom = document.querySelectorAll(".add");

addFrom.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.task.value.trim().length !== 0) {
      const task = Kanban.insertTask(Number(form.submit.dataset.id), form.task.value.trim());
      addTaskCard(task, Number(form.submit.dataset.id));
      form.reset();
    } else {
      form.reset();
    }
  });
});

taskbox.forEach((column) => {
  column.addEventListener("click", (event) => {
    event.preventDefault();
    const formInput = event.target.parentElement.parentElement.previousElementSibling;

    if (event.target.classList.contains("edit")) {
      formInput.removeAttribute("disabled");
      event.target.classList.add("hide");
      event.target.nextElementSibling.classList.remove("hide");
    }

    if (event.target.classList.contains("update")) {
      formInput.setAttribute("disabled", "disabled");
      event.target.classList.add("hide");
      event.target.previousElementSibling.classList.remove("hide");
      const taskId = Number(event.target.dataset.id);
      const columnId = event.target.dataset.columnId;
      const content = formInput.value;
      Kanban.updateTask(taskId, {
        columnId: columnId,
        content: content,
      });
    }
    if (event.target.classList.contains("delete")) {
      Kanban.deleteTask(Number(event.target.dataset.id));

      formInput.parentElement.remove();
    }
  });

  column.addEventListener("dragstart", (event) => {
    if (event.target.classList.contains("card")) {
      event.target.classList.add("dragging");
    }
  });

  column.addEventListener("dragover", (event) => {
    const card = document.querySelector(".dragging");
    column.appendChild(card);
  });

  column.addEventListener("dragend", (event) => {
    if (event.target.classList.contains("card")) {
      event.target.classList.remove("dragging");

      const taskId = Number(event.target.dataset.id);
      const columnId = Number(event.target.parentElement.dataset.id);
      const content = event.target.task.value;
      Kanban.updateTask(taskId, {
        columnId: columnId,
        content: content,
      });
    }
  });
});
