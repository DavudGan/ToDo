import { makeAutoObservable, autorun } from "mobx";

export class Task {
  id: string; // Уникальный идентификатор задачи
  title: string; // Название задачи
  description: string; // Описание задачи
  isComplete: boolean; // Флаг завершенности задачи
  isExpanded: boolean; // Флаг, указывающий, развернуты ли подзадачи
  subtasks: Task[]; // Массив подзадач (каждая подзадача также является объектом класса Task)

  constructor(
    id: string,
    title: string,
    description: string = "",
    isComplete = false,
    isExpanded = true,
    subtasks: Task[] = []
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isComplete = isComplete;
    this.isExpanded = isExpanded;
    this.subtasks = subtasks;

    /* makeAutoObservable делает свойства класса наблюдаемыми для MobX,
     что позволяет автоматически отслеживать изменения. */
    makeAutoObservable(this);
  }

  toggleCompletion() {
    this.isComplete = !this.isComplete;
    this.subtasks.forEach((subtask) =>
      subtask.updateCompletion(this.isComplete)
    );
  }
  updateCompletion(status: boolean) {
    this.isComplete = status;
    this.subtasks.forEach((subtask) => subtask.updateCompletion(status));
  }
}

class TaskStore {
  tasks: Task[] = []; // Массив задач
  selectedTask: Task | null = null;

  constructor() {
    makeAutoObservable(this);

    // Загрузка задач из файла при инициализации хранилища
    this.loadTasksFromFile();
    autorun(() => {
      const tasksSnapshot = JSON.stringify(this.tasks);
      localStorage.setItem("tasksData", tasksSnapshot);
    });
  }

  // Метод загрузки задач из JSON файла и сохранение их в localStorage.
  loadTasksFromFile() {
    const tasksData = localStorage.getItem("tasksData");
    if (tasksData) {
      this.parseTaskData(tasksData);
    } else {
      console.log("Из файла");
      fetch("/tasks.json")
        .then((response) => response.text())
        .then((data) => {
          // Сохранение загруженных данных задач в localStorage
          localStorage.setItem("tasksData", data);

          this.parseTaskData(data);
        })
        .catch((error) => console.error("Ошибка при загрузке задач:", error));
    }
  }

  setLocalStorage(tasks: Task[]) {
    localStorage.setItem("tasksData", JSON.stringify(tasks));
  }

  parseTaskData(tasksData: string) {
    console.log("Из localStorage");
    const parsedTasks = JSON.parse(tasksData);
    this.tasks = parsedTasks.map((taskData: any) => this.createTask(taskData));
  }

  // Метод создания объекта Task на основе данных
  createTask(taskData: any): Task {
    const { id, title, description, isComplete, isExpanded, subtasks } =
      taskData;

    // Рекурсивное создание подзадач, если они есть
    return new Task(
      id,
      title,
      description,
      isComplete,
      isExpanded,
      subtasks ? subtasks.map((subtask: any) => this.createTask(subtask)) : []
    );
  }

  setIsExpanded(id: string) {
    const task = this.findTaskById(id);
    if (task) {
      task.isExpanded = !task.isExpanded;
    }
  }

  toggleTaskCompletion(id: string) {
    const task = this.findTaskById(id);
    if (task) {
      task.toggleCompletion();
    }
    this.updateParentsCompletion(id);
  }

  updateParentsCompletion(id: string) {
    let parent = this.findParent(id, this.tasks);
    while (parent) {
      parent.isComplete = parent?.subtasks.every(
        (subtask) => subtask.isComplete
      );
      parent = this.findParent(parent.id, this.tasks);
    }
  }

  deleteTask(id: string) {
    let parent = this.findParent(id, this.tasks);
    const taskContainer = parent ? parent.subtasks : this.tasks;
    const deleteTaskIndex = taskContainer.findIndex((task) => task.id === id);
    taskContainer.splice(deleteTaskIndex, 1);

    console.log(taskContainer.findIndex((task) => task.id === id));
  }

  addTask(newTask: Task, id?: string) {
    if (id) {
      const parent = this.findTaskById(id);
      parent?.subtasks.push(newTask);
    } else {
      this.tasks.push(newTask);
    }
  }

  editTask(id: string, title: string, description: string) {
    const parent = this.findTaskById(id);
    if (parent) {
      parent.title = title;
      parent.description = description;
    }
  }

  setSelectedTask(id: string) {
    this.selectedTask = this.findTaskById(id) ?? null;
  }

  findParent(id: string, tasksToCheck: Task[]): Task | undefined {
    for (let task of tasksToCheck) {
      if (task.subtasks?.some((subtask) => subtask.id === id)) {
        return task;
      }

      const result = this.findParent(id, task.subtasks);
      if (result) {
        return result;
      }
    }
  }

  // Метод поиска задачи по уникальному идентификатору в списке задач и их подзадачах
  findTaskById(id: string): Task | null {
    const findInSubtasks = (taskList: Task[]): Task | null => {
      for (const task of taskList) {
        if (task.id === id) return task;

        const foundInSubtasks = findInSubtasks(task.subtasks);
        if (foundInSubtasks) return foundInSubtasks;
      }
      return null;
    };

    return findInSubtasks(this.tasks);
  }
}

export default new TaskStore();
