import { makeAutoObservable } from "mobx";

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
}

class TaskStore {
  tasks: Task[] = []; // Массив задач
  selectedTask: Task | null = null;

  constructor() {
    makeAutoObservable(this);

    // Загрузка задач из файла при инициализации хранилища
    this.loadTasksFromFile();
  }

  // Метод загрузки задач из JSON файла и сохранение их в localStorage.
  loadTasksFromFile() {
    fetch("/tasks.json")
      .then((response) => response.json())
      .then((data) => {
        // Сохранение загруженных данных задач в localStorage
        localStorage.setItem("tasksData", JSON.stringify(data));
        const tasksData = localStorage.getItem("tasksData");
        if (tasksData) {
          const parsedTasks = JSON.parse(tasksData);
          this.tasks = parsedTasks.map((taskData: any) =>
            this.createTask(taskData)
          );
        }
      })
      .catch((error) => console.error("Ошибка при загрузке задач:", error));
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
