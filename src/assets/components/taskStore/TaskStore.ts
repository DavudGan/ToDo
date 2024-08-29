import { makeAutoObservable } from "mobx";

export class Task {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  isExpanded: boolean;
  subtasks: Task[];

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
    makeAutoObservable(this);
  }
}

class TaskStore {
  tasks: Task[] = [];
  selectedTask: Task | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadTasksFromFile();
  }

  loadTasksFromFile() {
    fetch("/tasks.json")
      .then((response) => response.json())
      .then((data) => {
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

  createTask(taskData: any): Task {
    const { id, title, description, isComplete, isExpanded, subtasks } =
      taskData;
    return new Task(
      id,
      title,
      description,
      isComplete,
      isExpanded,
      subtasks ? subtasks.map((subtask: any) => this.createTask(subtask)) : []
    );
  }

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
