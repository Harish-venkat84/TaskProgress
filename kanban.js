export default class Kanban {
  static getTasks(columnId) {
    const data = read().find((column) => column.columnId === columnId);
    if (!data) {
      return [];
    }
    return data.tasks;
  }

  static insertTask(columnId, content) {
    const data = read();
    const column = data.find((column) => column.columnId === columnId);
    const task = {
      taskId: Math.floor(Math.random() * 100000),
      content: content,
    };

    column.tasks.push(task);
    save(data);

    return task;
  }

  static updateTask(taskId, updatedInformation) {
    const data = read();

    function findColumnTask() {
      for (const column of data) {
        const task = column.tasks.find((item) => item.taskId === taskId);
        if (task) {
          return [task, column];
        }
      }
    }

    const [task, currentcolumn] = findColumnTask();

    const tragetcolumn = data.find((column) => column.columnId === updatedInformation.columnId);

    task.content = updatedInformation.content;
    currentcolumn.tasks.splice(currentcolumn.tasks.indexOf(task), 1);
    tragetcolumn.tasks.push(task);

    save(data);
  }

  static deleteTask(taskId) {
    const data = read();

    for (const column of data) {
      const task = column.tasks.find((item) => item.taskId === taskId);
      if (task) {
        column.tasks.splice(column.tasks.indexOf(task), 1);
      }
    }

    save(data);
  }

  static getAllTask() {
    const data = read();
    columnCount();
    return [data[0].tasks, data[1].tasks, data[2].tasks];
  }
}

function read() {
  const data = localStorage.getItem("data");
  return JSON.parse(data);
}

function save(data) {
  localStorage.setItem("data", JSON.stringify(data));
  columnCount();
}

function columnCount() {
  const data = read();

  const todo = document.querySelector("span.todo");
  const pending = document.querySelector("span.pending");
  const completed = document.querySelector("span.completed");

  todo.textContent = data[0].tasks.length;
  pending.textContent = data[1].tasks.length;
  completed.textContent = data[2].tasks.length;
}

// Kanban.insertTask(0, "Adding new task");
