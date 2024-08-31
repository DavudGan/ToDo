import TaskTree from "./components/taskTree/TaskTree";
import TaskDetails from "./components/taskDetails/TaskDetails";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <h1>Менеджер задач</h1>
      <div className="content">
        <div className="task-tree">
          <TaskTree />
        </div>
        <div className="task-details">
          <TaskDetails />
        </div>
      </div>
    </div>
  );
}

export default App;
